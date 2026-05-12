from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
#from routes.profile import router as profile_router
from src.routes.sos import router as sos_router

# 1. Khai báo Pydantic Model (Hứng dữ liệu từ React Native gửi lên)
class UserInfoCreate(BaseModel):
    userId: str
    name: str
    gender: str
    dob: Optional[str] = None
    phone: str
    emergencyName: str
    emergencyPhone: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

#app.include_router(profile_router, tags=["Profile"])
app.include_router(sos_router, prefix="/api/sos", tags=["SOS"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
