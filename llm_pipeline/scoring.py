import sys, os, shutil
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
from datetime import datetime
import lightgbm as lgb
import joblib, os
from backend.app.models.dataset_model import DatasetModel
from llm_pipeline.utils import get_logger
from llm_pipeline.config import ConfigLLM
from numpy import clip
from decimal import Decimal, ROUND_HALF_UP

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)
filename = datetime.now().strftime("lightgbm-reliability-%Y%m%d-%H%M%S.pkl")
latest_name = "lightgbm-reliability-latest.pkl"
MODEL_PATH = os.path.join(MODELS_DIR, filename)

logger = get_logger("scoring_reliability")


def train_reliability_model():
    logger.info("[SCORING TRAINING] Loading validated dataset...")
    dataset = DatasetModel().where("score_reliability IS NOT NULL").query() # Les messages qui ont déjà un score = Le passé / Déjà validés
    df = pd.DataFrame(dataset)
    if df.empty:
        logger.warning("[SCORING TRAINING] No validated data to train on.")
        return False

    features = [
        "similarity_cosine",
        "distance_levenshtein",
        "pii_factor"
    ]
    X = df[features]
    y = df["score_reliability"]

    logger.info("[SCORING TRAINING] Training LightGBM model...")
    model = lgb.LGBMRegressor()
    model.fit(X, y)

    logger.info(f"[SCORING TRAINING] Saving model to {MODEL_PATH}")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    destination_path = os.path.join(MODELS_DIR, latest_name)
    if os.path.isfile(destination_path):
        os.remove(destination_path)
    shutil.copyfile(MODEL_PATH, destination_path)

    logger.info("✅ [SCORING TRAINING] Entrainement du model de scoring terminé")
    return True


def calculate_scoring():
    logger.info("⏳ [SCORING] Calcul des scores des nouvelles lignes")
    logger.info("[SCORING] Loading model...")
    
    destination_path = os.path.join(MODELS_DIR, latest_name)
    if not os.path.isfile(destination_path):
        logger.error("No trained model found. Run train_reliability_model() first.")
        
        # Entrainement du model puisque ça n'a pas été fait avant
        trained = train_reliability_model()
        if not trained:
            logger.warning("[SCORING] Skipping scoring. No valid data available to train")
            return

    model = joblib.load(destination_path)

    logger.info("[SCORING] Loading unscored dataset...")

    orm = DatasetModel()

    raw_data = orm.where("score_reliability IS NULL").query()
    rows: list[DatasetModel] = [DatasetModel(**row) for row in raw_data]
    if not rows:
        logger.warning("[SCORING] No new entries to score.")
        return

    for row in rows:
        features = [
            getattr(row, "similarity_cosine", 0),
            getattr(row, "distance_levenshtein", 0),
            getattr(row, "pii_factor", 0)
        ]
        
        # raw_score = model.predict([features])[0]
        # clipped_score = clip(raw_score, 0.0, 1.0)
        # score = float(Decimal(clipped_score).quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP))
        score = heuristic_score(features[0], features[1], features[2])
        row.score_reliability = score
        if ConfigLLM.AUTO_VALIDATE:
            row.validated = is_validated(row)
        row.update()
        logger.info(f"[SCORING] Updated score for id {row.id} => {score:.4f}")

    logger.info("✅ [SCORING] Calcul des scores terminé")

def is_validated(item: DatasetModel):
    return (
        item.similarity_cosine >= ConfigLLM.MIN_COSINE
        and item.distance_levenshtein >= ConfigLLM.MIN_LEVENSHTEIN
        and item.pii_factor < ConfigLLM.MAX_PII_FACTOR
        and item.needs_validation == False
    )

def heuristic_score(cosine: float, levenshtein: float, pii: float) -> float:
    # Pondérations ajustables
    weight_cosine = 0.45
    weight_lev = 0.35
    weight_pii = 0.2

    # Normalisation cohérente
    norm_cosine = min(cosine, 1)       # plus proche de 1 = mieux
    norm_lev = min(levenshtein, 1)     # plus proche de 1 = mieux
    norm_pii = 1 - min(pii, 1)         # plus proche de 1 = mieux (peu sensible)

    score = (
        weight_cosine * norm_cosine +
        weight_lev * norm_lev +
        weight_pii * norm_pii
    )
    return float(round(score, 4))