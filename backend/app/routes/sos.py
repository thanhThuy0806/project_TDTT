# import os
# from fastapi import APIRouter
# from dotenv import load_dotenv
# from app.schemas.sos_schema import SOSRequest
# import requests

# load_dotenv()

# router = APIRouter(prefix="/sos", tags=["sos"])

# @router.post("/search")
# async def search_rescue_unit(request: SOSRequest):
#     keyword = "hospital"
#     if request.emergency_type in ["fire", "disaster"]:
#         keyword = "fire station"
#     elif request.emergency_type == "violence":
#         keyword = "police station"

#     API_KEY = os.getenv("SERP_API")

#     try:
#         url = f"https://serpapi.com/search.json?engine=google_maps&q={keyword}&ll=@{request.lat},{request.lng},14z&type=search&api_key={API_KEY}"
#         response = requests.get(url)
#         data = response.json()

#         # Lấy kết quả đầu tiên (Gần nhất)
#         if "local_results" in data and len(data["local_results"]) > 0:
#             nearest = data["local_results"][0]
#             return {
#                 "status": "success",
#                 "unit": {
#                     "name": nearest.get("title", "Đơn vị cứu hộ"),
#                     "address": nearest.get("address", "Không rõ địa chỉ")
#                 }
#             }

#         return {"status": "error", "message": "Không tìm thấy đơn vị gần đây"}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}

# app/routes/sos_route.py

from fastapi import APIRouter
from datetime import datetime

from app.schemas.sos_schema import SOSRequest
from app.services.sos.sos_service import search_best_unit

router = APIRouter(
    prefix="/sos",
    tags=["sos"]
)

SOS_HISTORY = []

@router.post("/search")
async def search_rescue_unit(
    request: SOSRequest
):
    best_unit = await search_best_unit(
        request.lat,
        request.lng,
        request.emergency_type.value
    )

    if not best_unit:
        return {
            "status": "error",
            "message": "Không tìm thấy đơn vị cứu hộ"
        }

    history_item = {
        "time": datetime.utcnow().isoformat(),
        "lat": request.lat,
        "lng": request.lng,
        "emergency_type":
            request.emergency_type.value,
        "unit": best_unit,
    }

    SOS_HISTORY.append(history_item)

    return {
        "status": "success",
        "unit": best_unit,
        "history_id": len(SOS_HISTORY),
    }
