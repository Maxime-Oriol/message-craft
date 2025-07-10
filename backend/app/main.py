from fastapi import FastAPI
from backend.app.routes import contact, message, messages
from starlette.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS (tu pourras adapter selon ton frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080", 
        "http://localhost:8080",
        "192.168.1.104:8080",], # IP Mac (Frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(contact.router, prefix="/api/contact")
app.include_router(message.router, prefix="/api/message")
app.include_router(messages.router, prefix="/api/messages")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=4000, reload=True)