from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import logging

from backend.danger_service import danger_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Accessibility & Safety API",
    description="API cảnh báo nguy hiểm kết hợp Static Zones + Dynamic WebRAG",
)

# ── CORS middleware (cho phép frontend kết nối) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# REQUEST / RESPONSE MODELS
# ---------------------------------------------------------
class CheckDangerRequest(BaseModel):
    lat: float
    lng: float


class AlertItem(BaseModel):
    type: str        # "static" | "dynamic"
    severity: str    # "low" | "medium" | "high"
    text: str
    source: str | None = None
    zone: str | None = None


class CheckDangerResponse(BaseModel):
    lat: float
    lng: float
    place_name: str | None
    is_danger: bool
    status: str      # "safe" | "danger"
    alerts: list[AlertItem]


# ---------------------------------------------------------
# REST API ENDPOINTS
# ---------------------------------------------------------

@app.post("/api/check-danger", response_model=CheckDangerResponse)
async def check_danger(req: CheckDangerRequest):
    """
    Kiểm tra nguy hiểm tại tọa độ (lat, lng).

    Luồng hoạt động:
    1. Kiểm tra static danger zones (vùng cấm vĩnh viễn)
    2. Reverse geocode tọa độ → tên địa danh
    3. Kiểm tra cache (TTL 5 phút)
    4. Nếu cache miss: SearXNG search → LLM phân tích
    5. Trả về kết quả kết hợp
    """
    result = await danger_service.check(req.lat, req.lng)
    return CheckDangerResponse(
        lat=result["lat"],
        lng=result["lng"],
        place_name=result.get("place_name"),
        is_danger=result["is_danger"],
        status=result["status"],
        alerts=[AlertItem(**a) for a in result.get("alerts", [])],
    )


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "danger-warning"}


# ---------------------------------------------------------
# WEBSOCKET ENDPOINT (giữ nguyên cho realtime tracking)
# ---------------------------------------------------------

@app.websocket("/ws/tracking")
async def websocket_endpoint(websocket: WebSocket):
    """
    Quản lý luồng giao tiếp realtime qua WebSocket.
    Sử dụng DangerCheckService (có cache) để tránh overload LLM.
    """
    await websocket.accept()
    logger.info("WebBrowser đã kết nối!")
    try:
        while True:
            # Nhận tọa độ từ WebBrowser
            data = await websocket.receive_text()
            coords = json.loads(data)
            lat = float(coords.get("lat"))
            lng = float(coords.get("lng"))

            # Gọi DangerCheckService (kết hợp static + dynamic + cache)
            result = await danger_service.check(lat, lng)

            # Gửi kết quả về WebBrowser
            response = {
                "status": result["status"],
                "is_danger": result["is_danger"],
                "place_name": result.get("place_name"),
                "alerts": result.get("alerts", []),
            }
            # Backward compatibility: include alertText for existing frontend
            if result["is_danger"] and result.get("alerts"):
                response["alertText"] = result["alerts"][0].get("text", "")
            else:
                response["alertText"] = ""

            await websocket.send_json(response)

    except WebSocketDisconnect:
        logger.info("WebBrowser đã ngắt kết nối.")
    except Exception as e:
        logger.error(f"Lỗi dữ liệu đầu vào: {e}")
