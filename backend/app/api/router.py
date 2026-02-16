"""
Project Face — API Router Aggregator
"""
from fastapi import APIRouter

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.analysis import router as analysis_router
from app.api.endpoints.weather import router as weather_router
from app.api.endpoints.trials import router as trials_router
from app.api.endpoints.subscription import router as subscription_router
from app.api.endpoints.extras import router as extras_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(analysis_router)
api_router.include_router(weather_router)
api_router.include_router(trials_router)
api_router.include_router(subscription_router)
api_router.include_router(extras_router)
