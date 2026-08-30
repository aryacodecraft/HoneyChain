import joblib
from flask import Flask, request, jsonify
from HoneyChain.ml.predict import predict_risk

app = Flask(__name__)

# Load model once
bundle = joblib.load("ml/model.pkl")

model = bundle["model"]
score_min = bundle["score_min"]
score_max = bundle["score_max"]
mean = bundle["mean"]

# Time-series memory (temporary)
hive_history = {}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # 🔒 Validate input
        required_fields = ["temperature", "humidity", "weight"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        hive_id = data.get("hiveId", "default")

        # 🧠 Initialize history
        if hive_id not in hive_history:
            hive_history[hive_id] = []

        # Store weight
        hive_history[hive_id].append(data["weight"])

        # Keep last 3 values
        hive_history[hive_id] = hive_history[hive_id][-3:]
        history = hive_history[hive_id]

        # 🔁 Compute time-series features
        weightChange = 0
        weightAcceleration = 0

        if len(history) >= 2:
            weightChange = history[-1] - history[-2]

        if len(history) >= 3:
            weightAcceleration = (
                (history[-1] - history[-2]) -
                (history[-2] - history[-3])
            )

        # Prepare ML input
        row = {
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "weightChange": weightChange,
            "weightAcceleration": weightAcceleration
        }

        # 🔥 Call ML
        result = predict_risk(row, model, score_min, score_max, mean)

        # Add debug info (useful for demo)
        result["debug"] = {
            "weightChange": weightChange,
            "weightAcceleration": weightAcceleration,
            "history": history
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "ML Service Running 🚀"


if __name__ == "__main__":
    app.run(port=5001, debug=True)