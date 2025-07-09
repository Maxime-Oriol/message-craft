import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.models.message_model import MessageModel
from backend.app.models.dataset_model import DatasetModel
from sim_cosine import calculate_cosine
from dist_levenshtein import calculate_levenshtein
from classify_pii import mask_pii_llm
from utils import get_logger

def prepare_data():
    messages = MessageModel.get_non_transferred()
    logger = get_logger("prepare_dataset")

    for message in messages:
        cosine = calculate_cosine(message)
        levenshtein = calculate_levenshtein(message)
        pii_message, pii_factor = mask_pii_llm(message)

        model = DatasetModel(
            message_id=message.id,
            similarity_cosine=cosine,
            distance_levenshtein=levenshtein,
            pii_factor = pii_factor,
            pii_message = pii_message
        )
        if model.save():
            MessageModel(id= message.id).update("transferred_to_dataset", True)
            logger.info("La ligne MessageCraft.id = {message.id} a été transférée")
        else:
            logger.error("La ligne MessageCraft.id = {message.id} n'a pas pu être transférée")