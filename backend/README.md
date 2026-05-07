# 🛡️ Backend — Cảnh báo Vùng Nguy hiểm (Dynamic WebRAG)

Hệ thống cảnh báo nguy hiểm kết hợp **Static Danger Zones** (vùng cấm vĩnh viễn) và **Dynamic WebRAG** (tìm kiếm sự kiện thời gian thực qua AI).

---

## 🚀 Hướng dẫn chạy Backend

### Yêu cầu hệ thống

| Công cụ | Phiên bản | Ghi chú |
|---------|-----------|---------|
| Python | 3.10+ | Cần có `pip` |
| Docker | 20+ | Để chạy SearXNG |
| Ollama | latest | Để chạy LLM local |

### Bước 1: Tạo môi trường ảo & cài thư viện

```bash
# Từ thư mục gốc project (project_TDTT/)
python -m venv .venv

# Kích hoạt môi trường ảo
# Windows (PowerShell):
.venv\Scripts\activate
# Windows (CMD):
.venv\Scripts\activate.bat
# macOS/Linux:
source .venv/bin/activate

# Cài đặt thư viện
pip install -r backend/requirements.txt
```

### Bước 2: Khởi động SearXNG (Docker)

SearXNG là công cụ tìm kiếm local, cần thiết cho tính năng WebRAG.

```bash
# Từ thư mục gốc project (nơi có Dockerfile và settings.yml)

# Build image (chỉ cần chạy lần đầu)
docker build -t my-searxng .

# Chạy container
docker run -d -p 8888:8080 my-searxng
```

> ✅ Kiểm tra: truy cập `http://localhost:8888` — nếu thấy giao diện SearXNG là thành công.

### Bước 3: Khởi động Ollama (LLM)

```bash
ollama run gemma4:e2b
```

> ⏳ Lần đầu sẽ tải model (~5GB), các lần sau khởi động nhanh.
>
> ⚠️ Nếu máy có RAM < 6GB, dùng model nhỏ hơn: `ollama run gemma3:4b` và set `$env:OLLAMA_MODEL = "gemma3:4b"` trước khi chạy backend.

### Bước 4: Chạy Backend Server

```bash
# Từ thư mục gốc project (project_TDTT/)
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

> ✅ Server chạy tại `http://localhost:8000`
> 📖 Swagger UI (API docs): `http://localhost:8000/docs`

---

## ⚡ Tóm tắt nhanh (copy & paste)

```bash
# Terminal 1 — SearXNG
docker run -d -p 8888:8080 my-searxng

# Terminal 2 — Ollama
ollama run gemma4:e2b

# Terminal 3 — Backend
.venv\Scripts\activate
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

---

## ✅ Kiểm tra hoạt động

Sau khi chạy xong 3 terminal, kiểm tra từng service:

| Kiểm tra | Cách kiểm tra | Kết quả mong đợi |
|----------|--------------|-------------------|
| **Backend** | Mở `http://localhost:8000/api/health` | `{"status": "ok"}` |
| **Swagger docs** | Mở `http://localhost:8000/docs` | Trang API docs |
| **SearXNG** | Mở `http://localhost:8888` | Giao diện tìm kiếm |
| **Ollama** | Chạy `ollama list` trong terminal | Thấy model `gemma4:e2b` |

### Test nhanh API cảnh báo

```bash
# PowerShell
Invoke-RestMethod -Method POST -Uri "http://localhost:8000/api/check-danger" -ContentType "application/json" -Body '{"lat": 10.762, "lng": 106.682}'

# hoặc curl
curl -X POST http://localhost:8000/api/check-danger -H "Content-Type: application/json" -d '{"lat": 10.762, "lng": 106.682}'
```

Nếu thấy kết quả JSON có `status`, `is_danger`, `alerts` → Backend hoạt động bình thường ✅

---

## 🔧 Cấu hình (tùy chọn)

Dùng biến môi trường để tùy chỉnh:

```bash
# Windows (PowerShell)
$env:SEARXNG_HOST = "http://localhost:8888"
$env:OLLAMA_MODEL = "Gemma4:E2B"
$env:CACHE_TTL = "300"
```

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `SEARXNG_HOST` | `http://localhost:8888` | URL của SearXNG |
| `OLLAMA_MODEL` | `Gemma4:E2B` | Model LLM sử dụng |
| `CACHE_TTL` | `300` | Thời gian cache (giây) |

---

## 📡 API Reference

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/check-danger` | Kiểm tra nguy hiểm tại tọa độ |
| `WS` | `/ws/tracking` | WebSocket realtime tracking |
| `GET` | `/api/health` | Health check |

> ✅ Frontend đã tích hợp sẵn WebSocket qua hook `useDangerTracking.jsx`. Xem [Frontend README](../frontend/README.md).

---

## ⚙️ Cách hoạt động

1. **Static Zones** — Kiểm tra tọa độ trong polygon cố định (tức thì, không tốn API)
2. **Reverse Geocode** — Chuyển `(lat, lng)` → tên địa danh qua OpenStreetMap
3. **Cache** — Ô lưới ~100m, TTL 5 phút. Tọa độ gần nhau dùng chung kết quả
4. **SearXNG Search** — Tìm tin tức nguy hiểm tại khu vực (chạy local qua Docker)
5. **LLM Analysis** — Gemma4 phân tích kết quả, chỉ lọc tin **trong 24 giờ qua**
6. **Response** — Trả kết quả kết hợp Static + Dynamic với mức độ `low` / `medium` / `high`
