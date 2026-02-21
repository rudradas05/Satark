import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

tokenizer = DistilBertTokenizerFast.from_pretrained("./saved_model")
model = DistilBertForSequenceClassification.from_pretrained("./saved_model")

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    spam_prob = probs[0][1].item()
    print("Spam Probability:", spam_prob)
    return "SPAM 🚨" if spam_prob > 0.5 else "HAM ✅"

print(predict("Double your money in 7 days with crypto investment plan"))
print(predict(""))

