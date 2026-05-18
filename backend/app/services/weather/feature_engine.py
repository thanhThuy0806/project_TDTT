def extract_features(current, forecast_day):
    aqi = None

    if current.get("air_quality"):
<<<<<<< HEAD
        aqi = current["air_quality"].get("us-epa-index")

    return {
        "temp": float(current.get("temp_c", 0)),
        "humidity": float(current.get("humidity", 0)),
        "wind": float(current.get("wind_kph", 0)),
        "uv": float(current.get("uv", 0)),
        "pressure": float(current.get("pressure_mb", 0)),
        "rain_prob": float(forecast_day.get("day", {}).get("daily_chance_of_rain", 0)),
        "temp_min": float(forecast_day.get("day", {}).get("mintemp_c", 0)),
        "temp_max": float(forecast_day.get("day", {}).get("maxtemp_c", 0)),
        "aqi": int(aqi) if aqi is not None else None
=======
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
>>>>>>> BE_Warning
    }