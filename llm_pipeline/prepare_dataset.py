from backend.app.models.message_model import MessageModel
from backend.app.models.dataset_model import DatasetModel
from sim_cosine import calculate_cosine
from dist_levenshtein import calculate_levenshtein

class DatasetBuilder:

    def prepare_data(self):
        messages = MessageModel.get_non_transferred()

        for message in messages:
            cosine = calculate_cosine(message)
            levenshtein = calculate_levenshtein(message)

            model = DatasetModel(
                message_id=message.id,
                similarity_cosine=cosine,
                distance_levenshtein=levenshtein
                score_reliability:float
                


    
    pii_message:str|None
    validated:bool = False
    needs_validation:bool = True
    created_at:datetime




            )
            model.save()

