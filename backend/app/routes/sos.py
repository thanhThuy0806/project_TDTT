from fastapi import APIRouter
from datetime import datetime

from app.schemas.sos_schema import SOSRequest
from app.services.sos.sos_service import search_best_unit

router = APIRouter(
    prefix="/sos",
    tags=["sos"]
)

SOS_HISTORY = []

@router.post("/search")
async def search_rescue_unit(
    request: SOSRequest
):
    best_unit = await search_best_unit(
        request.lat,
        request.lng,
        request.emergency_type.value
    )

    if not best_unit:
        return {
            "status": "error",
            "message": "Không tìm thấy đơn vị cứu hộ"
        }

    history_item = {
        "time": datetime.utcnow().isoformat(),
        "lat": request.lat,
        "lng": request.lng,
        "emergency_type":
            request.emergency_type.value,
        "unit": best_unit,
    }

    SOS_HISTORY.append(history_item)

    return {
        "status": "success",
        "unit": best_unit,
        "history_id": len(SOS_HISTORY),
    }
