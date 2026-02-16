/**
 * Project Face — Mock Data & Demo API Layer
 * Provides realistic demo data when no backend is running.
 * Enables the app to function as a standalone static site on GitHub Pages.
 */
import type {
  TokenResponse, User, SkinAnalysis, WeatherData,
  ClinicalTrial, MedicalTourismDest, EcoMetrics,
  SubscriptionStatus, AnalysisHistory,
} from '../types';

// ---- Demo User ----
export const DEMO_USER: User = {
  id: 1,
  email: 'demo@projectface.app',
  full_name: 'Demo User',
  avatar_url: null,
  subscription_tier: 'free',
  is_active: true,
  is_verified: true,
  latitude: 39.7392,
  longitude: -104.9903,
  created_at: '2025-01-15T10:00:00Z',
};

export const DEMO_TOKEN_RESPONSE: TokenResponse = {
  access_token: 'demo-token-project-face-2025',
  token_type: 'bearer',
  user: DEMO_USER,
};

// ---- Demo Skin Analysis ----
export const DEMO_ANALYSIS: SkinAnalysis = {
  id: 1,
  overall_score: 72,
  skin_type: 'combination',
  hydration_level: 65,
  texture_score: 70,
  sun_damage_score: 25,
  acne_severity: 2,
  wrinkle_score: 18,
  pigmentation_score: 30,
  redness_score: 22,
  pore_size_score: 35,
  conditions_detected: [
    {
      name: 'Mild Dehydration',
      severity: 3,
      description: 'Slight dehydration detected in the T-zone area. Consider increasing water intake and using a hyaluronic acid serum.',
      confidence: 0.87,
    },
    {
      name: 'Minor Sun Damage',
      severity: 2,
      description: 'Early signs of UV-related pigmentation on the cheeks. Daily SPF 50+ is strongly recommended.',
      confidence: 0.82,
    },
    {
      name: 'Enlarged Pores',
      severity: 3,
      description: 'Slightly enlarged pores around the nose and chin area. Niacinamide-based products can help minimize appearance.',
      confidence: 0.79,
    },
  ],
  recommendations: [
    'Apply SPF 50+ broad-spectrum sunscreen daily, even on cloudy days.',
    'Incorporate a hyaluronic acid serum into your morning routine for improved hydration.',
    'Use a gentle BHA exfoliant 2-3 times per week to address pore congestion.',
    'Consider adding a Vitamin C serum in the morning for antioxidant protection.',
    'Moisturize with a ceramide-based cream at night to strengthen the skin barrier.',
    'Stay hydrated — aim for 8 glasses of water daily for optimal skin health.',
  ],
  product_recommendations: [
    {
      name: 'CeraVe Hydrating Facial Cleanser',
      brand: 'CeraVe',
      category: 'Cleanser',
      description: 'Gentle, non-foaming cleanser with ceramides and hyaluronic acid.',
      affiliate_url: null,
      price_range: '$12-16',
      reason: 'Perfect for combination skin — cleanses without stripping natural oils.',
    },
    {
      name: 'The Ordinary Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      category: 'Serum',
      description: 'Multi-weight hyaluronic acid formula for deep hydration.',
      affiliate_url: null,
      price_range: '$8-12',
      reason: 'Addresses the dehydration detected in your analysis.',
    },
    {
      name: 'La Roche-Posay Anthelios SPF 50+',
      brand: 'La Roche-Posay',
      category: 'Sunscreen',
      description: 'Lightweight, broad-spectrum UV protection.',
      affiliate_url: null,
      price_range: '$25-35',
      reason: 'Essential for preventing further sun damage detected in your scan.',
    },
    {
      name: 'Paula\'s Choice 2% BHA Liquid Exfoliant',
      brand: 'Paula\'s Choice',
      category: 'Exfoliant',
      description: 'Salicylic acid exfoliant for unclogging pores.',
      affiliate_url: null,
      price_range: '$30-35',
      reason: 'Targets enlarged pores and improves skin texture.',
    },
  ],
  weather_data: {
    temperature: 68,
    humidity: 42,
    uv_index: 6,
    description: 'Partly cloudy',
    feels_like: 66,
    wind_speed: 8,
    city: 'Denver',
    skin_advisory: 'Moderate UV — apply sunscreen. Low humidity may increase dehydration.',
  },
  uv_index: 6,
  humidity: 42,
  temperature: 68,
  confidence_score: 0.85,
  carbon_cost_grams: 0.342,
  created_at: '2025-02-10T14:30:00Z',
};

// ---- Demo Analysis History ----
export const DEMO_ANALYSES: SkinAnalysis[] = [
  DEMO_ANALYSIS,
  {
    ...DEMO_ANALYSIS,
    id: 2,
    overall_score: 68,
    hydration_level: 60,
    texture_score: 65,
    sun_damage_score: 28,
    created_at: '2025-01-28T11:15:00Z',
    conditions_detected: [
      { name: 'Dehydration', severity: 4, description: 'Moderate dehydration detected.', confidence: 0.85 },
    ],
  },
  {
    ...DEMO_ANALYSIS,
    id: 3,
    overall_score: 64,
    hydration_level: 55,
    texture_score: 62,
    sun_damage_score: 30,
    created_at: '2025-01-15T09:45:00Z',
    conditions_detected: [
      { name: 'Dehydration', severity: 5, description: 'Significant dehydration detected.', confidence: 0.88 },
      { name: 'Sun Damage', severity: 3, description: 'Moderate UV damage on forehead.', confidence: 0.80 },
    ],
  },
  {
    ...DEMO_ANALYSIS,
    id: 4,
    overall_score: 60,
    hydration_level: 50,
    texture_score: 58,
    sun_damage_score: 32,
    created_at: '2025-01-02T16:20:00Z',
    conditions_detected: [],
  },
];

// ---- Demo Trends ----
export const DEMO_TRENDS: AnalysisHistory[] = [
  { id: 1, analysis_id: 4, overall_score: 60, hydration_level: 50, texture_score: 58, sun_damage_score: 32, notes: null, recorded_at: '2025-01-02T16:20:00Z' },
  { id: 2, analysis_id: 3, overall_score: 64, hydration_level: 55, texture_score: 62, sun_damage_score: 30, notes: null, recorded_at: '2025-01-15T09:45:00Z' },
  { id: 3, analysis_id: 2, overall_score: 68, hydration_level: 60, texture_score: 65, sun_damage_score: 28, notes: null, recorded_at: '2025-01-28T11:15:00Z' },
  { id: 4, analysis_id: 1, overall_score: 72, hydration_level: 65, texture_score: 70, sun_damage_score: 25, notes: null, recorded_at: '2025-02-10T14:30:00Z' },
];

// ---- Demo Weather ----
export const DEMO_WEATHER: WeatherData = {
  temperature: 68,
  humidity: 42,
  uv_index: 6,
  description: 'Partly cloudy',
  feels_like: 66,
  wind_speed: 8,
  city: 'Denver',
  skin_advisory: 'Moderate UV index today. Apply SPF 50+ sunscreen. Low humidity — keep skin hydrated with a moisturizer.',
};

// ---- Demo Eco Metrics ----
export const DEMO_ECO: EcoMetrics = {
  total_carbon_grams: 1.368,
  total_analyses: 4,
  avg_carbon_per_analysis: 0.342,
  trees_equivalent: 0.000062,
  eco_rating: 'Excellent',
};

// ---- Demo Clinical Trials ----
export const DEMO_TRIALS: ClinicalTrial[] = [
  {
    nct_id: 'NCT05123456',
    title: 'A Phase 3 Study of Topical Ruxolitinib for Atopic Dermatitis in Adults',
    status: 'RECRUITING',
    conditions: ['Atopic Dermatitis', 'Eczema'],
    interventions: ['Ruxolitinib Cream 1.5%', 'Vehicle Cream'],
    locations: [
      { facility: 'University of Colorado Dermatology', city: 'Aurora', state: 'Colorado', country: 'United States' },
      { facility: 'Denver Skin Clinic', city: 'Denver', state: 'Colorado', country: 'United States' },
    ],
    summary: 'This study evaluates the efficacy and safety of topical ruxolitinib cream for the treatment of moderate-to-severe atopic dermatitis in adult patients.',
    url: 'https://clinicaltrials.gov/ct2/show/NCT05123456',
  },
  {
    nct_id: 'NCT05234567',
    title: 'Dupilumab Combined with Phototherapy for Moderate Psoriasis',
    status: 'RECRUITING',
    conditions: ['Psoriasis', 'Plaque Psoriasis'],
    interventions: ['Dupilumab 300mg', 'Narrowband UVB Phototherapy'],
    locations: [
      { facility: 'National Jewish Health', city: 'Denver', state: 'Colorado', country: 'United States' },
    ],
    summary: 'A randomized controlled trial investigating the combination of dupilumab with narrowband UVB phototherapy for patients with moderate plaque psoriasis.',
    url: 'https://clinicaltrials.gov/ct2/show/NCT05234567',
  },
  {
    nct_id: 'NCT05345678',
    title: 'Novel Retinoid Formulation for Acne Vulgaris: A Multi-Center Trial',
    status: 'RECRUITING',
    conditions: ['Acne Vulgaris', 'Acne'],
    interventions: ['Trifarotene 0.005% Cream', 'Adapalene 0.3% Gel'],
    locations: [
      { facility: 'Colorado Dermatology Institute', city: 'Colorado Springs', state: 'Colorado', country: 'United States' },
      { facility: 'Rocky Mountain Skin Care', city: 'Boulder', state: 'Colorado', country: 'United States' },
    ],
    summary: 'Comparing a novel fourth-generation retinoid formulation against standard adapalene for the treatment of moderate acne vulgaris.',
    url: 'https://clinicaltrials.gov/ct2/show/NCT05345678',
  },
];

// ---- Demo Medical Tourism ----
export const DEMO_TOURISM: MedicalTourismDest[] = [
  {
    destination: 'Seoul, South Korea',
    country: 'South Korea',
    specialties: ['Dermatology', 'Cosmetic Surgery', 'Laser Treatments', 'K-Beauty Clinics'],
    estimated_cost_range: '$2,000 - $8,000',
    quality_rating: 9.2,
    description: 'Seoul is the global capital of skincare innovation. World-renowned dermatology clinics offer cutting-edge treatments at a fraction of Western prices, with exceptional post-care support.',
    facilities: ['Gangnam Severance Hospital', 'ID Hospital', 'Oracle Dermatology'],
    travel_advisory: 'Visa-free entry for most nationalities. Excellent public transit. Many clinics have English-speaking staff.',
  },
  {
    destination: 'Bangkok, Thailand',
    country: 'Thailand',
    specialties: ['Dermatology', 'Skin Rejuvenation', 'Anti-Aging', 'Acne Treatment'],
    estimated_cost_range: '$1,500 - $5,000',
    quality_rating: 8.5,
    description: 'Bangkok offers JCI-accredited hospitals with internationally trained dermatologists. Known for affordable yet high-quality skin treatments and recovery-friendly tourism.',
    facilities: ['Bumrungrad International Hospital', 'Bangkok Hospital', 'Samitivej Hospital'],
    travel_advisory: 'Visa on arrival for many countries. Tropical climate — plan sun protection during recovery.',
  },
  {
    destination: 'Istanbul, Turkey',
    country: 'Turkey',
    specialties: ['Dermatology', 'Hair Transplant', 'Cosmetic Procedures', 'PRP Therapy'],
    estimated_cost_range: '$1,000 - $4,000',
    quality_rating: 8.0,
    description: 'Istanbul has emerged as a top destination for dermatological procedures, especially hair restoration and skin rejuvenation, with competitive pricing and modern facilities.',
    facilities: ['Acibadem Healthcare Group', 'Memorial Hospital', 'Liv Hospital'],
    travel_advisory: 'E-visa available online. Rich cultural experience during recovery. Many clinics offer all-inclusive medical tourism packages.',
  },
];

// ---- Demo Subscription ----
export const DEMO_SUBSCRIPTION: SubscriptionStatus = {
  subscription_id: null,
  status: null,
  tier: 'free',
  current_period_end: null,
};

// ---- Simulated delay ----
export function simulateDelay(ms = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
