import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SERP_API = os.getenv("SERP_API")

settings = Settings()