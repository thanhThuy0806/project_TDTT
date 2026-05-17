from app.services.weather.health_engine import accumulate_risk

def compute_weather_score(features):
    weights = {
        "temp": 0.2,
        "humidity": 0.1,
        "wind": 0.15,
        "uv": 0.2,
        "rain_prob": 0.15,
        "aqi": 0.2
    }

    temp_score = min(max(features["temp"], 0) / 40.0, 1.0)
    humidity_score = min(max(features["humidity"], 0) / 100.0, 1.0)
    wind_score = min(max(features["wind"], 0) / 40.0, 1.0)
    uv_score = min(max(features["uv"], 0) / 11.0, 1.0)
    rain_score = min(max(features["rain_prob"], 0) / 100.0, 1.0)

    aqi = features.get("aqi")
    aqi_score = min(aqi / 6.0, 1.0) if aqi else 0.0

    base_score = (
        temp_score * weights["temp"] +
        humidity_score * weights["humidity"] +
        wind_score * weights["wind"] +
        uv_score * weights["uv"] +
        rain_score * weights["rain_prob"] +
        aqi_score * weights["aqi"]
    )

    score = base_score
    if (features["temp"] > 33 and features["uv"] > 8):
        score = accumulate_risk(score, 0.15)
    if (features["rain_prob"] > 70 and features["wind"] > 24):
        score = accumulate_risk(score, 0.1)
    if (aqi and aqi >= 4 and features["humidity"] > 80):
        score = accumulate_risk(score, 0.1)
    if (features["temp"] > 32 and features["humidity"] > 80):
        score = accumulate_risk(score, 0.15)

    return round(score, 2)