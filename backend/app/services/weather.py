"""
Project Face — Weather & UV Service
GPS-based weather lookup for skin-aware recommendations.
"""
from typing import Optional, Dict, Any
import httpx
from app.core.config import settings


async def get_weather_data(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Fetch current weather data including UV index for a given GPS location.
    Uses OpenWeatherMap API.
    """
    api_key = settings.OPENWEATHER_API_KEY

    if not api_key:
        return _mock_weather(latitude, longitude)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Current weather
            weather_url = (
                f"https://api.openweathermap.org/data/2.5/weather"
                f"?lat={latitude}&lon={longitude}&appid={api_key}&units=imperial"
            )
            weather_resp = await client.get(weather_url)
            weather_resp.raise_for_status()
            weather = weather_resp.json()

            # UV index
            uv_url = (
                f"https://api.openweathermap.org/data/2.5/uvi"
                f"?lat={latitude}&lon={longitude}&appid={api_key}"
            )
            try:
                uv_resp = await client.get(uv_url)
                uv_resp.raise_for_status()
                uv_data = uv_resp.json()
                uv_index = uv_data.get("value", 0)
            except Exception:
                uv_index = 0

            humidity = weather.get("main", {}).get("humidity", 0)
            temp = weather.get("main", {}).get("temp", 0)
            feels_like = weather.get("main", {}).get("feels_like", 0)
            wind_speed = weather.get("wind", {}).get("speed", 0)
            description = weather.get("weather", [{}])[0].get("description", "")
            city = weather.get("name", "")

            skin_advisory = _generate_skin_advisory(temp, humidity, uv_index)

            return {
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "uv_index": round(uv_index, 1),
                "description": description,
                "feels_like": round(feels_like, 1),
                "wind_speed": round(wind_speed, 1),
                "city": city,
                "skin_advisory": skin_advisory,
            }
    except Exception:
        return _mock_weather(latitude, longitude)


def _generate_skin_advisory(temp: float, humidity: float, uv_index: float) -> str:
    """Generate a skin care advisory based on weather conditions."""
    advisories = []

    if uv_index >= 8:
        advisories.append(
            "Very high UV — apply SPF 50+ every 2 hours and wear protective clothing."
        )
    elif uv_index >= 6:
        advisories.append("High UV — SPF 30+ recommended, reapply every 2-3 hours.")
    elif uv_index >= 3:
        advisories.append("Moderate UV — daily SPF 30 recommended.")

    if humidity < 30:
        advisories.append(
            "Very dry air — use a heavier moisturizer and consider a humidifier."
        )
    elif humidity > 80:
        advisories.append(
            "High humidity — use lightweight, oil-free products to prevent clogged pores."
        )

    if temp > 90:
        advisories.append(
            "Extreme heat — stay hydrated, use cooling mists, and avoid heavy products."
        )
    elif temp < 32:
        advisories.append(
            "Cold weather — protect skin with barrier creams and avoid harsh cleansers."
        )

    return " ".join(advisories) if advisories else "Conditions are moderate — maintain your regular skincare routine."


def _mock_weather(latitude: float, longitude: float) -> Dict[str, Any]:
    """Return mock weather data for development."""
    return {
        "temperature": 72.0,
        "humidity": 45.0,
        "uv_index": 5.0,
        "description": "partly cloudy",
        "feels_like": 70.0,
        "wind_speed": 8.0,
        "city": "Demo City",
        "skin_advisory": "Moderate UV — daily SPF 30 recommended.",
    }
