def detect_trend(current, forecast_days):
    tomorrow = forecast_days[0]["day"]["maxtemp_c"]
    current_temp = current["temp_c"]
    diff = tomorrow - current_temp

    if diff >= 3:
        return "warming"
    elif diff <= -3:
        return "cooling"

    return "stable"


def multi_day_reasoning(forecast_days):
    rain_days = sum(
        1
        for d in forecast_days
        if d["day"]["daily_chance_of_rain"] > 60
    )

    temps = [
        d["day"]["maxtemp_c"]
        for d in forecast_days
    ]

    # Temperature trend
    temp_trend = "stable"

    if temps[-1] > temps[0]:
        temp_trend = "increasing"
    elif temps[-1] < temps[0]:
        temp_trend = "decreasing"

    # Heatwave detection
    heatwave = all(t >= 35 for t in temps)

    # Sudden temperature change
    sudden_change = (max(temps) - min(temps)) >= 7

    # Consecutive rain
    long_rain = rain_days >= 3

    return {
        "rain_days": rain_days,
        "temp_trend": temp_trend,
        "heatwave": heatwave,
        "sudden_change": sudden_change,
        "long_rain": long_rain
    }