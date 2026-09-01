import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest

# -------------------------------
# 1. Load dataset
# -------------------------------
df = pd.read_csv("data/honey.csv")

# -------------------------------
# 2. Rename columns (CRITICAL FIX)
# -------------------------------
df = df.rename(columns={
    "Temperature_C": "temperature",
    "Moisture_%": "humidity",
    "Hive_Weight_kg": "weight"
})

# Keep only needed columns
df = df[["temperature", "humidity", "weight"]]

# Drop missing values
df = df.dropna().reset_index(drop=True)

# -------------------------------
# 3. Create time-series features
# -------------------------------
df["weightChange"] = df["weight"].diff().fillna(0)
df["weightAcceleration"] = df["weightChange"].diff().fillna(0)

# -------------------------------
# 4. (SMART) Inject realistic anomalies
# -------------------------------
np.random.seed(42)

for i in np.random.choice(len(df), size=int(0.05 * len(df)), replace=False):
    df.loc[i, "weight"] += np.random.uniform(5, 10)  # spike

# recompute features after anomaly
df["weightChange"] = df["weight"].diff().fillna(0)
df["weightAcceleration"] = df["weightChange"].diff().fillna(0)

weight_change_threshold = df["weightChange"].abs().quantile(0.95)

# -------------------------------
# 5. Features
# -------------------------------
features = [
    "temperature",
    "humidity",
    "weightChange",
    "weightAcceleration"
]

X = df[features]

# -------------------------------
# 6. Train model
# -------------------------------
model = IsolationForest(
    contamination=0.1,
    random_state=42
)

model.fit(X)

# -------------------------------
# 7. Score normalization
# -------------------------------
scores = model.decision_function(X)

# -------------------------------
# 8. Save model
# -------------------------------
bundle = {
    "model": model,
    "score_min": scores.min(),
    "score_max": scores.max(),
    "mean": X.mean(axis=0).values,
    "weight_change_threshold": weight_change_threshold
}

joblib.dump(bundle, "ml/model.pkl")

print("✅ Model trained with REAL dataset ")