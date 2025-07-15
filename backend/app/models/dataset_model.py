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

    def _find_by_message(self, message_id: str):
        result = self.select().where("message_id = %s", (message_id,)).limit(1).query_row()
        if result:
            for key, value in result.items():
                setattr(self, key, value)
            return True
        return False

    def save(self):
        self.created_at = datetime.now()
        obj = {}
        for attr in self.__annotations__:
            if not attr.startswith("_"):
                value = getattr(self, attr, None)
                if value is not None:
                    obj[attr] = value
        return self.insert(obj)
    
    def validate(self):
        if not self.message_id:
            return False
        self._find_by_message(self.message_id)
        self.validated = True
        self.needs_validation = False
        return self.update()