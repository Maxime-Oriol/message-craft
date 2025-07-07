from datetime import datetime
from app.db.orm import ORM, Table

class MessageModel(ORM):
    _name = "CraftMessage"

    id:str
    userId:str
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