from fastapi import APIRouter, Depends
from backend.app.schemas.message import MessageSchema
from backend.app.services.security import check_security
from backend.app.models.message_model import MessageModel
from backend.app.models.dataset_model import DatasetModel

from transformers import T5Tokenizer, MT5ForConditionalGeneration
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODELS_DIR = os.path.join(BASE_DIR, "models")
LATEST_DIR = os.path.join(MODELS_DIR, "mt5-base-latest.pkl")

if os.path.exists(LATEST_DIR):
    model = MT5ForConditionalGeneration.from_pretrained(LATEST_DIR)
    tokenizer = T5Tokenizer.from_pretrained(LATEST_DIR)
else:
    model = None
    tokenizer = None
    print("Attention, le model MT5 n'existe pas encore")

router = APIRouter()


def get_tokens_size(platform: str) -> int:
    if platform in ["email", "linkedin", "instagram"]:
        return 300
    elif platform in ["blog"]:
        return 1000
    return 150

def get_platform_intro(platform: str) -> str:
    if platform == "email":
        return "Rédige un e-mail en respectant les codes usuels"
    elif platform == "corporate":
        return "Rédige un message pour une messagerie instantanée professionnelle type Teams / Slack / ou autre"
    elif platform == "sms":
        return "Rédige un message court au ton amical type SMS ou message envoyé sur une plateforme de discussion instantanée type messenger, whatsapp, télégram ..."
    elif platform == "linkedin":
        return "Rédige un message destiné à la plateforme Linkedin, réseau professionnel où l'apparence a son importance mais sans exagérer. En fonction de la demande suivante, s'il s'agit d'un article, n'hésite pas à rédiger un message qui soit long, exhaustif et qui pèse le pour et le contre. Si la demande concerne un message privé, alors reprends les mêmes codes qu'un e-mail."
    elif platform == "instagram":
        return "Rédige le texte qui accompagne un post sur Instagram, n'oublie pas sa mise en forme avec quelques émojis sans en mettre trop, et termine le message par des hashtags populaires en lien avec le sujet traité."
    elif platform == "twitter":
        return "Rédige un message pour Twitter, il doit être conscis, droit au but et sans mise en forme, à destination de Twitter, ton message ne doit pas dépasser les 150 symboles"
    else:
        return "Rédige un article de blog. Cet article doit être structuré, contenir des titres de parties, parler du pour et du contre"

def get_temperature(platform: str) -> float:
    if platform in ["email", "linkedin", "corporate", "sms"]:
        return 0.5  # Réponses professionnelles ou structurées, anticipation modérée
    elif platform in ["instagram", "twitter"]:
        return 0.7  # Un peu plus créatif pour coller aux codes sociaux, emojis, ton
    elif platform in ["blog"]:
        return 0.6  # Un peu plus libre, mais sans trop divaguer
    else:
        return 0.5  # Valeur par défaut
    

def get_instructions(message: MessageSchema) -> str:
    # Platform = "email" | "corporate" | "sms" | "linkedin" | "instagram" | "twitter" | "blog";
    platform_intro = get_platform_intro(message.platform)

    return f"""Ton rôle est de faire gagner du temps à l'utilisateur en rédigeant à sa place des messages adaptés à ses intentions, tout en respectant les codes de la plateforme ciblée.\n
        Plateforme : {message.platform}\n
        Contexte : {platform_intro}\n\n
        Intention : {message.intent}"""

@router.post("", dependencies=[Depends(check_security)])
async def generate_message(message: MessageSchema):
    global model, tokenizer
    if not message.intent:
        return {
            "success": False,
            "description": "Veuillez décrire votre intention",
            "critiacal": True
        }
    if not model or not tokenizer:
        return {
            "success": False,
            "description": "Aucun model n'est disponible pour le moment",
            "critiacal": True
        }
    prompt = get_instructions(message)
    inputs = tokenizer(prompt, return_tensors='pt')
    outputs = model.generate(
        **inputs,
        max_length=get_tokens_size(message.platform),
        do_sample=True,
        temperature=get_temperature(message.platform),
        top_p=0.9
    )
    generated = tokenizer.decode(outputs[0], skip_special_tokens=True)

    data = message.__dict__
    data["generated"] = generated
    data["message"] = generated
    model = MessageModel(
        **data
    )
    saved = model.save()

    return {
        "success": True,
        "message": generated,
        "data": saved
    }

@router.put("", dependencies=[Depends(check_security)])
async def save_message(message: MessageSchema):
    if not message.intent or (not message.generated and not message.message):
        return {
            "success": False,
            "description": "Veuillez remplir le formulaire",
            "critiacal": True
        }
    data = message.__dict__
    if not message.message:
        data["message"] = message.generated
    elif not message.generated:
        data["generated"] = message.message
    
    model = MessageModel(
        **data
    )
    if model.id:
        saved = model.update()
    else:
        saved = model.save()

    return {
        "success": True,
        "description": "Le message a bien été enregistré.",
        "data": saved
    }


@router.delete("", dependencies=[Depends(check_security)])
async def delete_message(message: MessageSchema):
    if not message.id:
        return {
            "title": "Erreur",
            "description": "Impossible de supprimer le message",
            "success": False
        }
    
    orm = MessageModel(id=message.id, user_id = message.user_id)
    if orm.delete():
        return {
            "title": "Message supprimé",
            "description": "Le message a bien été supprimé.",
            "success": True
        }
    
    return {
        "title": "Erreur",
        "description": "Une erreur est survenue lors de la suppression du message",
        "success": False
    }

@router.put("/validate", dependencies=[Depends(check_security)])
async def validate_message(message: MessageSchema):
    if not message.id:
        return {
            "title": "Erreur",
            "description": "Impossible de valider le message",
            "success": False
        }

    orm = DatasetModel(message_id=message.id)
    if orm.validate():
        return {
            "title": "Message validé",
            "description": "Le message a bien été validé.",
            "success": True
        }

    return {
        "title": "Erreur",
        "description": "Une erreur est survenue lors de la validation du message",
        "success": False
    }