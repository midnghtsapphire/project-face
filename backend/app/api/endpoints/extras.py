"""
Project Face — Medical Tourism & Eco Metrics Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.endpoints.auth import get_current_user
from app.models.models import User
from app.schemas.schemas import (
    MedicalTourismRequest, MedicalTourismResponse, EcoMetricsResponse
)
from app.services.medical_tourism import get_recommendations
from app.services.eco_metrics import get_user_eco_summary

router = APIRouter(tags=["Extras"])


@router.post("/medical-tourism", response_model=List[MedicalTourismResponse])
async def medical_tourism(
    request: MedicalTourismRequest,
    current_user: User = Depends(get_current_user),
):
    """Get medical tourism recommendations for skin conditions."""
    results = await get_recommendations(
        condition=request.condition,
        budget_range=request.budget_range,
        preferred_region=request.preferred_region,
    )
    return [MedicalTourismResponse(**r) for r in results]


@router.get("/eco-metrics", response_model=EcoMetricsResponse)
def eco_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get carbon efficiency metrics for the current user."""
    summary = get_user_eco_summary(db, current_user.id)
    return EcoMetricsResponse(**summary)
