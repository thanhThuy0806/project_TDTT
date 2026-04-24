from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env (như API_KEY, PORT)
load_dotenv()

# Khởi tạo ứng dụng Flask
app = Flask(__name__)

# Lấy cấu hình từ biến môi trường
API_KEY = os.getenv("OPENWEATHER_KEY")
PORT = int(os.getenv("PORT", 3000))
BASE_URL = "https://api.openweathermap.org/data/2.5"

def call_weather_api(endpoint, params):
    """
    Hàm bổ trợ (Helper) để gửi yêu cầu đến API OpenWeather.
    Giúp code gọn sạch hơn, tránh lặp lại việc truyền API_KEY.
    """
    # Thêm API key và đơn vị đo metric (độ C) vào tham số truyền đi
    params.update({"appid": API_KEY, "units": "metric"})
    
    # Gửi request GET đến OpenWeather, giới hạn chờ (timeout) 5 giây
    response = requests.get(f"{BASE_URL}/{endpoint}", params=params, timeout=5)
    return response

@app.route("/weather/today")
def today_weather():
    """Route lấy thời tiết hiện tại dựa trên kinh độ (lon) và vĩ độ (lat)"""
    # Lấy tham số lat, lon từ URL (Query String)
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    # Kiểm tra nếu người dùng quên không truyền lat hoặc lon
    if not lat or not lon:
        return jsonify({"error": "Thiếu tham số lat hoặc lon"}), 400

    try:
        # Gọi hàm helper để lấy dữ liệu thời tiết hiện tại
        res = call_weather_api("weather", {"lat": lat, "lon": lon})
        
        # Nếu OpenWeather trả về lỗi (ví dụ sai tọa độ hoặc sai Key)
        if res.status_code != 200:
            return jsonify(res.json()), res.status_code

        data = res.json()
        
        # Trả về các thông tin cần thiết dưới dạng JSON cho Frontend
        return jsonify({
            "location": data.get("name"),                               # Tên địa điểm
            "temperature": data.get("main", {}).get("temp"),            # Nhiệt độ
            "humidity": data.get("main", {}).get("humidity"),          # Độ ẩm
            "weather": data.get("weather", [{}])[0].get("description"), # Mô tả thời tiết
            "wind": data.get("wind", {}).get("speed")                   # Tốc độ gió
        })

    except Exception as e:
        # Ghi lại lỗi vào hệ thống log để kiểm tra sau này
        app.logger.error(f"Lỗi khi lấy thời tiết hiện tại: {e}")
        return jsonify({"error": "Lỗi máy chủ nội bộ"}), 500

@app.route("/weather/forecast")
def forecast():
    """Route lấy dự báo thời tiết cho 5 ngày tới"""
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Thiếu tham số lat hoặc lon"}), 400

    try:
        # Gọi API lấy dự báo (OpenWeather trả về mỗi 3 giờ một lần)
        res = call_weather_api("forecast", {"lat": lat, "lon": lon})

        if res.status_code != 200:
            return jsonify(res.json()), res.status_code

        data = res.json()
        
        # Lọc dữ liệu: Chỉ lấy các bản ghi vào lúc 12:00:00 trưa mỗi ngày
        result = [
            {
                "date": item.get("dt_txt"),                                # Ngày giờ dự báo
                "temperature": item.get("main", {}).get("temp"),           # Nhiệt độ dự báo
                "weather": item.get("weather", [{}])[0].get("description"),# Mô tả
                "wind": item.get("wind", {}).get("speed")                  # Tốc độ gió
            }
            for item in data.get("list", [])
            if "12:00:00" in item.get("dt_txt", "") # Kiểm tra chuỗi thời gian
        ]

        return jsonify(result)

    except Exception as e:
        app.logger.error(f"Lỗi khi lấy dự báo thời tiết: {e}")
        return jsonify({"error": "Lỗi máy chủ nội bộ"}), 500

if __name__ == "__main__":
    # Chạy server. host="0.0.0.0" cho phép truy cập từ thiết bị khác trong mạng
    # debug=True giúp tự động tải lại code khi bạn thay đổi
    app.run(host="0.0.0.0", port=PORT, debug=True)