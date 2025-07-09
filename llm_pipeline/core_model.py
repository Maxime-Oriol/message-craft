from scoring import train_reliability_model, calculate_scoring
from prepare_dataset import prepare_data
from train_mt5_model import train_mt5_model

def train_and_filter():

    # 1- Train scoring model based on previous data
    print("⏳ Entrainement du model de scoring")
    train_reliability_model() # -> Result is models/lightgbm_reliability_model.pkl
    print("✅ Entrainement du model de scoring terminé")

    # 2- récupère les non-transfered messsages + calcul cosine + levenshtein + anonymisation et PII factor
    prepare_data() # -> Résultat table llm_dataset avec tous les champs renseignés sauf le scoring
    print("✅ préparation de la data terminée")
    
    # 4- Score new lines in lm_dataset
    print("⏳ Calcul des scores des nouvelles lignes")
    calculate_scoring()
    print("✅ Calcul des scores terminé")
    
    # 5- Train the mT5-base with validated data
    print("⏳ Entrainement du model de génération de text")
    train_mt5_model()
    print("✅ Entrainement du model de génération de text")
    print("Execution terminée")

train_and_filter()