# weather.py (route): Layer nhận request từ client
# Nhiệm vụ:
# - Validate input
# - Gọi service
# - Trả response""

from flask import Blueprint, request, jsonify
from backend.modules.weather_service import get_weather_warning

weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/weather/warning")
def weather_warning():
    # API:
    # GET /weather/warning?lat=...&lon=...

    # Returns:
    #        JSON cảnh báo thời tiết

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Thiếu lat hoặc lon"}), 400

    data, status = get_weather_warning(lat, lon)
    return jsonify(data), status