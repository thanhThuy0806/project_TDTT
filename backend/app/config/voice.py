import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GOONG_API_KEY = os.getenv("GOONG_API_KEY")

    # HF_TOKEN = os.getenv("HF_TOKEN")

    WHISPER_MODEL = "openai/whisper-small"

    LLM_MODEL = "google/gemma-2b-it"

    WIKI_BASE_URL = "https://vi.wikipedia.org/api/rest_v1/page/summary/"
    
    GOONG_GEOCODE_URL = "https://rsapi.goong.io/geocode"

    TTS_VOICE = "vi-VN-HoaiMyNeural"

    PORT = os.getenv("PORT", 8000)

settings = Settings()