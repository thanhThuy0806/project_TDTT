from fastapi import APIRouter, File, UploadFile
import logging
from app.services.voice.stt_service import transcribe_audio
from app.services.voice.llm_service import analyze
from app.services.voice.tts_service import text_to_speech
from app.config.voice import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/voice")
async def voice(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    
    user_text = await transcribe_audio(audio_bytes)
    logger.info(f"🎙️ Whisper nhận diện thành công văn bản: '{user_text}'")
    
    if not user_text or not user_text.strip():
        return {
            "type": "detail",
            "content": "Cháu chưa nghe rõ tiếng ạ, bác có thể bấm nút và nói lại được không?",
            "audio_url": None,
            "user_text": ""
        }
    
    try:
        llm_result = await analyze(user_text)
    except Exception as llm_err:
        logger.error(f"❌ Lỗi gọi mô hình Gemma 4: {llm_err}")
        return {
            "type": "detail",
            "content": "Hệ thống thông tin đang bận một chút, bác chờ cháu vài giây nhé.",
            "audio_url": None,
            "user_text": user_text
        }
    
    response_type = llm_result.get("type", "detail")
    response_content = llm_result.get("content", "")
    emergency_type = llm_result.get("emergency_type", "")
    lat = llm_result.get("lat")
    lng = llm_result.get("lng")
    footnote = llm_result.get("footnote", "")

    print(f'\nResponse: {response_content}')
    audio_url = None

    if response_type in ["detail", "navigate"] and response_content and response_content.strip():
        try:
            mp3_filename = await text_to_speech(response_content)
            audio_url = f"http://{settings.API_URL}:8000/{mp3_filename}"
        except Exception as tts_err:
            logger.error(f"⚠️ Cảnh báo: Trình tạo giọng nói Edge TTS thất bại: {tts_err}")
            audio_url = None
    else:
        audio_url = None
        
    print('doneeeeeeee!!!')
    return {
        "type": response_type,
        "content": response_content,
        "audio_url": audio_url,
        "user_text": user_text,
        "emergency_type": emergency_type,
        "lat": lat,
        "lng": lng,
        "footnote": footnote
    }