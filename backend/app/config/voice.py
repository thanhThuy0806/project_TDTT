import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GOONG_API_KEY = os.getenv("GOONG_API_KEY")
    
    LLM_MODEL = os.getenv("LLM_MODEL", "Gemma4:E4B")
    
    LLM_URL = os.getenv("LLM_URL", "http://localhost:11434/")
    
    WIKI_BASE_URL = os.getenv("WIKI_BASE_URL", "https://vi.wikipedia.org/api/rest_v1/page/summary/")
    
    GOONG_GEOCODE_URL = os.getenv("GOONG_GEOCODE_URL", "https://rsapi.goong.io/geocode")

    TTS_VOICE = os.getenv("TTS_VOICE", "vi-VN-HoaiMyNeural")

    API_URL = os.getenv("API_URL", "localhost")
    
    PORT = os.getenv("PORT", 8000)

settings = Settings()