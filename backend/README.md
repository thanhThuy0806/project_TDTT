# 🛡️ Backend — Cảnh báo Vùng Nguy hiểm (Dynamic WebRAG)

Hệ thống cảnh báo nguy hiểm kết hợp **Static Danger Zones** (vùng cấm vĩnh viễn) và **Dynamic WebRAG** (tìm kiếm sự kiện thời gian thực qua AI).

## Cài đặt & Khởi chạy

### Bước 1: Cài thư viện

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

### Bước 2: Khởi động SearXNG (Docker)

```bash
# Build image (chỉ cần lần đầu)
docker build -t my-searxng .

# Chạy container
docker run -d -p 8888:8080 my-searxng
```

### Bước 3: Khởi động Ollama

```bash
ollama run gemma4:e2b
```

### Bước 4: Chạy Backend

```bash
cd backend
uvicorn app:app --reload --port 8000
```

> Server chạy tại `http://localhost:8000`. Truy cập `http://localhost:8000/docs` để xem Swagger UI.

---

## Cách sử dụng

### 1. Kết nối và Theo dõi Vị trí liên tục (WebSocket)

Phương thức duy nhất và tối ưu cho tính năng tracking realtime của dự án là **WebSocket**. Bạn có thể thiết lập kết nối mở giữa Frontend và Backend. Khi người dùng di chuyển, Frontend sẽ gửi tọa độ lên, và Backend sẽ ngay lập tức trả về cảnh báo nếu có nguy hiểm.

**Tích hợp vào Frontend (JavaScript):**

```javascript
const ws = new WebSocket("ws://localhost:8000/ws/tracking");

ws.onopen = () => {
  console.log("Đã kết nối với hệ thống cảnh báo!");
  
  // Gửi tọa độ hiện tại lên server
  navigator.geolocation.getCurrentPosition((pos) => {
    ws.send(JSON.stringify({ 
      lat: pos.coords.latitude, 
      lng: pos.coords.longitude 
    }));
  });
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.is_danger) {
    console.log(`⚠️ NGUY HIỂM TẠI: ${data.place_name}`);
    console.log(`Chi tiết: ${data.alertText}`);
    
    // Nếu có nhiều cảnh báo chi tiết
    data.alerts.forEach((alert) => {
      console.log(`- [${alert.severity}] ${alert.text}`);
    });
  } else {
    console.log(`✅ An toàn tại: ${data.place_name}`);
  }
};

ws.onclose = () => {
  console.log("Mất kết nối với hệ thống cảnh báo.");
};
```

**Kết quả trả về qua tin nhắn WebSocket (nguy hiểm):**
```json
{
  "status": "danger",
  "is_danger": true,
  "place_name": "Đường Nguyễn Văn Cừ, TP Hồ Chí Minh",
  "alertText": "Cảnh báo: Khu vực phía trước đang có nguy cơ sạt lở cao...",
  "alerts": [
    {
      "type": "static",
      "severity": "high",
      "text": "Cảnh báo: Khu vực phía trước đang có nguy cơ sạt lở cao...",
      "zone": "Khu vực sạt lở Núi Bà Đen"
    },
    {
      "type": "dynamic",
      "severity": "medium",
      "text": "Khu vực đang có ngập lụt do mưa lớn...",
      "source": "web_rag"
    }
  ]
}
```

> ⚠️ **Lưu ý Quan trọng:** Mặc dù Backend có hệ thống Cache 5 phút để bảo vệ máy chủ, bạn **KHÔNG NÊN** thiết lập setInterval gửi tọa độ quá nhanh (như mỗi 2 giây). Nên gọi cập nhật tọa độ mỗi **30-60 giây** hoặc chỉ gửi khi tọa độ có sự thay đổi rõ rệt.

### 2. Thêm vùng nguy hiểm cố định

Chỉnh sửa file `danger_zones.json` để thêm các vùng nguy hiểm **vĩnh viễn** (vách đá, vực sâu, khu vực cấm — những nơi không xuất hiện trên tin tức):

```json
[
  {
    "name": "Tên vùng nguy hiểm",
    "polygon": [
      [106.680, 10.760],
      [106.685, 10.760],
      [106.685, 10.765],
      [106.680, 10.765]
    ],
    "alert_text": "Nội dung cảnh báo hiển thị cho người dùng",
    "severity": "high"
  }
]
```

- `polygon`: Mảng tọa độ `[kinh_độ, vĩ_độ]` tạo thành vùng khép kín
- `severity`: `"low"` | `"medium"` | `"high"`

### 3. Thay đổi cấu hình

Dùng biến môi trường để tùy chỉnh:

```bash
# Đổi URL SearXNG
set SEARXNG_HOST=http://localhost:9999

# Đổi model LLM
set OLLAMA_MODEL=gemma3:4b

# Đổi thời gian cache (giây)
set CACHE_TTL=600

# Chạy server
uvicorn app:app --reload --port 8000
```

| Biến | Mặc định | Mô tả |
|------|----------|--------|
| `SEARXNG_HOST` | `http://localhost:8888` | URL của SearXNG |
| `OLLAMA_MODEL` | `Gemma4:E2B` | Model LLM sử dụng |
| `CACHE_TTL` | `300` | Thời gian cache (giây) |

---

## API Reference

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `WS` | `/ws/tracking` | WebSocket realtime tracking (Phương thức chính) |
| `GET` | `/api/health` | Health check |

---

## Cấu trúc thư mục

```
backend/
├── app.py               # FastAPI server (WebSocket endpoints)
├── danger_service.py    # Core service (Geocoder, Cache, WebRAG, Static Zones)
├── danger_zones.json    # Vùng nguy hiểm cố định
├── requirements.txt     # Thư viện Python
└── README.md
```

## Cách hoạt động

1. **Static Zones** — Kiểm tra tọa độ trong polygon cố định (tức thì, không tốn API)
2. **Reverse Geocode** — Chuyển `(lat, lng)` → tên địa danh qua OpenStreetMap
3. **Cache** — Ô lưới ~100m, TTL 5 phút. Tọa độ gần nhau dùng chung kết quả
4. **SearXNG Search** — Tìm tin tức nguy hiểm tại khu vực (chạy local qua Docker)
5. **LLM Analysis** — Gemma4 phân tích kết quả, chỉ lọc tin **trong 24 giờ qua**
6. **Response** — Trả kết quả kết hợp Static + Dynamic với mức độ `low` / `medium` / `high`
