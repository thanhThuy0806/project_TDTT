import os
# File: backend/src/routes/sos.py
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
# load env
load_dotenv()

router = APIRouter()


# Khung dữ liệu điện thoại sẽ gửi lên
class SOSRequest(BaseModel):
    lat: float
    lng: float
    emergency_type: str


@router.post("/search")
async def search_rescue_unit(request: SOSRequest):
    # Xác định từ khóa tìm kiếm dựa trên loại sự cố
    keyword = "hospital"
    if request.emergency_type in ["fire", "disaster"]:
        keyword = "fire station"
    elif request.emergency_type == "violence":
        keyword = "police station"

    # API Key của SerpApi
    API_KEY = os.getenv("SERP_API")

    try:
        url = f"https://serpapi.com/search.json?engine=google_maps&q={keyword}&ll=@{request.lat},{request.lng},14z&type=search&api_key={API_KEY}"
        response = requests.get(url)
        data = response.json()

        # Lấy kết quả đầu tiên (Gần nhất)
        if "local_results" in data and len(data["local_results"]) > 0:
            nearest = data["local_results"][0]
            return {
                "status": "success",
                "unit": {
                    "name": nearest.get("title", "Đơn vị cứu hộ"),
                    "address": nearest.get("address", "Không rõ địa chỉ")
                }
            }

        return {"status": "error", "message": "Không tìm thấy đơn vị gần đây"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
