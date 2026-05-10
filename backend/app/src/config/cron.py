import os
import httpx 
from apscheduler.schedulers.background import BackgroundScheduler

API_URL = os.getenv("API_URL")

scheduler = BackgroundScheduler()

def refresh_data():
    try:
        res = httpx.get(API_URL, timeout=10)

        if res.status_code == 200:
            print("Làm mới dữ liệu thành công")
        else:
            print(f"Làm mới thất bại: {res.status_code}")

    except Exception as e:
        print("Lỗi khi làm mới dữ liệu:", str(e))


def start_cron():
    scheduler.add_job(refresh_data, "interval", minutes=14)
    scheduler.start()