from fastapi import APIRouter, Depends
from app.schemas.weather_schema import WeatherResponse
from app.services.weather.weather_service import get_weather
from app.services.user.firebase_service import get_user_profile
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/", response_model=WeatherResponse)
def fetch_weather(
    lat: float,
    lon: float,
    user=Depends(get_current_user)
):
    user_id = user["uid"]
    user_profile = get_user_profile(user_id)
    result = get_weather(lat, lon, user_profile)

    return result