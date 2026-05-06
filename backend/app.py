"""
app.py
-------------------------
Entry point của ứng dụng

👉 Nhiệm vụ:
- Khởi tạo Flask app
- Register routes
- Run server
"""

from flask import Flask
from backend.modules.weather import weather_bp
from backend.config.setting import PORT

app = Flask(__name__)

# Đăng ký blueprint (route)
app.register_blueprint(weather_bp)


if __name__ == "__main__":
    """
    Chạy server

    host=0.0.0.0:
        Cho phép truy cập từ mạng LAN

    debug=True:
        Auto reload khi code thay đổi (dev only)
    """
    app.run(host="0.0.0.0", port=PORT, debug=True)