from pydantic import BaseModel

# ---------------------------------------------------------
# REQUEST / RESPONSE MODELS
# ---------------------------------------------------------
class CheckDangerRequest(BaseModel):
    lat: float
    lng: float


class AlertItem(BaseModel):
    type: str        # "static" | "dynamic"
    severity: str    # "low" | "medium" | "high"
    text: str
    source: str | None = None
    zone: str | None = None


class CheckDangerResponse(BaseModel):
    lat: float
    lng: float
    place_name: str | None
    is_danger: bool
    status: str      # "safe" | "danger"
    alerts: list[AlertItem]

class LocationInfomation(BaseModel):
    lat: float
    lng: float
    traffic: str
    weather: dict[ str, str]