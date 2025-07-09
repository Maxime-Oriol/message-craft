from datetime import datetime
from backend.app.db.orm import ORM

class DatasetModel(ORM):
    _name = "llm_dataset"

    id:str
    message_id:str
    similarity_cosine:float
    distance_levenshtein:float
    score_reliability:float|None = None
    pii_factor:float
    pii_message:str|None
    validated:bool = False
    needs_validation:bool = True
    created_at:datetime

    def save(self):
        self.created_at = datetime.now()
        obj = {}
        for attr in self.__annotations__:
            if not attr.startswith("_"):
                value = getattr(self, attr, None)
                if value:
                    obj[attr] = value
        return self.insert(obj)