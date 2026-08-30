import pandas as pd
import numpy as np

def generate_hive_data(hive_id, days=60):
    data = []

    weight = 20 + np.random.normal(0, 1)
    prev_change = 0

    for day in range(days):

        temperature = np.random.normal(30, 2)
        humidity = np.random.normal(60, 5)

        # realistic patterns
        pattern = np.random.choice(
            ["stable", "increase", "decrease"],
            p=[0.4, 0.4, 0.2]
        )

        if pattern == "stable":
            weight += np.random.normal(0, 0.2)
        elif pattern == "increase":
            weight += np.random.normal(0.5, 0.3)
        else:
            weight -= np.random.normal(0.3, 0.2)

        # anomalies
        if np.random.rand() < 0.1:
            anomaly = np.random.choice(["spike", "temp", "humidity"])

            if anomaly == "spike":
                weight += np.random.uniform(5, 10)
            elif anomaly == "temp":
                temperature += np.random.uniform(8, 15)
            else:
                humidity += np.random.uniform(15, 30)

        # time-series features
        prev_weight = data[-1]["weight"] if data else weight
        weightChange = weight - prev_weight
        weightAcceleration = weightChange - prev_change

        prev_change = weightChange

        data.append({
            "temperature": temperature,
            "humidity": humidity,
            "weight": weight,
            "weightChange": weightChange,
            "weightAcceleration": weightAcceleration
        })

    return pd.DataFrame(data)


def generate_multiple_hives(hive_ids):
    return pd.concat([
        generate_hive_data(h) for h in hive_ids
    ]).reset_index(drop=True)