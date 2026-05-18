from pydantic import BaseModel
from typing import Optional

# 1. Khai báo Pydantic Model (Hứng dữ liệu từ React Native gửi lên)
class UserInfoCreate(BaseModel):
    userId: str
    name: str
    gender: str
    dob: Optional[str] = None
    phone: str
    emergencyName: str
    emergencyPhone: str


# Khung dữ liệu điện thoại sẽ gửi lên
class SOSRequest(BaseModel):
    lat: float
    lng: float
    emergency_type: str
