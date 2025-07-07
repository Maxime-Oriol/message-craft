# Load model directly
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")

tokenizer = AutoTokenizer.from_pretrained("google/mt5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/mt5-base")