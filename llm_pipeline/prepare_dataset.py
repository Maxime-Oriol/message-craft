from asyncio.log import logger
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.models.message_model import MessageModel
from backend.app.models.dataset_model import DatasetModel
from llm_pipeline.sim_cosine import calculate_cosine
from llm_pipeline.dist_levenshtein import calculate_levenshtein
from llm_pipeline.classify_pii import mask_pii_llm
from llm_pipeline.utils import get_logger

def prepare_data():
    logger = get_logger("prepare_dataset")
    messages = MessageModel.get_non_transferred()
    if not messages:
        logger.warning("[PREPARE DATA] Tous les messages ont déjà été transférés dans le dataset.")
        return
    logger.info("[PREPARE DATA] ⏳ Préparation des données")
    
    for message in messages:
        try:
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

            if pii_factor is None or not pii_message:
                logger.error(f"Execution arrêtée car pii_factor ou pii_message manquant (message.id = {message.id}) !")
                continue
            if model.save():
                MessageModel(id= message.id).update("transferred_to_dataset", True)
                logger.info(f"La ligne MessageCraft.id = {message.id} a été transférée dans le dataset")
            else:
                logger.error(f"La ligne MessageCraft.id = {message.id} n'a pas pu être transférée")
        except Exception as e:
            logger.error(f"Erreur lors du traitement du message {message.id}: {e}")
            continue


    logger.info("✅ [PREPARE DATA] préparation de la data terminée")