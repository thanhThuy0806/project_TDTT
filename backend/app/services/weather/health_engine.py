from datetime import datetime
import math

def compute_humidex(temp, humidity):
    # Tính áp suất hơi nước (e) dựa trên phương trình Clausius-Clapeyron xấp xỉ
    # 6.11 * exp(5417.7530 * (1/273.16 - 1/(temp + 273.15)))
    dew_point_term = (17.27 * temp) / (237.7 + temp) + math.log(max(humidity, 1) / 100.0)
    dew_point = (237.7 * dew_point_term) / (17.27 - dew_point_term)
    
    # Áp suất hơi nước e (chiếm tỷ trọng chính trong Humidex)
    e = 6.11 * math.exp(5417.7530 * ((1 / 273.15) - (1 / (237.15 + dew_point))))
    h = 0.5555 * (e - 10.0)
    
    humidex = temp + h
    return max(humidex, temp) # Humidex không thấp hơn nhiệt độ thực tế

def is_elderly(birth_date: str) -> bool:
    if not birth_date or not isinstance(birth_date, str):
        return False
    
    try:
        date_only = birth_date.split('T')[0]
        birth = datetime.strptime(date_only, "%Y-%m-%d").date()
        today = datetime.now().date()
        age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
        return age >= 60
    except (ValueError, IndexError):
        return False
    
def accumulate_risk(current_risk, increment):
    # Hàm lõi tính toán xác suất tích lũy tiệm cận.
    # Công thức: R_new = R_current + increment * (1 - R_current)
    # Đảm bảo rủi ro tăng mượt mà, không bao giờ vượt quá 1.0 và nhạy với đa rủi ro.
    return current_risk + increment * (1.0 - current_risk)

def compute_health_risk(features, user_profile=None):
    profile = user_profile if isinstance(user_profile, dict) else {}
    risk = 0.0
    aqi = features.get("aqi")
    humidex = compute_humidex(features["temp"], features["humidity"])

    # 1. Rủi ro thời tiết nền
    if humidex > 38:
        risk = accumulate_risk(risk, 0.4)
    if features["uv"] > 7:
        risk = accumulate_risk(risk, 0.3)
    if features["wind"] > 24:
        risk = accumulate_risk(risk, 0.2)

    mobility = profile.get("mobility", "none")
    conditions = profile.get("conditions", [])
    dob = profile.get("dob", "")
    has_elderly_risk = is_elderly(dob)

    # 2. Rủi ro theo độ tuổi
    if has_elderly_risk:
        if features["temp"] > 32:
            risk = accumulate_risk(risk, 0.3)
        if features["uv"] > 6:
            risk = accumulate_risk(risk, 0.2)
        if aqi and aqi >= 4:
            risk = accumulate_risk(risk, 0.3)

    # 3. Rủi ro theo khả năng vận động
    if mobility == "wheelchair":
        if features["rain_prob"] > 50:
            risk = accumulate_risk(risk, 0.3)
        if features["wind"] > 35:
            risk = accumulate_risk(risk, 0.2)
    elif mobility == "walking_difficulty":
        if features["rain_prob"] > 60:
            risk = accumulate_risk(risk, 0.2)
    elif mobility == "blind":
        if features["wind"] > 35:
            risk = accumulate_risk(risk, 0.2)
    elif mobility == "elderly_assisted":
        if features["temp"] > 30:
            risk = accumulate_risk(risk, 0.3)

    # 4. Rủi ro theo bệnh lý nền 
    if "respiratory" in conditions:
        if features["humidity"] > 85:
            risk = accumulate_risk(risk, 0.3)
        if aqi and aqi >= 3:
            risk = accumulate_risk(risk, 0.4)
    if "heart_disease" in conditions:
        if humidex > 38: 
            risk = accumulate_risk(risk, 0.3)
        if aqi and aqi >= 4:
            risk = accumulate_risk(risk, 0.4)
    if "arthritis" in conditions:
        if features["humidity"] > 88:
            risk = accumulate_risk(risk, 0.2)
    if "asthma" in conditions:
        if aqi and aqi >= 3:
            risk = accumulate_risk(risk, 0.4)
    if "migraine" in conditions:
        if features["temp"] > 33:
            risk = accumulate_risk(risk, 0.2)
    if "diabetes" in conditions:
        if humidex > 38:
            risk = accumulate_risk(risk, 0.2)

    return round(risk, 2)
