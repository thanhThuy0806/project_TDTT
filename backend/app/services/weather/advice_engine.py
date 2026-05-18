from datetime import datetime
from app.services.weather.health_engine import is_elderly

<<<<<<< HEAD
def deduplicate(items):
    seen = set()
    result = []
=======

def deduplicate(items):
    seen = set()
    result = []

>>>>>>> BE_Warning
    for item in items:
        if item not in seen:
            result.append(item)
            seen.add(item)
<<<<<<< HEAD
    return result

def generate_mobility_advice(features, user_profile):
    # ƯU TIÊN 1: Lời khuyên di chuyển an toàn cho người khuyết tật
    advice = []
    if not user_profile:
        return advice

    mobility = user_profile.get("mobility", "none")
    rain_prob = features.get("rain_prob", 0)
    wind = features.get("wind", 0)

    if mobility == "wheelchair":
        if rain_prob > 50:
            advice.append("Trời có khả năng mưa, di chuyển bằng xe lăn trên đường rất trơn trượt, hãy cẩn thận.")
        if wind > 24: 
            advice.append("Gió mạnh ngoài trời có thể gây mất thăng bằng hoặc cản trở xe lăn di chuyển.")

    elif mobility == "walking_difficulty":
        if rain_prob > 60 or wind > 24:
            advice.append("Thời tiết có mưa/gió mạnh, đường phố VN dễ ngập hoặc trơn trượt, hạn chế ra ngoài.")

    elif mobility == "blind":
        if wind > 24:
            advice.append("Gió lớn làm nhiễu âm thanh môi trường, gây khó khăn cho việc định hướng bằng gậy.")

    return advice

def generate_health_advice(features, health_risk, user_profile):
    # ƯU TIÊN 2: Lời khuyên phòng bệnh lý nền theo thời tiết khí hậu VN
    advice = []
=======

    return result


def generate_general_advice(features, risk):
    advice = []

    if features["uv"] > 8:
        advice.append("UV cao, nên tránh ra ngoài vào buổi trưa.")

    if features["rain_prob"] > 50:
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

>>>>>>> BE_Warning
    if not user_profile:
        return advice

    conditions = user_profile.get("conditions", [])
<<<<<<< HEAD
    birth_date = user_profile.get("dob")
    aqi = features.get("aqi")
    temp = features.get("temp", 0)
    humidity = features.get("humidity", 0)

    # 1. Người cao tuổi 
    if birth_date and is_elderly(birth_date):
        if temp > 32:
            advice.append("Trời oi nóng, người cao tuổi nên ở trong nhà mát, uống đủ nước để tránh sốc nhiệt.")
        if aqi and aqi >= 4:
            advice.append("Chất lượng không khí hôm nay rất kém, người lớn tuổi tuyệt đối không tập thể dục ngoài trời.")

    # 2. Bệnh Hô hấp & Hen suyễn 
    if "respiratory" in conditions or "asthma" in conditions:
        if aqi and aqi >= 3:
            advice.append("Chỉ số bụi mịn/AQI tăng cao, hãy đeo khẩu trang chuyên dụng (N95) khi ra đường.")
        if humidity > 85: # Trời nồm ẩm VN
            advice.append("Độ ẩm không khí quá cao dễ kích ứng cơn hen suyễn hoặc gây khó thở.")

    # 3. Bệnh Tim mạch & Tiểu đường 
    if "heart_disease" in conditions or "diabetes" in conditions:
        if temp > 32 and humidity > 75:
            advice.append("Thời tiết oi bức (nhiệt cao, ẩm lớn) làm tăng áp lực lên tim mạch, hãy hạn chế gắng sức.")
        elif temp > 32:
            advice.append("Thời tiết nắng nóng làm tăng nhịp tim, hãy tránh ra nắng giờ cao điểm.")

    # 4. Bệnh xương khớp (Arthritis)
    if "arthritis" in conditions:
        if humidity > 85: 
            advice.append("Thời tiết nồm ẩm/áp suất thay đổi dễ gây sưng đau các khớp xương.")

    # 5. Bệnh đau nửa đầu 
    if "migraine" in conditions:
        if temp > 33: 
            advice.append("Nhiệt độ ngoài trời cao là tác nhân dễ kích phát cơn đau nửa đầu.")

    # Cảnh báo tổng rủi ro sức khỏe cá nhân
    if health_risk > 0.7:
        advice.append("ĐÁNH GIÁ: Chỉ số rủi ro sức khỏe của bạn hôm nay ở mức BÁO ĐỘNG. Hãy ưu tiên ở trong nhà.")

    return advice

def generate_general_advice(features, risk):
    # ƯU TIÊN 3: Lời khuyên tổng quan môi trường
    advice = []
    uv = features.get("uv", 0)
    rain_prob = features.get("rain_prob", 0)
    wind = features.get("wind", 0)

    if uv > 10: 
        advice.append("Tia UV ở mức NGUY HẠI CỰC CAO. Bắt buộc mặc áo chống nắng, bôi kem và đeo kính râm.")
    elif uv > 7:
        advice.append("Chỉ số UV cao, nên hạn chế ra nắng vào khung giờ 10h - 14h.")

    if rain_prob > 70:
        advice.append("Khả năng mưa rất lớn, hãy chuẩn bị sẵn áo mưa và phòng tránh ngập úng đô thị.")
    elif rain_prob > 50:
        advice.append("Trời có xu hướng đổ mưa, nên mang theo ô hoặc áo mưa dự phòng.")

    if wind > 24:
        advice.append("Gió giật mạnh ngoài đường, chú ý vật cản bay hoặc cây đổ.")

    if risk > 0.75:
        advice.append("Thời tiết tổng thể hôm nay rất bất lợi cho các hoạt động ngoài trời.")

    return advice

def generate_trend_advice(trend, multi_day):
    # ƯU TIÊN 4: Dự báo xu hướng dài hạn
    advice = []

    if trend == "warming":
        advice.append("Xu hướng thời tiết sẽ tiếp tục tăng nhiệt trong những ngày tới.")
    elif trend == "cooling":
        advice.append("Sắp có đợt không khí lạnh hoặc hạ nhiệt trong vài ngày tới.")

    if multi_day.get("long_rain"):
        advice.append("Dự báo có mưa dầm dề kéo dài nhiều ngày tới, hãy chú ý phơi đồ và di chuyển.")
    elif multi_day.get("rain_days", 0) >= 2:
        advice.append("Thời tiết có mưa rải rác trong các ngày tới.")

    if multi_day.get("heatwave"):
        advice.append("Cảnh báo: Khu vực sắp bước vào đợt nắng nóng gay gắt kéo dài.")

    if multi_day.get("sudden_change"):
        advice.append("Thời tiết thay đổi nhiệt độ đột ngột giữa các ngày, dễ gây cảm cúm.")
=======

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
        if features["temp"] > 32:
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
>>>>>>> BE_Warning

    return advice


def generate_advice(features, risk, trend, multi_day, health_risk, user_profile=None):
<<<<<<< HEAD
    # 1. Thu thập lời khuyên
    mobility_adv = generate_mobility_advice(features, user_profile)
    health_adv = generate_health_advice(features, health_risk, user_profile)
    general_adv = generate_general_advice(features, risk)
    trend_adv = generate_trend_advice(trend, multi_day)

    # 2. Xếp thứ tự ưu tiên: Ưu tiên an toàn hành vi/sức khỏe trước, thời tiết chung sau
    final_advice = []
    final_advice.extend(mobility_adv)
    final_advice.extend(health_adv)
    final_advice.extend(general_adv)
    final_advice.extend(trend_adv)

    # 3. Lọc trùng
    final_advice = deduplicate(final_advice)

    return final_advice[:6]
=======
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
>>>>>>> BE_Warning
