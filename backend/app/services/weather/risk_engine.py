def compute_risk(features):

    weights = {
        "temp": 0.2,
        "humidity": 0.1,
        "wind": 0.15,
        "uv": 0.2,
        "rain_prob": 0.15,
        "aqi": 0.2
    }

    # Base scores

    temp_score = min(features["temp"] / 40, 1)

    humidity_score = features["humidity"] / 100

    wind_score = min(features["wind"] / 40, 1)

    uv_score = min(features["uv"] / 11, 1)

    rain_score = features["rain_prob"] / 100

    aqi = features.get("aqi")

    aqi_score = 0

    if aqi:
        aqi_score = min(aqi / 6, 1)

    # Weighted score

    score = (
        temp_score * weights["temp"]
        + humidity_score * weights["humidity"]
        + wind_score * weights["wind"]
        + uv_score * weights["uv"]
        + rain_score * weights["rain_prob"]
        + aqi_score * weights["aqi"]
    )

    # Compound reasoning

    # Extreme heat + UV

    if (features["temp"] > 35 and features["uv"] > 8):
        score += 0.15

    # Heavy rain + strong wind

    if (features["rain_prob"] > 70 and features["wind"] > 30):
        score += 0.1

    # Poor AQI + high humidity

    if (aqi and aqi >= 4 and features["humidity"] > 80):
        score += 0.1

    # Heat + humidity

    if (
        features["temp"] > 34
        and features["humidity"] > 75
    ):
        score += 0.1

    return round(min(score, 1.0), 2)