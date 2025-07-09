from fastapi import APIRouter, Depends, Request
from backend.app.schemas.message import MessageSchema
from backend.app.services.security import check_security
from backend.app.models.message_model import MessageModel

router = APIRouter()

@router.post("/", dependencies=[Depends(check_security)])
async def generate_message(message: MessageSchema):
    # Pour l’instant, on se contente de "simuler" la génération
    generated = message.intent.upper()
    data = message.__dict__
    data.pop("user_id")
    data["generated"] = generated
    model = MessageModel(
        **data
    )
    saved = model.save()

    return {
        "success": True,
        "message": generated,
        "data": saved
    }