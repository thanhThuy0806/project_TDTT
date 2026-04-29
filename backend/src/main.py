from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from contextlib import asynccontextmanager
from db.database import engine, SessionLocal
from config.cron import start_cron
from fastapi.middleware.cors import CORSMiddleware
from routes.profile import router as profile_router

# 1. Khai báo Pydantic Model (Hứng dữ liệu từ React Native gửi lên)
class UserInfoCreate(BaseModel):
    userId: str
    name: str
    gender: str
    dob: Optional[str] = None
    phone: str
    emergencyName: str
    emergencyPhone: str

# 2. Dependency để lấy DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        start_cron()
    except Exception as e:
        print(f"Cron error: {e}")
    
    print("Application is starting up...")
    yield
    print("Application is shutting down...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

app.include_router(profile_router, tags=["Profile"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

