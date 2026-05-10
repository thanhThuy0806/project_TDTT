from app.services.voice.llm_service import analyze_text
from app.services.voice.goong_service import geocode
from app.services.voice.wikipedia_service import get_place_info
from app.services.voice.tts_service import text_to_speech

async def process_query(text):
    analysis = analyze_text(text)
    intent = analysis["intent"]
    place = analysis["place"]

    # MAP
    if intent == "navigation":
        location = geocode(place)
        response = f"Đang tìm đường tới {place}"
        audio = await text_to_speech(response)
        return {
            "type": "map",
            "text": response,
            "audio": audio,
            "location": location
        }

    # PLACE INFO
    elif intent == "place_info":
        info = get_place_info(place)
        if not info:
            info = "Không tìm thấy thông tin địa điểm"
        audio = await text_to_speech(info)
        return {
            "type": "place",
            "text": info,
            "audio": audio
        }

    # UNSUPPORTED
    response = "Hệ thống không hỗ trợ"
    
    audio = await text_to_speech(response)

    return {
        "type": "unsupported",
        "text": response,
        "audio": audio
    }