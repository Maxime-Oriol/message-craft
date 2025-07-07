from fastapi import APIRouter, Depends, Request
from app.schemas.message import MessageSchema
from app.services.security import check_security
#from app.models.message import save_message

router = APIRouter()

@router.post("/", dependencies=[Depends(check_security)])
async def generate_message(message: MessageSchema, request: Request):
    # Pour l’instant, on se contente de "simuler" la génération
    generated = message.message.upper()

    # Sauvegarde (à adapter avec ton ORM)
    saved = {}
    # saved = await save_message(**message.dict())

    return {
        "success": True,
        "message": generated,
        "data": saved
    }