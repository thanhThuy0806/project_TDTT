<<<<<<< HEAD
=======
# config.py: File cấu hình trung tâm của hệ thống: API KEY, PORT, Các tham số tuning (window size, threshold...)

>>>>>>> BE_Warning
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")    
    BASE_URL = "https://api.weatherapi.com/v1/"
    PORT = os.getenv("PORT", 8000)
    WINDOW_SIZE = 5
    ALERT_THRESHOLD = 0.7

settings = Settings()