import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
import lightgbm as lgb
import joblib, os
from backend.app.models.dataset_model import DatasetModel
from utils import get_logger
from config import ConfigLLM

# Configuration
MODEL_PATH = "models/lightgbm_reliability_model.pkl"
logger = get_logger("scoring_reliability")


def train_reliability_model():
    logger.info("[TRAINING] Loading validated dataset...")
    dataset = DatasetModel().where("score_reliability != NULL").query() # Les messages qui ont déjà un score = Le passé / Déjà validés
    df = pd.DataFrame(dataset)

    if df.empty:
        logger.warning("[TRAINING] No validated data to train on.")
        return

    features = [
        "similarity_cosine",
        "distance_levenshtein",
        "pii_factor"
    ]
    X = df[features]
    y = df["score_reliability"]

    logger.info("[TRAINING] Training LightGBM model...")
    model = lgb.LGBMClassifier()
    model.fit(X, y)

    logger.info(f"[TRAINING] Saving model to {MODEL_PATH}")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    logger.info("[TRAINING] Model saved.")


def calculate_scoring():
    logger.info("[SCORING] Loading model...")
    if not os.path.exists(MODEL_PATH):
        logger.error("No trained model found. Run train_reliability_model() first.")
        raise FileNotFoundError("No trained model found. Run train_reliability_model() first.")

    model = joblib.load(MODEL_PATH)

    logger.info("[SCORING] Loading unscored dataset...")

    orm = DatasetModel()

    rows = orm.where("score_reliability IS NULL").query()
    if not rows:
        logger.warning("[SCORING] No new entries to score.")
        return

    if not isinstance(rows, list):
        rows = [rows]

    for row in rows:
        features = [
            row.get("similarity_cosine", 0),
            row.get("distance_levenshtein", 0),
            row.get("pii_factor", 0)  # mettre 0 par défaut si absent
        ]
        score = model.predict_proba([features])[0][1]  # probabilité que ce soit une bonne donnée
        row.score_reliability = score
        if ConfigLLM.AUTO_VALIDATE:
            row.validated = is_validated(row)
        row.update()
        logger.info(f"[SCORING] Updated score for id {row.id} => {score:.4f}")


def is_validated(item: DatasetModel):
    return (
        item.similarity_cosine >= ConfigLLM.MIN_COSINE
        and item.distance_levenshtein >= ConfigLLM.MIN_LEVENSHTEIN
        and item.pii_factor < ConfigLLM.MAX_PII_FACTOR
        and item.needs_validation == False
    )