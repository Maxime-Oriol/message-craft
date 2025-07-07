from fastapi import FastAPI
from app.routes import contact, message
from starlette.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS (tu pourras adapter selon ton frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080", "http://127.0.0.1:8080/*"],  # à restreindre plus tard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(contact.router, prefix="/api/contact")
app.include_router(message.router, prefix="/api/message")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=4000, reload=True)