import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from HoneyChain.data.generator import generate_multiple_hives

df = generate_multiple_hives(["HIVE-1", "HIVE-2", "HIVE-3"])

features = ["temperature", "humidity", "weightChange", "weightAcceleration"]
X = df[features]

model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X)

scores = model.decision_function(X)

bundle = {
    "model": model,
    "score_min": scores.min(),
    "score_max": scores.max(),
    "mean": X.mean(axis=0).values
}

joblib.dump(bundle, "ml/model.pkl")

print("✅ Model trained")