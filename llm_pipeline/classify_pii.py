
from backend.app.models.message_model import MessageModel
from transformers import pipeline

# Initialisation du modèle NER
ner_model = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")

def pii_factor(text: str, entities: list[dict]) -> float:
    if not text:
        return 0.0
    pii_length = sum(e['end'] - e['start'] for e in entities)
    return round(pii_length / len(text), 4)

def mask_pii_llm(message: MessageModel) -> tuple[str, float]:
    """
    - Masque les entités PII dans le texte
    - Calcule le facteur de données sensibles
    - Retourne (texte_masqué, pii_factor)
    """
    entities = ner_model(message.message)
    masked_text = message.message
    for ent in sorted(entities, key=lambda e: e['start'], reverse=True):
        label = ent['entity_group']
        start, end = ent['start'], ent['end']
        masked_text = masked_text[:start] + f"<{label}>" + masked_text[end:]
    
    factor = pii_factor(message.message, entities)
    return masked_text, factor