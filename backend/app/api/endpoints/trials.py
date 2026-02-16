"""
Project Face — Clinical Trials Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends
from app.api.endpoints.auth import get_current_user
from app.models.models import User
from app.schemas.schemas import ClinicalTrialResponse, ClinicalTrialSearchRequest
from app.services.clinical_trials import search_clinical_trials, get_trial_details

router = APIRouter(prefix="/trials", tags=["Clinical Trials"])


@router.post("/search", response_model=List[ClinicalTrialResponse])
async def search_trials(
    search: ClinicalTrialSearchRequest,
    current_user: User = Depends(get_current_user),
):
    """Search ClinicalTrials.gov for relevant dermatology trials."""
    results = await search_clinical_trials(
        condition=search.condition,
        location=search.location,
        status=search.status,
        max_results=search.max_results,
    )
    return [ClinicalTrialResponse(**r) for r in results]


@router.get("/{nct_id}")
async def get_trial(
    nct_id: str,
    current_user: User = Depends(get_current_user),
):
    """Get detailed information about a specific clinical trial."""
    details = await get_trial_details(nct_id)
    if not details:
        return {"error": "Trial not found"}
    return details
