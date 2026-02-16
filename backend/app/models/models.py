"""
Project Face — SQLAlchemy ORM Models
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime,
    ForeignKey, JSON, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PREMIUM = "premium"
    PROFESSIONAL = "professional"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    avatar_url = Column(Text, nullable=True)
    subscription_tier = Column(
        SQLEnum(SubscriptionTier), default=SubscriptionTier.FREE, nullable=False
    )
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    timezone_str = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    analyses = relationship("SkinAnalysis", back_populates="user", cascade="all, delete-orphan")
    history = relationship("AnalysisHistory", back_populates="user", cascade="all, delete-orphan")


class SkinAnalysis(Base):
    __tablename__ = "skin_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(Text, nullable=False)
    thumbnail_path = Column(Text, nullable=True)

    # AI Analysis Results
    overall_score = Column(Float, nullable=True)
    skin_type = Column(String(50), nullable=True)
    hydration_level = Column(Float, nullable=True)
    texture_score = Column(Float, nullable=True)
    sun_damage_score = Column(Float, nullable=True)
    acne_severity = Column(Float, nullable=True)
    wrinkle_score = Column(Float, nullable=True)
    pigmentation_score = Column(Float, nullable=True)
    redness_score = Column(Float, nullable=True)
    pore_size_score = Column(Float, nullable=True)

    # Detailed results as JSON
    conditions_detected = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    product_recommendations = Column(JSON, nullable=True)

    # Environmental context
    weather_data = Column(JSON, nullable=True)
    uv_index = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)

    # Metadata
    analysis_model = Column(String(100), nullable=True)
    confidence_score = Column(Float, nullable=True)
    carbon_cost_grams = Column(Float, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="analyses")
    history = relationship("AnalysisHistory", back_populates="analysis", cascade="all, delete-orphan")


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("skin_analyses.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, nullable=True)
    hydration_level = Column(Float, nullable=True)
    texture_score = Column(Float, nullable=True)
    sun_damage_score = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="history")
    analysis = relationship("SkinAnalysis", back_populates="history")


class ClinicalTrial(Base):
    __tablename__ = "clinical_trials_cache"

    id = Column(Integer, primary_key=True, index=True)
    nct_id = Column(String(20), unique=True, index=True, nullable=False)
    title = Column(Text, nullable=False)
    status = Column(String(50), nullable=True)
    conditions = Column(JSON, nullable=True)
    interventions = Column(JSON, nullable=True)
    locations = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)
    url = Column(Text, nullable=True)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ProductRecommendation(Base):
    __tablename__ = "product_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    affiliate_url = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    price_range = Column(String(50), nullable=True)
    skin_types = Column(JSON, nullable=True)
    conditions_targeted = Column(JSON, nullable=True)
    rating = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class EcoMetrics(Base):
    __tablename__ = "eco_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    action_type = Column(String(100), nullable=False)
    carbon_grams = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
