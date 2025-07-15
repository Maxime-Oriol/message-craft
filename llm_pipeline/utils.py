import logging
import os
from datetime import datetime


def get_logger(name: str):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    LOG_DIR = os.path.join(BASE_DIR, "logs")
    os.makedirs(LOG_DIR, exist_ok=True)
    filename = datetime.now().strftime("prepare_dataset-%Y-W%W.log")
    filepath = os.path.join(LOG_DIR, filename)

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')

        file_handler = logging.FileHandler(filepath, encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # Optionnel : affichage console
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

    return logger