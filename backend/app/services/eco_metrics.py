"""
Project Face — Carbon Efficiency & Eco Metrics Service
Tracks and reports the carbon footprint of AI operations.
"""
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.models import EcoMetrics, SkinAnalysis


def record_carbon(
    db: Session,
    user_id: Optional[int],
    action_type: str,
    carbon_grams: float,
    description: str = "",
) -> EcoMetrics:
    """Record a carbon emission event."""
    metric = EcoMetrics(
        user_id=user_id,
        action_type=action_type,
        carbon_grams=carbon_grams,
        description=description,
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric


def get_user_eco_summary(db: Session, user_id: int) -> dict:
    """Get eco metrics summary for a user."""
    total_carbon = (
        db.query(func.sum(EcoMetrics.carbon_grams))
        .filter(EcoMetrics.user_id == user_id)
        .scalar()
        or 0.0
    )

    total_analyses = (
        db.query(func.count(SkinAnalysis.id))
        .filter(SkinAnalysis.user_id == user_id)
        .scalar()
        or 0
    )

    avg_carbon = total_carbon / max(total_analyses, 1)

    # One mature tree absorbs ~22kg CO2/year = ~60g/day
    trees_equivalent = total_carbon / 22000.0

    if avg_carbon < 0.5:
        eco_rating = "Excellent"
    elif avg_carbon < 1.0:
        eco_rating = "Good"
    elif avg_carbon < 2.0:
        eco_rating = "Moderate"
    else:
        eco_rating = "Needs Improvement"

    return {
        "total_carbon_grams": round(total_carbon, 4),
        "total_analyses": total_analyses,
        "avg_carbon_per_analysis": round(avg_carbon, 4),
        "trees_equivalent": round(trees_equivalent, 6),
        "eco_rating": eco_rating,
    }
