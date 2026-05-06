# api_client.py: Module chịu trách nhiệm gọi API bên ngoài.

import requests
from backend.config.setting import API_KEY, BASE_URL

def call_weather_api(endpoint, params):
# Gửi request đến OpenWeather API
# Args:
#     endpoint (str): ví dụ "weather", "forecast"
#     params (dict): query parameters
# Returns:
#        Response object từ requests

    # Inject API key và đơn vị đo metric (độ C) vào tham số truyền đi
    params.update({
        "appid": API_KEY,
        "units": "metric"
    })

    # Gửi request GET đến OpenWeather, giới hạn chờ (timeout) 5 giây
    return requests.get(
        f"{BASE_URL}/{endpoint}",
        params=params,
        timeout=5  # tránh treo request
    )