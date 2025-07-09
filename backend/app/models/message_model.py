from datetime import datetime
from app.db.orm import ORM, Table

class MessageModel(ORM):
    _name = "craft_message"

    id:str
    user_id:str
    platform:str
    intent:str
    generated:str
    message:str
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
    
    @classmethod
    def get_non_transferred(cls) -> list:
        results = cls().where("transferred_to_dataset = FALSE").query()
        if not isinstance(results, list):
            results = [results]
        return [cls.from_dict(row) for row in results]