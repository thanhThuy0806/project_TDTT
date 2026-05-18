<<<<<<< HEAD
### frontend:

```
npx expo start
```

### backend:

```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
=======
### 1. Flow của tính năng weather

Firebase Auth
↓
JWT Token
↓
FastAPI Dependency
↓
Firestore User Profile
↓
Weather API
↓
Feature Extraction
↓
Risk Engine
↓
Health Engine
↓
Trend Engine
↓
Advice Engine
↓
Personalized Weather Advice

**feature_engine**
Trích xuất dữ liệu thời tiết thành feature

**risk_engine**
Đánh giá độ nguy hiểm tổng quát của thời tiết

**health_engine**
Đánh giá nguy cơ với user cụ thể

**trend_engine**
Phân tích xu hướng thời tiết nhiều ngày

**advice_engine**
Sinh recommendation cuối cùng
>>>>>>> BE_Warning
