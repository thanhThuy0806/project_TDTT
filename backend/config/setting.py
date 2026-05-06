# config.py: File cấu hình trung tâm của hệ thống: API KEY, PORT, Các tham số tuning (window size, threshold...)

import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

# API Key OpenWeather
API_KEY = os.getenv("OPENWEATHER_KEY")

# Base URL API
BASE_URL = "https://api.openweathermap.org/data/2.5"

# Port server
PORT = int(os.getenv("PORT", 3000))

# Sliding window size (dùng để làm mượt dữ liệu)
WINDOW_SIZE = 5

# Ngưỡng cảnh báo (có thể tuning)
ALERT_THRESHOLD = 0.7