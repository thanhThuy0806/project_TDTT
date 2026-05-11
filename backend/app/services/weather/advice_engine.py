from datetime import datetime

def is_elderly(birth_date: str):
    birth = datetime.strptime(birth_date,"%Y-%m-%d")
    age = (datetime.now() - birth).days // 365
    return age >= 60

def deduplicate(items):
    seen = set()
    result = []

    for item in items:
        if item not in seen:
            result.append(item)
            seen.add(item)

    return result


def generate_general_advice(features, risk):
    advice = []

    if features["uv"] > 8:
        advice.append("UV cao, nên tránh ra ngoài vào buổi trưa.")

    if features["rain_prob"] > 60:
        advice.append("Khả năng mưa cao, nên mang theo ô hoặc áo mưa.")

    if features["wind"] > 30:
        advice.append("Gió mạnh, cần cẩn thận khi di chuyển.")

    if risk > 0.8:
        advice.append("Điều kiện thời tiết hôm nay ở mức nguy hiểm.")
    elif risk > 0.6:
        advice.append("Thời tiết hôm nay có một số yếu tố bất lợi.")

    return advice


def generate_health_advice(features, health_risk, user_profile):
    advice = []

    if not user_profile:
        return advice

    conditions = user_profile.get("conditions", [])

    birth_date = user_profile.get("dob")

    aqi = features.get("aqi")

    # Elderly
    if birth_date and is_elderly(birth_date):
        if features["temp"] > 35:
            advice.append("Người cao tuổi nên hạn chế ra ngoài khi trời quá nóng.")
        if aqi and aqi >= 4:
            advice.append("Chất lượng không khí hôm nay không tốt cho người cao tuổi.")

    # Respiratory
    if "respiratory" in conditions:
        if aqi and aqi >= 3:
            advice.append("Không khí hôm nay có thể ảnh hưởng đến hệ hô hấp.")
        if features["humidity"] > 80:
            advice.append("Độ ẩm cao có thể gây khó chịu cho đường hô hấp.")

    # Heart disease
    if "heart_disease" in conditions:
        if features["temp"] > 35:
            advice.append("Nhiệt độ cao có thể ảnh hưởng đến tim mạch.")

    # Arthritis

    if "arthritis" in conditions:
        if features["humidity"] > 85:
            advice.append("Độ ẩm cao có thể làm tăng cảm giác đau nhức khớp.")

    if health_risk > 0.75:
        advice.append("Bạn nên hạn chế hoạt động ngoài trời hôm nay.")

    if "asthma" in conditions:
        advice.append("Không khí hôm nay có thể ảnh hưởng đến hen suyễn.")

    if "migraine" in conditions:
        advice.append("Thời tiết nóng có thể làm tăng nguy cơ đau nửa đầu.")

    return advice


def generate_mobility_advice(features, user_profile):
    advice = []

    if not user_profile:
        return advice

    mobility = user_profile.get(
        "mobility"
    )

    # Wheelchair

    if mobility == "wheelchair":
        if features["rain_prob"] > 50:
            advice.append("Mưa có thể gây khó khăn khi di chuyển bằng xe lăn.")
        if features["wind"] > 35:
            advice.append("Gió mạnh có thể ảnh hưởng đến việc di chuyển ngoài trời.")

    # Walking difficulty

    if mobility == "walking_difficulty":
        if (features["rain_prob"] > 60 or features["wind"] > 30):
            advice.append("Điều kiện thời tiết có thể gây khó khăn khi đi lại.")

    # Blind users

    if mobility == "blind":
        if features["wind"] > 35:
            advice.append("Gió mạnh có thể gây khó khăn khi định hướng ngoài trời.")

    return advice


def generate_trend_advice(trend, multi_day):
    advice = []

    if trend == "warming":
        advice.append("Nhiệt độ đang có xu hướng tăng trong những ngày tới.")
    elif trend == "cooling":
        advice.append("Thời tiết sẽ trở lạnh hơn trong những ngày tới.")

    if multi_day["rain_days"] >= 2:
        advice.append("Có khả năng xuất hiện mưa trong nhiều ngày liên tiếp.")

    if multi_day.get("heatwave"):
        advice.append("Có dấu hiệu nắng nóng kéo dài.")

    if multi_day.get("sudden_change"):
        advice.append("Nhiệt độ có thể thay đổi mạnh trong vài ngày tới.")

    return advice


def generate_advice(features, risk, trend, multi_day, health_risk, user_profile=None):
    advice = []

    advice.extend(
        generate_general_advice(features, risk)
    )

    advice.extend(
        generate_health_advice(features, health_risk, user_profile)
    )

    advice.extend(
        generate_mobility_advice(features, user_profile)
    )

    advice.extend(
        generate_trend_advice(trend, multi_day)
    )

    advice = deduplicate(advice)

    return advice[:5]