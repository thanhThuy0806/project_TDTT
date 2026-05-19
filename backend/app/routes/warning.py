import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.schemas.warning import CheckDangerRequest, CheckDangerResponse, AlertItem, CheckPlaceRequest
from app.services.warning.danger_service import danger_service
from app.prompt.system_prompt import WARNING_HEADER, WARNING_SERVICE_SYSTEM_PROMPT, SHORT_WARNING_SERVICE_SYSTEM_PROMPT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/warning", tags=["Warning"])

@router.post("/check-danger", response_model=CheckDangerResponse)
async def check_danger_by_coordinate(req: CheckDangerRequest):
    result = await danger_service.check(f'{req.lat},{req.lng}', WARNING_HEADER, SHORT_WARNING_SERVICE_SYSTEM_PROMPT)
    
    return CheckDangerResponse(
        lat=result.get("lat", req.lat),
        lng=result.get("lng", req.lng),
        place_name=result.get("place_name", ""),
        is_danger=result.get("is_danger", False),
        status=result.get("status", "safe"),
        alerts=[AlertItem(**a) for a in result.get("alerts", []) if isinstance(a, dict)],
    )
    
@router.post("/check-place", response_model=CheckDangerResponse)
async def check_danger_by_place(req: CheckPlaceRequest):
    result = await danger_service.check(req.place, WARNING_HEADER, SHORT_WARNING_SERVICE_SYSTEM_PROMPT)
    
    # Ép kiểu an toàn, nếu là None thì chuyển thành 0.0
    lat_val = result.get("lat")
    lng_val = result.get("lng")
    
    return CheckDangerResponse(
        lat=lat_val if lat_val is not None else 0.0,
        lng=lng_val if lng_val is not None else 0.0,
        place_name=result.get("place_name", ""),
        is_danger=result.get("is_danger", False),
        status=result.get("status", "safe"),
        alerts=[AlertItem(**a) for a in result.get("alerts", []) if isinstance(a, dict)],
    )
@router.websocket("/ws/tracking")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebBrowser đã kết nối!")
    try:
        while True:
            data = await websocket.receive_text()
            coords = json.loads(data)
            lat = float(coords.get("lat"))
            lng = float(coords.get("lng"))

            result = await danger_service.check(f'{lat},{lng}', WARNING_HEADER, WARNING_SERVICE_SYSTEM_PROMPT)

            response = {
                "status": result.get("status", "safe"),
                "is_danger": result.get("is_danger", False),
                "place_name": result.get("place_name", ""),
                "alerts": result.get("alerts", []),
            }
            
            # Đảm bảo chỉ trích xuất alertText khi 'alerts' đúng định dạng
            if result.get("is_danger") and result.get("alerts") and isinstance(result["alerts"], list) and len(result["alerts"]) > 0:
                response["alertText"] = result["alerts"][0].get("text", "")
            else:
                response["alertText"] = ""

            await websocket.send_json(response)

    except WebSocketDisconnect:
        logger.info("WebBrowser đã ngắt kết nối.")
    except Exception as e:
        logger.error(f"Lỗi dữ liệu đầu vào: {e}")