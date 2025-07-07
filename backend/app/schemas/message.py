from pydantic import BaseModel, Field
from typing import Literal, Optional

class MessageSchema(BaseModel):
    user_id: str = Field(..., description="UUID anonyme de l'utilisateur")
    platform: Literal["email", "corporate", "linkedin", "instagram", "twitter", "blog", "sms"] = Field(..., description="Plateforme cible du message")
    intent: str = Field(..., description="Intention exprimée par l'utilisateur")
    message: Optional[str] = Field(None, description="Message généré ou soumis")
    created_at: Optional[str] = Field(None, description="Date de création (optionnelle, générée côté DB si absente)")