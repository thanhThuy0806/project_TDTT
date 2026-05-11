from datetime import datetime

def compute_heat_index(temp, humidity):
    return temp + 0.33 * humidity - 4

def is_elderly(birth_date: str):
    date_only = birth_date.split('T')[0]
    
    birth = datetime.strptime(
        date_only,
        "%Y-%m-%d"
    )
    
    age = (datetime.now().date() - birth.date()).days // 365
    return age >= 60

def compute_health_risk(features, user_profile=None):
    risk = 0

    aqi = features.get("aqi")

    heat_index = compute_heat_index(features["temp"], features["humidity"])

    if heat_index > 40:
        risk += 0.4

    if features["uv"] > 8:
        risk += 0.3

    if features["wind"] > 30:
        risk += 0.2

    mobility = user_profile.get("mobility")

    conditions = user_profile.get("conditions", [])

    dob = user_profile.get("dob")

    if dob and is_elderly(dob):
        if features["temp"] > 35:
            risk += 0.3
        if features["uv"] > 7:
            risk += 0.2

    if mobility == "wheelchair":
        if features["rain_prob"] > 50:
            risk += 0.3
        if features["wind"] > 35:
            risk += 0.2

    if mobility == "walking_difficulty":
        if features["rain_prob"] > 60:
            risk += 0.2

    if mobility == "blind":
        if features["wind"] > 35:
            risk += 0.2

    if mobility == "elderly_assisted":
        if features["temp"] > 35:
            risk += 0.3

    # Health conditions

    if "respiratory" in conditions:
        if features["humidity"] > 80:
            risk += 0.3

    if "heart_disease" in conditions:
        if heat_index > 38:
            risk += 0.3

    if "arthritis" in conditions:
        if features["humidity"] > 85:
            risk += 0.2

    if "asthma" in conditions:
        if aqi and aqi >= 3:
            risk += 0.4

    if "migraine" in conditions:
        if features["temp"] > 35:
            risk += 0.2

    if "diabetes" in conditions:
        if heat_index > 38:
            risk += 0.2

    # AQI
    if "respiratory" in conditions:
        if aqi and aqi >= 3:
            risk += 0.4

    if is_elderly(dob):
        if aqi and aqi >= 4:
            risk += 0.3
            
    if "heart_disease" in conditions:
        if aqi and aqi >= 4:
            risk += 0.4

    return min(risk, 1.0)