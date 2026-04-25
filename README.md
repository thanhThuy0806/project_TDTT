# Tính năng Voice

### 1. Cài môi trường ảo:

1. Chạy lệnh này tại thư mục gốc của project
   `python -m venv .venv`

2. Kích hoạt môi trường ảo
   `.venv\Scripts\activate`

3. Kiểm tra đã kích hoạt môi trường ảo chưa
   `python -c "import sys; print(sys.executable)`

### 2. Chạy chương trình:

Chạy đồng thời backend và frontend

- **Backend:**
  `cd backend`
  `uvicorn main:app --reload`

- **Frontend:**
  `cd frontend`
  `npm run dev`
