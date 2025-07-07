import smtplib
from email.message import EmailMessage
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
MESSAGECRAFT_EMAIL = os.getenv("MESSAGECRAFT_EMAIL")


def send_email(subject: str, body: str, reply_to: Optional[str] = None) -> bool:
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = f"MessageCraft <{SMTP_USER}>"
        msg["To"] = MESSAGECRAFT_EMAIL

        if reply_to:
            msg["Reply-To"] = reply_to

        msg.set_content(body)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"[Mailer] Echec de l'envoi du message : {e}")
        return False