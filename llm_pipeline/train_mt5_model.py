import os, shutil
import pandas as pd
from datetime import datetime
from transformers import T5Tokenizer, MT5ForConditionalGeneration, Trainer, TrainingArguments, DataCollatorForSeq2Seq
from datasets import Dataset
from llm_pipeline.utils import get_logger
from backend.app.models.dataset_model import DatasetModel
from llm_pipeline.config import ConfigLLM

# --- Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)
filename = datetime.now().strftime("mt5-base-%Y%m%d-%H%M%S.pkl")
latest_name = "mt5-base-latest.pkl"
MODEL_PATH = os.path.join(MODELS_DIR, filename)

logger = get_logger("train_mt5_model")


def train_mt5_model():
    logger.info("⏳ [MT5 MODEL] Début de l'entrainement du model")
    logger.info("[MT5 MODEL] Loading validated dataset...")
    dataset = DatasetModel().query(f"""
        SELECT craft_message.*, llm_dataset.*
        FROM llm_dataset
        INNER JOIN craft_message ON craft_message.id = llm_dataset.message_id
        WHERE llm_dataset.score_reliability > {ConfigLLM.MIN_SCORE_RELIABILITY}
        AND llm_dataset.validated = TRUE
    """)
    df = pd.DataFrame(dataset)

    if df.empty:
        logger.warning("[TRAINING] No validated data to train on.")
        return

    # --- Préparation des champs requis
    df = df[["platform", "intent", "message"]].dropna()

    # Format structuré recommandé pour les modèles seq2seq
    df["input_text"] = (
        "Plateforme: " + df["platform"] +
        " | Intention: " + df["intent"]
    )
    df["target_text"] = df["message"]

    # --- Initialisation du tokenizer et modèle mT5
    tokenizer = T5Tokenizer.from_pretrained("google/mt5-base")
    model = MT5ForConditionalGeneration.from_pretrained("google/mt5-base")

    # --- Tokenization
    def tokenize_function(examples):
        model_inputs = tokenizer(
            examples["input_text"],
            max_length=512,
            truncation=True,
            padding="max_length"
        )
        labels = tokenizer(
            examples["target_text"],
            max_length=128,
            truncation=True,
            padding="max_length"
        )
        model_inputs["labels"] = labels["input_ids"]
        return model_inputs

    hf_dataset = Dataset.from_pandas(df[["input_text", "target_text"]])
    tokenized_dataset = hf_dataset.map(tokenize_function, batched=True)

    # --- Arguments d'entraînement
    training_args = TrainingArguments(
        output_dir=MODEL_PATH,
        per_device_train_batch_size=4,
        num_train_epochs=5, # A réduire quand le dataset sera plus important
        logging_dir="./logs",
        logging_steps=10,
        save_strategy="epoch"
    )

    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model)

    # --- Entraînement
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator
    )

    logger.info("[TRAINING] Training mT5 model...")
    trainer.train()

    # --- Sauvegarde
    logger.info(f"[TRAINING] Saving model to {MODEL_PATH}")
    os.makedirs(MODEL_PATH, exist_ok=True)
    model.save_pretrained(MODEL_PATH)
    tokenizer.save_pretrained(MODEL_PATH)
    
    destination_path = os.path.join(MODELS_DIR, latest_name)
    if os.path.exists(destination_path):
        shutil.rmtree(destination_path)
    shutil.copytree(MODEL_PATH, destination_path)
    logger.info("[TRAINING] Model and tokenizer saved.")
    
    logger.info("[MT5 MODEL] ✅ Entrainement du model terminé")