from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.schemas.contact import ContactForm
from app.services.mailer import send_email
from app.models.contact_model import ContactModel
from app.services.security import check_security
import os

router = APIRouter()

@router.post("/", dependencies=[Depends(check_security)])
async def handle_contact_form(form: ContactForm):
    email_success = True

    try:
        email_success = send_email(
            subject=form.other if form.topic == "other" else form.topic,
            body=form.message,
            reply_to=form.email
        )
    except Exception as e:
        print(f"[Mailer] Erreur lors de l'envoi du mail : {e}")
        email_success = False

    try:
        model = ContactModel(
            userId="value to complete",
            email=form.email,
            topic=form.topic,
            other=form.other,
            message=form.message
        )
        model.save()
    except Exception as e:
        print(f"[routes/contact] Erreur lors de l'enregistrement du message dans la base de données : {e}")
    
    if email_success:
        response = {
            "success": True,
            "title": "Message envoyé",
            "message": "Votre message a bien été envoyé, nous vous réponderons dans les plus brefs délais."
        }
        return JSONResponse(
            status_code=200,
            content=response
        )
    else:
        MESSAGECRAFT_EMAIL = os.getenv("MESSAGECRAFT_EMAIL")
        response = {
            "success": False,
            "title": "Erreur",
            "error": f"Le message n'a pas pu être envoyé, vous puvez nous contacter par email à : {MESSAGECRAFT_EMAIL}",
            "critical": True
        }
        return JSONResponse(
            status_code=500,
            content=response
        )
        