import torch
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

# Load dataset
df = pd.read_csv("India_sms_spam.csv")

X = df["text"]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Load saved model
tokenizer = DistilBertTokenizerFast.from_pretrained("./saved_model")
model = DistilBertForSequenceClassification.from_pretrained("./saved_model")

model.eval()

predictions = []

for text in X_test:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    pred = torch.argmax(probs, dim=1).item()
    predictions.append(pred)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))
