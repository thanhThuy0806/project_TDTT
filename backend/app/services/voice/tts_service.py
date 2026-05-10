import edge_tts
import uuid
from app.config.voice import settings

async def text_to_speech(text):
    VOICE = settings.TTS_VOICE

    filename = f"static/{uuid.uuid4()}.mp3"
    
    communicate = edge_tts.Communicate(text, VOICE)

    await communicate.save(filename)

    return filename