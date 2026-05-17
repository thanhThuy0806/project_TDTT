# app/services/voice/tts_service.py
import edge_tts
import uuid
import re
import logging
from app.config.voice import settings

logger = logging.getLogger(__name__)

async def text_to_speech(text: str) -> str:
    VOICE = settings.TTS_VOICE.strip()

    # 1. LÀM SẠCH VĂN BẢN (Crucial Fix): 
    # Loại bỏ hoàn toàn các ký tự ký hiệu Markdown '**' dùng để in đậm text
    cleaned_text = text.replace("**", "")
    
    # Thay thế các dấu xuống dòng liên tiếp (\n\n) bằng một khoảng trắng kèm dấu chấm
    # Điều này giúp chuỗi văn bản liền mạch hơn, tránh làm ngắt kết nối WebSocket của Microsoft
    cleaned_text = re.sub(r'\n+', ' ', cleaned_text).strip()

    if not cleaned_text:
        logger.warning("Văn bản sau khi lọc ký tự đặc biệt bị rỗng!")
        raise ValueError("Văn bản chuyển đổi giọng nói không được để trống.")

    filename = f"static/{uuid.uuid4()}.mp3"
    
    logger.info(f"🗣️ Đang gửi văn bản sạch tới Edge TTS ({len(cleaned_text)} ký tự)...")
    
    # 2. Thực hiện gọi kết nối gửi chuỗi đã làm sạch
    communicate = edge_tts.Communicate(cleaned_text, VOICE)
    await communicate.save(filename)
    
    return filename