import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.models.message_model import MessageModel
import Levenshtein

def calculate_levenshtein(message: MessageModel) -> float:
    distance = Levenshtein.distance(message.generated, message.message)
    max_len = max(len(message.generated), len(message.message))
    return 1 - distance / max_len