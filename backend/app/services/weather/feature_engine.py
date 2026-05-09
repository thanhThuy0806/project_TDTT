def extract_features(current, forecast_day):
    aqi = None

    if current.get("air_quality"):
        aqi = current["air_quality"].get(
            "us-epa-index"
        )

    return {
        "temp": current["temp_c"],
        "humidity": current["humidity"],
        "wind": current["wind_kph"],
        "uv": current["uv"],
        "pressure": current["pressure_mb"],
        "rain_prob": forecast_day["day"]["daily_chance_of_rain"],
        "temp_min": forecast_day["day"]["mintemp_c"],
        "temp_max": forecast_day["day"]["maxtemp_c"],
        "aqi": aqi
    }