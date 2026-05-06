# analysis_service.py: Phân tích dữ liệu thời tiết
# Kết hợp:
# - Decision Tree (rule-based)
# - Fuzzy logic (scoring mềm)
# Output: Một score từ 0 → 1 (mức độ nguy hiểm)

def analyze_weather(temp, humidity, wind):
    score = 0

    # Demo cơ bản:
    
    # Nhiệt độ
    if temp > 35:
        score += 0.4   # nóng nguy hiểm
    elif temp < 10:
        score += 0.3   # lạnh

    # Độ ẩm
    if humidity > 85:
        score += 0.2   # dễ mưa

    # Gió
    if wind > 10:
        score += 0.4   # gió mạnh

    # Giới hạn score max = 1
    return min(score, 1.0)