// Project Face — TypeScript Type Definitions

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: 'free' | 'premium' | 'professional';
  is_active: boolean;
  is_verified: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SkinAnalysis {
  id: number;
  overall_score: number | null;
  skin_type: string | null;
  hydration_level: number | null;
  texture_score: number | null;
  sun_damage_score: number | null;
  acne_severity: number | null;
  wrinkle_score: number | null;
  pigmentation_score: number | null;
  redness_score: number | null;
  pore_size_score: number | null;
  conditions_detected: SkinCondition[] | null;
  recommendations: string[] | null;
  product_recommendations: ProductRecommendation[] | null;
  weather_data: WeatherData | null;
  uv_index: number | null;
  humidity: number | null;
  temperature: number | null;
  confidence_score: number | null;
  carbon_cost_grams: number | null;
  created_at: string;
}

export interface SkinCondition {
  name: string;
  severity: number;
  description: string;
  confidence: number;
}

export interface ProductRecommendation {
  name: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  affiliate_url: string | null;
  price_range: string | null;
  reason: string | null;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  uv_index: number;
  description: string;
  feels_like: number;
  wind_speed: number;
  city: string | null;
  skin_advisory: string | null;
}

export interface AnalysisHistory {
  id: number;
  analysis_id: number;
  overall_score: number | null;
  hydration_level: number | null;
  texture_score: number | null;
  sun_damage_score: number | null;
  notes: string | null;
  recorded_at: string;
}

export interface ClinicalTrial {
  nct_id: string;
  title: string;
  status: string | null;
  conditions: string[] | null;
  interventions: string[] | null;
  locations: TrialLocation[] | null;
  summary: string | null;
  url: string | null;
}

export interface TrialLocation {
  facility: string;
  city: string;
  state: string;
  country: string;
}

export interface MedicalTourismDest {
  destination: string;
  country: string;
  specialties: string[];
  estimated_cost_range: string;
  quality_rating: number;
  description: string;
  facilities: string[];
  travel_advisory: string | null;
}

export interface EcoMetrics {
  total_carbon_grams: number;
  total_analyses: number;
  avg_carbon_per_analysis: number;
  trees_equivalent: number;
  eco_rating: string;
}

export interface SubscriptionStatus {
  subscription_id: string | null;
  status: string | null;
  tier: string;
  current_period_end: string | null;
}
