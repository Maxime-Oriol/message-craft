from fastapi import Request
from fastapi.responses import JSONResponse
import time


def _is_valid_token(token: str, margin_minutes: int = 20) -> bool:
    try:
        token_ts = int(token)
        now = int(time.time())
        margin = margin_minutes * 60

        # Autoriser les tranches en cours, précédentes et suivantes
        for offset in [-1, 0, 1]:
            rounded_ts = ((now // margin) + offset) * margin
            if token_ts == rounded_ts:
                return True
        return False
    except ValueError:
        return False
async def check_security(request: Request):
    token = request.headers.get("X-Craft-Auth")
    if not token or not _is_valid_token(token):
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": "X-Craft-Auth invalide ou manquant"},
        )

    return True