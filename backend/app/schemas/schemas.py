"""
Project Face — Pydantic Schemas for Request/Response Validation
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


# ---- Auth ----
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    subscription_tier: str
    is_active: bool
    is_verified: bool
    latitude: Optional[float]
    longitude: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timezone_str: Optional[str] = None


# ---- Skin Analysis ----
class SkinAnalysisRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class SkinCondition(BaseModel):
    name: str
    severity: float = Field(..., ge=0, le=10)
    description: str
    confidence: float = Field(..., ge=0, le=1)


class ProductRec(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    affiliate_url: Optional[str] = None
    price_range: Optional[str] = None
    reason: Optional[str] = None


class SkinAnalysisResponse(BaseModel):
    id: int
    overall_score: Optional[float]
    skin_type: Optional[str]
    hydration_level: Optional[float]
    texture_score: Optional[float]
    sun_damage_score: Optional[float]
    acne_severity: Optional[float]
    wrinkle_score: Optional[float]
    pigmentation_score: Optional[float]
    redness_score: Optional[float]
    pore_size_score: Optional[float]
    conditions_detected: Optional[List[Dict[str, Any]]]
    recommendations: Optional[List[str]]
    product_recommendations: Optional[List[Dict[str, Any]]]
    weather_data: Optional[Dict[str, Any]]
    uv_index: Optional[float]
    humidity: Optional[float]
    temperature: Optional[float]
    confidence_score: Optional[float]
    carbon_cost_grams: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisHistoryResponse(BaseModel):
    id: int
    analysis_id: int
    overall_score: Optional[float]
    hydration_level: Optional[float]
    texture_score: Optional[float]
    sun_damage_score: Optional[float]
    notes: Optional[str]
    recorded_at: datetime

    class Config:
        from_attributes = True


# ---- Weather ----
class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    uv_index: float
    description: str
    feels_like: float
    wind_speed: float
    city: Optional[str] = None
    skin_advisory: Optional[str] = None


class GPSRequest(BaseModel):
    latitude: float
    longitude: float


# ---- Clinical Trials ----
class ClinicalTrialResponse(BaseModel):
    nct_id: str
    title: str
    status: Optional[str]
    conditions: Optional[List[str]]
    interventions: Optional[List[str]]
    locations: Optional[List[Dict[str, Any]]]
    summary: Optional[str]
    url: Optional[str]


class ClinicalTrialSearchRequest(BaseModel):
    condition: str = "skin"
    location: Optional[str] = None
    status: Optional[str] = "RECRUITING"
    max_results: int = Field(default=10, le=50)


# ---- Stripe / Subscription ----
class CreateCheckoutRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class SubscriptionResponse(BaseModel):
    subscription_id: Optional[str]
    status: Optional[str]
    tier: str
    current_period_end: Optional[datetime]


# ---- Eco Metrics ----
class EcoMetricsResponse(BaseModel):
    total_carbon_grams: float
    total_analyses: int
    avg_carbon_per_analysis: float
    trees_equivalent: float
    eco_rating: str


# ---- Medical Tourism ----
class MedicalTourismRequest(BaseModel):
    condition: str
    budget_range: Optional[str] = None
    preferred_region: Optional[str] = None


class MedicalTourismResponse(BaseModel):
    destination: str
    country: str
    specialties: List[str]
    estimated_cost_range: str
    quality_rating: float
    description: str
    facilities: List[str]
    travel_advisory: Optional[str] = None
