"""
Project Face — Weather & GPS Endpoints
"""
from fastapi import APIRouter, Depends
from app.api.endpoints.auth import get_current_user
from app.models.models import User
from app.schemas.schemas import WeatherResponse, GPSRequest
from app.services.weather import get_weather_data

router = APIRouter(prefix="/weather", tags=["Weather & GPS"])


@router.post("/current", response_model=WeatherResponse)
async def get_current_weather(
    gps: GPSRequest,
    current_user: User = Depends(get_current_user),
):
    """Get current weather and skin advisory for a GPS location."""
    data = await get_weather_data(gps.latitude, gps.longitude)
    return WeatherResponse(**data)


@router.get("/my-location", response_model=WeatherResponse)
async def get_my_weather(
    current_user: User = Depends(get_current_user),
):
    """Get weather for the user's saved location."""
    if not current_user.latitude or not current_user.longitude:
        return WeatherResponse(
            temperature=0, humidity=0, uv_index=0,
            description="Location not set", feels_like=0, wind_speed=0,
            skin_advisory="Please update your location in settings.",
        )
    data = await get_weather_data(current_user.latitude, current_user.longitude)
    return WeatherResponse(**data)
