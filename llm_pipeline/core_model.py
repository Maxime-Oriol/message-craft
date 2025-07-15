from llm_pipeline.scoring import train_reliability_model, calculate_scoring
from llm_pipeline.prepare_dataset import prepare_data
from llm_pipeline.train_mt5_model import train_mt5_model

def train_and_filter():

    # 1- Train scoring model based on previous data
    train_reliability_model() # -> Result is models/lightgbm_reliability_model.pkl
    
    # 2- récupère les non-transfered messsages + calcul cosine + levenshtein + anonymisation et PII factor
    prepare_data() # -> Résultat table llm_dataset avec tous les champs renseignés sauf le scoring
    
    # 4- Score new lines in lm_dataset
    calculate_scoring()
    
    # 5- Train the mT5-base with validated data
    train_mt5_model()
    print("✅✅ Execution terminée")

def train_mt5_only():
    prepare_data()
    train_mt5_model()

def scoring_only():
    prepare_data()
    calculate_scoring()