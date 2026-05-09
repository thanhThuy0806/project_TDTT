from pydantic import BaseModel
from typing import List, Optional

class EmergencyContact(BaseModel):
    name: str
    phone: str

class UserProfile(BaseModel):
    name: str
    birth_date: str
    gender: str
    mobility: str
    conditions: List[str]
    emergency_contact: Optional[EmergencyContact]