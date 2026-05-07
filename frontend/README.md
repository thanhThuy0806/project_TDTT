# 🌐 Frontend — Accessibility & Safety Web App

Ứng dụng web hỗ trợ người dùng theo dõi vị trí, cảnh báo nguy hiểm và các tính năng an toàn.

**Tech stack:** React 19 · Vite · Tailwind CSS v4 · Leaflet · Firebase · Framer Motion

---

## 🚀 Hướng dẫn chạy Frontend

### Yêu cầu hệ thống

| Công cụ | Phiên bản | Ghi chú |
|---------|-----------|---------|
| Node.js | 18+ | Cần có `npm` |
| Backend | đang chạy | Xem [Backend README](../backend/README.md) |

### Bước 1: Cài đặt dependencies

```bash
cd frontend
npm install
```

> ⏳ Lần đầu sẽ mất vài phút để tải tất cả packages.

### Bước 2: Cấu hình biến môi trường

Kiểm tra file `.env` trong thư mục `frontend/`. Đảm bảo các biến sau đã được thiết lập:

```env
# URL backend API
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

> ℹ️ File `.env` đã có sẵn trong project. Chỉ cần cập nhật nếu cần thay đổi cấu hình.

### Bước 3: Chạy Frontend Dev Server

```bash
npm run dev
```

> ✅ Ứng dụng chạy tại `http://localhost:5173`

---

## ⚡ Tóm tắt nhanh (copy & paste)

```bash
cd frontend
npm install        # chỉ cần lần đầu
npm run dev        # chạy dev server
```

---

## 📦 Các lệnh có sẵn

| Lệnh | Mô tả |
|-------|-------|
| `npm run dev` | Chạy dev server (hot reload) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview bản build production |
| `npm run lint` | Kiểm tra lỗi code với ESLint |

---

## ✅ Kiểm tra hoạt động

Sau khi chạy frontend + backend, mở `http://localhost:5173`:

1. **Cho phép vị trí** — Trình duyệt sẽ hỏi quyền truy cập GPS. Nhấn "Allow".
2. **Bản đồ** — Sẽ tự động center tại vị trí thực của bạn (marker xanh nhấp nháy).
3. **Chuông cảnh báo** (góc phải dưới) — Hiển thị "Đang theo dõi" nếu kết nối backend thành công.
4. **Cảnh báo nguy hiểm** — Nếu bạn ở gần vùng nguy hiểm, sẽ xuất hiện thông báo đỏ.

> ⚠️ Nếu chuông hiển thị "Mất kết nối", kiểm tra lại backend đã chạy tại `http://localhost:8000` chưa.

---

## 🔗 Kết nối với Backend

Frontend tự động kết nối Backend qua WebSocket:

- **WebSocket**: `ws://localhost:8000/ws/tracking` — theo dõi vị trí + nhận cảnh báo realtime
- **REST API**: `POST /api/check-danger` — kiểm tra nguy hiểm tại tọa độ (có thể dùng bổ sung)

> ⚠️ **Quan trọng:** Đảm bảo Backend đang chạy trước khi sử dụng các tính năng cảnh báo. Xem [hướng dẫn chạy Backend](../backend/README.md).