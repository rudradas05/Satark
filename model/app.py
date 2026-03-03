from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

app = FastAPI()

tokenizer = DistilBertTokenizerFast.from_pretrained("./saved_model")
model = DistilBertForSequenceClassification.from_pretrained("./saved_model")
model.eval()

class SMS(BaseModel):
    message: str

@app.post("/predict")
def predict_sms(data: SMS):
    inputs = tokenizer(
        data.message,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    spam_prob = probs[0][1].item()

    return {
        "spam_probability": spam_prob,
        "prediction": "SPAM" if spam_prob > 0.5 else "HAM"
    }
