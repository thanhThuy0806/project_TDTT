from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from shapely.geometry import Point, Polygon
import json

app = FastAPI()

# ── CORS middleware (cho phép frontend kết nối) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# MOCK DATA: Giả lập một vùng nguy hiểm (VD: Khu vực sạt lở)
# Tọa độ Polygon: (Kinh độ - lng, Vĩ độ - lat)
# ---------------------------------------------------------
DANGER_ZONE = Polygon([
    (106.680, 10.760),
    (106.685, 10.760),
    (106.685, 10.765),
    (106.680, 10.765)
])

# ---------------------------------------------------------
# CÁC THÀNH PHẦN THEO SƠ ĐỒ TUẦN TỰ
# ---------------------------------------------------------

class WebRAG:
    @staticmethod
    def truy_van_vung_nguy_hiem(coords: tuple) -> str:
        """Bước 4 & 5: Nhận tọa độ, truy vấn RAG/DB và trả về 'Kết quả vùng'"""
        # Giả lập nội dung cảnh báo sinh ra từ dữ liệu thực tế
        return "Cảnh báo: Khu vực phía trước đang có nguy cơ sạt lở cao. Đề nghị bật chế độ SOS hoặc chuyển hướng!"


class GeofencingService:
    @staticmethod
    def kiem_tra_vi_tri(lat: float, lng: float) -> dict:
        """Bước 3 & 6: System gọi kiểm tra vị trí. Geofencing tự gọi WebRAG nếu cần."""
        user_point = Point(lng, lat) # Shapely dùng hệ (x, y) = (lng, lat)
        
        # Kiểm tra xem tọa độ GPS có rơi vào vùng nguy hiểm không
        if DANGER_ZONE.contains(user_point):
            # Bước 4 & 5: Gọi WebRAG để lấy thông tin vùng nguy hiểm
            alert_text = WebRAG.truy_van_vung_nguy_hiem((lat, lng))
            
            # Bước 6: Trả về 'Kết quả lân cận' (có nguy hiểm) cho System
            return {"is_danger": True, "alert_text": alert_text}
        
        # Bước 6: Trả về 'Kết quả lân cận' (an toàn) cho System
        return {"is_danger": False, "alert_text": ""}


def phan_tich_rui_ro(lat: float, lng: float) -> dict:
    """Khối màu vàng và khối rẽ nhánh [alt] trong sơ đồ"""
    # Bước 3: System gọi GeofencingService
    ket_qua_lan_can = GeofencingService.kiem_tra_vi_tri(lat, lng)
    
    # Khối alt: Rẽ nhánh luồng dựa trên kết quả lân cận
    if ket_qua_lan_can["is_danger"]:
        # Trường hợp [có nguy hiểm]
        return {
            "status": "danger",
            "alertText": ket_qua_lan_can["alert_text"]
        }
    else:
        # Trường hợp [không có nguy hiểm]
        return {
            "status": "safe",
            "message": "Trạng thái an toàn"
        }

# ---------------------------------------------------------
# SYSTEM API (Tương tác với WebBrowser qua WebSocket)
# ---------------------------------------------------------

@app.websocket("/ws/tracking")
async def websocket_endpoint(websocket: WebSocket):
    """Quản lý Bước 2, 7, 9: Luồng giao tiếp realtime"""
    await websocket.accept()
    print("WebBrowser đã kết nối!")
    try:
        while True:
            # Bước 2: System nhận 'chuyển tọa độ (coords)' từ WebBrowser
            data = await websocket.receive_text()
            coords = json.loads(data)
            lat = float(coords.get("lat"))
            lng = float(coords.get("lng"))

            # System tự gọi tiến trình nội bộ 'phân tích rủi ro()'
            result = phan_tich_rui_ro(lat, lng)

            # Bước 7 & 9: Gửi cảnh báo (alertText) hoặc trạng thái an toàn về lại WebBrowser
            await websocket.send_json(result)

    except WebSocketDisconnect:
        print("WebBrowser đã ngắt kết nối.")
    except Exception as e:
        print(f"Lỗi dữ liệu đầu vào: {e}")
