import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import joblib
from flask import Flask, request, jsonify
from ml.predict import predict_risk

app = Flask(__name__)

# -------------------------------
# Load model
# -------------------------------
bundle = joblib.load("ml/model.pkl")

model = bundle["model"]
score_min = bundle["score_min"]
score_max = bundle["score_max"]
mean = bundle["mean"]

# ✅ Data-driven threshold (NOT hardcoded)
weight_change_threshold = bundle["weight_change_threshold"]

# -------------------------------
# Time-series memory
# -------------------------------
hive_history = {}

# -------------------------------
# API
# -------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # -------------------------------
        # Validate input
        # -------------------------------
        required_fields = ["temperature", "humidity", "weight"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        hive_id = data.get("hiveId", "default")

        # -------------------------------
        # Initialize history
        # -------------------------------
        if hive_id not in hive_history:
            hive_history[hive_id] = []

        hive_history[hive_id].append(data["weight"])

        # Keep last 3 values
        hive_history[hive_id] = hive_history[hive_id][-3:]
        history = hive_history[hive_id]

        # -------------------------------
        # Require minimum data
        # -------------------------------
        if len(history) < 3:
            return jsonify({
                "message": "Collecting data...",
                "points": len(history)
            })

        # -------------------------------
        # Time-series features
        # -------------------------------
        weightChange = history[-1] - history[-2]

        weightAcceleration = (
            (history[-1] - history[-2]) -
            (history[-2] - history[-3])
        )

        # -------------------------------
        # 🚨 Data-driven spike detection
        # -------------------------------
        if abs(weightChange) > weight_change_threshold:
            return jsonify({
                "riskScore": 95,
                "riskLevel": "high",
                "prediction": "anomaly",
                "explanation": "Unusual spike compared to learned hive behavior",
                "debug": {
                    "threshold": weight_change_threshold,
                    "weightChange": weightChange,
                    "history": history
                }
            })

        # -------------------------------
        # ML prediction
        # -------------------------------
        row = {
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "weightChange": weightChange,
            "weightAcceleration": weightAcceleration
        }

        result = predict_risk(row, model, score_min, score_max, mean)

        # -------------------------------
        # Debug info
        # -------------------------------
        result["debug"] = {
            "weightChange": weightChange,
            "weightAcceleration": weightAcceleration,
            "history": history
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Health route
# -------------------------------
@app.route("/")
def home():
    return "ML Service Running 🚀"


# -------------------------------
# Run
# -------------------------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)