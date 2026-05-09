from app.core.api_client import call_weather_api
from app.services.weather.feature_engine import extract_features
from app.services.weather.risk_engine import compute_risk
from app.services.weather.trend_engine import detect_trend, multi_day_reasoning
from app.services.weather.health_engine import compute_health_risk
from app.services.weather.advice_engine import generate_advice

def get_weather_data(lat, lon, user_profile=None):
    res = call_weather_api("forecast.json", {
        "q": f"{lat},{lon}",
        "days": 3,
        "aqi": "yes"
    })

    if res.status_code != 200:
        raise HTTPException(
            status_code=res.status_code,
            detail="Failed to fetch weather data"
        )

    data = res.json()

    current = data["current"]

    forecast_days = data["forecast"]["forecastday"]

    features = extract_features(current, forecast_days[0])

    risk = compute_risk(features)

    health_risk = compute_health_risk(features, user_profile)

    trend = detect_trend(current, forecast_days)

    multi_day = multi_day_reasoning(forecast_days)

    advice = generate_advice(features, risk, trend, multi_day, health_risk, user_profile)

    return {
        "location": data["location"],
        "current": current,
        "forecast": data["forecast"],
        "risk_score": risk,
        "health_risk": health_risk,
        "trend": trend,
        "multi_day": multi_day,
        "advice": advice
    }