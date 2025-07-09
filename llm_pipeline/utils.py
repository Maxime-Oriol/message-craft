import logging
import os
from datetime import datetime

def get_logger(name: str):
    os.makedirs("logs", exist_ok=True)

    filename = datetime.now().strftime("logs/prepare_dataset-%Y-W%W.log")      # Hebdomadaire

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')

        file_handler = logging.FileHandler(filename, encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # Optionnel : affichage console
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

    return logger