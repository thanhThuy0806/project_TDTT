# weather_service.py: Core business logic của hệ thống
# Pipeline:
# 1. Gọi API
# 2. Sliding Window
# 3. Normalization
# 4. Analysis
# 5. Decision

from backend.core.api_client import call_weather_api
from backend.core.normalization import z_score_normalize
from backend.core.sliding_window import SlidingWindow
from backend.modules.analysis_service import analyze_weather
from backend.modules.decision import make_decision
from backend.config.setting import WINDOW_SIZE

# GLOBAL STATE (giả lập realtime)
temp_window = SlidingWindow(WINDOW_SIZE)
humidity_window = SlidingWindow(WINDOW_SIZE)
wind_window = SlidingWindow(WINDOW_SIZE)


def get_weather_warning(lat, lon):
    # Xử lý toàn bộ pipeline cảnh báo thời tiết
    # Args:
    #     lat (str): vĩ độ
    #     lon (str): kinh độ

    # Returns:
    #        tuple: (response_json, status_code)

    # 1. CALL API
    res = call_weather_api("weather", {"lat": lat, "lon": lon})

    if res.status_code != 200:
        return res.json(), res.status_code

    data = res.json()

    # 2. RAW DATA
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    wind = data["wind"]["speed"]

    # 3. SLIDING WINDOW
    temp_window.add(temp)
    humidity_window.add(humidity)
    wind_window.add(wind)

    temp_avg = temp_window.average()
    humidity_avg = humidity_window.average()
    wind_avg = wind_window.average()

    # 4. NORMALIZATION
    temp_norm = z_score_normalize(temp_avg, 25, 5)
    humidity_norm = z_score_normalize(humidity_avg, 60, 20)
    wind_norm = z_score_normalize(wind_avg, 5, 3)

    # 5. ANALYSIS
    score = analyze_weather(temp_avg, humidity_avg, wind_avg)

    # 6. DECISION
    decision = make_decision(score)

    return {
        "location": data.get("name"),

        # dữ liệu gốc
        "raw": {
            "temp": temp,
            "humidity": humidity,
            "wind": wind
        },

        # dữ liệu sau xử lý
        "processed": {
            "temp_avg": temp_avg,
            "humidity_avg": humidity_avg,
            "wind_avg": wind_avg
        },

        # dữ liệu chuẩn hóa
        "normalized": {
            "temp_z": temp_norm,
            "humidity_z": humidity_norm,
            "wind_z": wind_norm
        },

        # kết quả
        "analysis_score": score,
        "decision": decision

    }, 200