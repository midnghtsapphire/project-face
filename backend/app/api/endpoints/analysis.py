"""
Project Face — Skin Analysis Endpoints
"""
import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.api.endpoints.auth import get_current_user
from app.models.models import User, SkinAnalysis, AnalysisHistory
from app.schemas.schemas import SkinAnalysisResponse, AnalysisHistoryResponse
from app.services.skin_analysis import analyze_skin_image
from app.services.weather import get_weather_data
from app.services.eco_metrics import record_carbon

router = APIRouter(prefix="/analysis", tags=["Skin Analysis"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze", response_model=SkinAnalysisResponse)
async def analyze_skin(
    image: UploadFile = File(..., description="Selfie photo for skin analysis"),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a selfie photo for AI-powered skin analysis.
    Optionally provide GPS coordinates for weather-aware recommendations.
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )

    # Read and save image
    image_bytes = await image.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large. Maximum 10MB.")

    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(image_bytes)

    # Get weather data if GPS provided
    weather_data = None
    lat = latitude or current_user.latitude
    lon = longitude or current_user.longitude
    if lat and lon:
        weather_data = await get_weather_data(lat, lon)

    # Run AI analysis
    analysis_result = await analyze_skin_image(image_bytes, weather_data)

    # Save to database
    skin_analysis = SkinAnalysis(
        user_id=current_user.id,
        image_path=filepath,
        overall_score=analysis_result.get("overall_score"),
        skin_type=analysis_result.get("skin_type"),
        hydration_level=analysis_result.get("hydration_level"),
        texture_score=analysis_result.get("texture_score"),
        sun_damage_score=analysis_result.get("sun_damage_score"),
        acne_severity=analysis_result.get("acne_severity"),
        wrinkle_score=analysis_result.get("wrinkle_score"),
        pigmentation_score=analysis_result.get("pigmentation_score"),
        redness_score=analysis_result.get("redness_score"),
        pore_size_score=analysis_result.get("pore_size_score"),
        conditions_detected=analysis_result.get("conditions_detected"),
        recommendations=analysis_result.get("recommendations"),
        product_recommendations=analysis_result.get("product_recommendations"),
        weather_data=weather_data,
        uv_index=weather_data.get("uv_index") if weather_data else None,
        humidity=weather_data.get("humidity") if weather_data else None,
        temperature=weather_data.get("temperature") if weather_data else None,
        analysis_model=analysis_result.get("analysis_model"),
        confidence_score=analysis_result.get("confidence_score"),
        carbon_cost_grams=analysis_result.get("carbon_cost_grams", 0),
    )
    db.add(skin_analysis)
    db.commit()
    db.refresh(skin_analysis)

    # Record to history
    history_entry = AnalysisHistory(
        user_id=current_user.id,
        analysis_id=skin_analysis.id,
        overall_score=skin_analysis.overall_score,
        hydration_level=skin_analysis.hydration_level,
        texture_score=skin_analysis.texture_score,
        sun_damage_score=skin_analysis.sun_damage_score,
    )
    db.add(history_entry)

    # Record carbon
    record_carbon(
        db, current_user.id, "skin_analysis",
        analysis_result.get("carbon_cost_grams", 0),
        "AI skin analysis API call",
    )

    db.commit()

    return SkinAnalysisResponse.model_validate(skin_analysis)


@router.get("/history", response_model=List[SkinAnalysisResponse])
def get_analysis_history(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the user's skin analysis history."""
    analyses = (
        db.query(SkinAnalysis)
        .filter(SkinAnalysis.user_id == current_user.id)
        .order_by(SkinAnalysis.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [SkinAnalysisResponse.model_validate(a) for a in analyses]


@router.get("/history/trends", response_model=List[AnalysisHistoryResponse])
def get_trends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get analysis trends over time for before/after tracking."""
    history = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == current_user.id)
        .order_by(AnalysisHistory.recorded_at.asc())
        .all()
    )
    return [AnalysisHistoryResponse.model_validate(h) for h in history]


@router.get("/{analysis_id}", response_model=SkinAnalysisResponse)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific skin analysis by ID."""
    analysis = (
        db.query(SkinAnalysis)
        .filter(
            SkinAnalysis.id == analysis_id,
            SkinAnalysis.user_id == current_user.id,
        )
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return SkinAnalysisResponse.model_validate(analysis)
