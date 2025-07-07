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
    createdAt:datetime

    def save(self):
        self.createdAt = datetime.now()
        obj = {}
        for attr in self.__annotations__:
            if not attr.startswith("_"):
                value = getattr(self, attr, None)
                if value:
                    obj[attr] = value
        return self.insert(obj)