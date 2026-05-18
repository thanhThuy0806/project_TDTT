def detect_trend(current, forecast_days):
<<<<<<< HEAD
    # Phát hiện xu hướng nhiệt độ bằng phương pháp sai phân trung bình (bỏ qua nhiễu cục bộ)
    if not forecast_days:
        return "stable"
    
    current_temp = float(current.get("temp_c", 0))
    temps = [float(d.get("day", {}).get("maxtemp_c", current_temp)) for d in forecast_days]
    avg_future_temp = sum(temps) / len(temps)
    diff = avg_future_temp - current_temp

    if diff >= 3.0:
        return "warming"
    elif diff <= -3.0:
        return "cooling"
=======
    tomorrow = forecast_days[0]["day"]["maxtemp_c"]
    current_temp = current["temp_c"]
    diff = tomorrow - current_temp

    if diff >= 3:
        return "warming"
    elif diff <= -3:
        return "cooling"

>>>>>>> BE_Warning
    return "stable"


def multi_day_reasoning(forecast_days):
<<<<<<< HEAD
    """Phân tích xu hướng thời tiết đa ngày an toàn tuyệt đối"""
    # 1. Chống crash nếu API trả về danh sách rỗng hoặc sai kiểu dữ liệu
    if not forecast_days or not isinstance(forecast_days, list):
        return {
            "rain_days": 0,
            "temp_trend": "stable",
            "heatwave": False,
            "sudden_change": False,
            "long_rain": False
        }

    # Tính toán số ngày mưa trước
    rain_days = sum(
        1 for d in forecast_days 
        if float(d.get("day", {}).get("daily_chance_of_rain", 0)) > 60
    )
    
    # Trích xuất mảng nhiệt độ
    temps = [float(d.get("day", {}).get("maxtemp_c", 0)) for d in forecast_days]

    # 2. BẮT BUỘC: Kiểm tra số lượng phần tử của mảng temps ngay tại đây
    # Nếu mảng rỗng hoặc chỉ có 1 ngày dự báo, trả về kết quả an toàn lập tức
    if len(temps) < 2:
        return {
            "rain_days": rain_days,
            "temp_trend": "stable",
            "heatwave": False,
            "sudden_change": False,
            "long_rain": False
        }

    # 3. Thực hiện chia mảng (An toàn 100% vì len(temps) đã >= 2)
    half = len(temps) // 2
    first_half_avg = sum(temps[:half]) / half
    
    # Mẫu số (len(temps) - half) lúc này chắc chắn luôn >= 1, không bao giờ bằng 0
    second_half_avg = sum(temps[half:]) / (len(temps) - half)

    if second_half_avg > first_half_avg + 1:
        temp_trend = "increasing"
    elif second_half_avg < first_half_avg - 1:
        temp_trend = "decreasing"
    else:
        temp_trend = "stable"

    heatwave = all(t >= 35 for t in temps)
    sudden_change = (max(temps) - min(temps)) >= 7
=======
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
>>>>>>> BE_Warning
    long_rain = rain_days >= 3

    return {
        "rain_days": rain_days,
        "temp_trend": temp_trend,
        "heatwave": heatwave,
        "sudden_change": sudden_change,
        "long_rain": long_rain
    }