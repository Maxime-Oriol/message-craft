from fastapi import APIRouter, Depends
from backend.app.services.security import check_security
from backend.app.models.message_model import MessageModel

router = APIRouter()

@router.get("", dependencies=[Depends(check_security)])
@router.get("/", dependencies=[Depends(check_security)])
async def list_messages():
    messages = MessageModel().query("""
                                    SELECT craft_message.*, 
                                        llm_dataset.similarity_cosine, 
                                        llm_dataset.distance_levenshtein, 
                                        llm_dataset.score_reliability, 
                                        llm_dataset.pii_factor, 
                                        llm_dataset.pii_message,
                                        llm_dataset.needs_validation,
                                        llm_dataset.validated
                                    FROM craft_message
                                    LEFT JOIN llm_dataset ON craft_message.id = llm_dataset.message_id
                                    """.strip())

    if not isinstance(messages, list):
        messages = [messages]
    return messages