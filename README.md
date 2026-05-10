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

Flow:

```
Audio
↓
STT
↓
LLM intent extraction
↓
Router
├── Goong
├── Wikipedia
└── Unsupported
↓
LLM response generation
↓
TTS
↓
Audio response
```

### 3. Yêu cầu:

Bổ sung file .env với mẫu:

```
PORT=8000
GOONG_API_KEY=xxxx
```

Bổ sung file my-app/app/constants: đổi địa chỉ thành ip của máy.
Đồng thời sửa luôn trong voiceinteraction.js: trong hàm const handleBackendResponse = async (result), đổi thành địa chỉ IP máy

Lưu ý, frontend và backend chạy trong cùng 1 mạng
