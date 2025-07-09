from datetime import datetime
from backend.app.db.orm import ORM, Table

class ContactModel(ORM):
    _name = "contact_message"

    id:str
    user_id:str
    email:str
    topic:str
    other:str|None
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