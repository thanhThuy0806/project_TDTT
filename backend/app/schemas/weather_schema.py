from pydantic import BaseModel
from typing import List, Optional

class Condition(BaseModel):
    text: str
    icon: Optional[str] = None

class AirQuality(BaseModel):
    us_epa_index: Optional[int] = None

class Current(BaseModel):
    temp_c: float
    humidity: int
    wind_kph: float
    uv: float
    pressure_mb: float
    gust_kph: float
    air_quality: Optional[AirQuality]

class Day(BaseModel):
    maxtemp_c: float
    mintemp_c: float
    daily_chance_of_rain: int
    condition: Condition

class ForecastDay(BaseModel):
    date: str
    day: Day

class Forecast(BaseModel):
    forecastday: List[ForecastDay]

class Location(BaseModel):
    name: str

class MultiDay(BaseModel):
    rain_days: int
    temp_trend: str


class WeatherResponse(BaseModel):
    location: Location
    current: Current
    forecast: Forecast
    risk_score: float
    health_risk: float
    trend: str
    multi_day: MultiDay
    advice: List[str]