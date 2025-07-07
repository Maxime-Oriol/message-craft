import pandas as pd
import lightgbm as lgb
import joblib
import os
from backend.app.db.orm import ORM
from backend.app.models.dataset_model import DatasetModel

# Configuration
MODEL_PATH = "models/lightgbm_reliability_model.pkl"


def train_reliability_model():
    print("[TRAINING] Loading validated dataset...")
    dataset = DatasetModel().where("score_reliability != NULL").query() # Les messages qui ont déjà un score = Le passé / Déjà validés
    df = pd.DataFrame(dataset)

    if df.empty:
        print("[TRAINING] No validated data to train on.")
        return

    features = [
        "similarity_cosine",
        "distance_levenshtein",
        "pii_factor"
    ]
    X = df[features]
    y = df["score_reliability"]

    print("[TRAINING] Training LightGBM model...")
    model = lgb.LGBMClassifier()
    model.fit(X, y)

    print(f"[TRAINING] Saving model to {MODEL_PATH}")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print("[TRAINING] Model saved.")


def calculate_scoring():
    print("[SCORING] Loading model...")
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("No trained model found. Run train_reliability_model() first.")

    model = joblib.load(MODEL_PATH)

    print("[SCORING] Loading unscored dataset...")

    orm = DatasetModel()

    rows = orm.where("score_reliability IS NULL").query()
    if not rows:
        print("[SCORING] No new entries to score.")
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
        orm.update("score_reliability", score)
        print(f"[SCORING] Updated score for id {row['id']} => {score:.4f}")