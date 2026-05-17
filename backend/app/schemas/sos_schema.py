from pydantic import BaseModel
from enum import Enum

class EmergencyType(str, Enum):
    medical = "medical"
    fire = "fire"
    disaster = "disaster"
    accident = "accident"
    violence = "violence"
    rescue = "rescue"

class SOSRequest(BaseModel):
    lat: float
    lng: float
    emergency_type: EmergencyType