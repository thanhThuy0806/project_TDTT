# Tính năng Cảnh báo Vùng Nguy hiểm

## 1. Cài môi trường ảo:

Chạy lệnh này tại thư mục gốc của project
```
python -m venv .venv
```

Kích hoạt môi trường ảo
```
.venv\Scripts\activate
```

Kiểm tra đã kích hoạt môi trường ảo chưa
```
python -c "import sys; print(sys.executable)"
```

Cài đặt thư viện
```
pip install -r backend/requirements.txt
```

## 2. Chạy chương trình:

Chạy đồng thời backend và frontend

**Backend:**
```
cd backend
uvicorn app:app --reload
```

**Frontend:**
```
cd frontend
npm run dev
```
