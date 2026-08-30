import numpy as np
import pandas as pd

def predict_risk(row, model, score_min, score_max, mean):

    features = ["temperature", "humidity", "weightChange", "weightAcceleration"]
    X = pd.DataFrame([row])[features]

    raw_score = model.decision_function(X)[0]

    norm = (raw_score - score_min) / (score_max - score_min)
    riskScore = round((1 - norm) * 100, 2)

    if riskScore > 75:
        riskLevel = "high"
    elif riskScore > 40:
        riskLevel = "medium"
    else:
        riskLevel = "low"

    prediction = "anomaly" if riskScore > 45 else "normal"

    # XAI
    input_vals = np.array([row[f] for f in features])
    deviation = np.abs(input_vals - mean)

    idx = np.argsort(deviation)[::-1]
    important = [features[i] for i in idx[:2]]

    explanation = (
        f"Anomaly due to unusual {important[0]} and {important[1]}"
        if prediction == "anomaly"
        else "Normal pattern detected"
    )

    return {
        "riskScore": riskScore,
        "riskLevel": riskLevel,
        "prediction": prediction,
        "explanation": explanation
    }