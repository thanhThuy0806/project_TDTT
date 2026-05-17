from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class UserProfile(BaseModel):
    name: str
    phone: str
    gender: str
    dob: date
    mobility: str
    conditions: List[str]
    emergencyName: Optional[str] = None
    emergencyPhone: Optional[str] = None