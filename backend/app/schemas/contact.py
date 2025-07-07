# backend/app/schemas/contact.py

from pydantic import BaseModel, EmailStr

class ContactForm(BaseModel):
    email: EmailStr
    topic: str
    other: str | None = None
    message: str
    userId: str