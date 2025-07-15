from pydantic import BaseModel, Field
from typing import Literal, Optional

class MessageSchema(BaseModel):
    id: str = Field(None, description="UUID")
    user_id: Optional[str] = Field(None, description="UUID anonyme de l'utilisateur")
    platform: Optional[Literal["email", "corporate", "linkedin", "instagram", "twitter", "blog", "sms"]] = Field(None, description="Plateforme cible du message")
    intent: Optional[str] = Field(None, description="Intention exprimée par l'utilisateur")
    generated: Optional[str] = Field(None, description="Message généré")
    message: Optional[str] = Field(None, description="Message après modificatin")
    created_at: Optional[str] = Field(None, description="Date de création (optionnelle, générée côté DB si absente)")