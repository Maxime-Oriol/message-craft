from fastapi import APIRouter, Depends
from threading import Thread
from backend.app.services.security import check_security
from llm_pipeline.core_model import train_and_filter, scoring_only, train_mt5_only
from llm_pipeline.scoring import train_reliability_model

router = APIRouter()

@router.get("/execute/all", dependencies=[Depends(check_security)])
def train_model():
    train_and_filter()
    return True

@router.get("/train/scoring", dependencies=[Depends(check_security)])
def train_scoring_model():
    train_reliability_model()
    return True

@router.get("/train/genai", dependencies=[Depends(check_security)])
def train_genai_model():
    train_mt5_only()
    return True

@router.get("/execute/scoring", dependencies=[Depends(check_security)])
def execute_scoring_model():
    scoring_only()
    return True