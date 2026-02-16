/**
 * Project Face — Mock API Service
 * Intercepts API calls when running in demo/standalone mode (no backend).
 * Provides a fully functional demo experience with realistic data.
 */
import type {
  TokenResponse, User, SkinAnalysis, WeatherData,
  ClinicalTrial, MedicalTourismDest, EcoMetrics,
  SubscriptionStatus, AnalysisHistory,
} from '../types';
import {
  DEMO_USER, DEMO_TOKEN_RESPONSE, DEMO_ANALYSIS, DEMO_ANALYSES,
  DEMO_TRENDS, DEMO_WEATHER, DEMO_ECO, DEMO_TRIALS, DEMO_TOURISM,
  DEMO_SUBSCRIPTION, simulateDelay,
} from './mockData';

/**
 * Check if we're in demo mode.
 * Demo mode is active when:
 * - VITE_DEMO_MODE is explicitly set to 'true', OR
 * - No VITE_API_URL is configured (standalone static deployment)
 */
export function isDemoMode(): boolean {
  return (
    import.meta.env.VITE_DEMO_MODE === 'true' ||
    (!import.meta.env.VITE_API_URL && typeof window !== 'undefined')
  );
}

// Wrap response to match axios response shape { data: T }
function mockResponse<T>(data: T): { data: T } {
  return { data };
}

// ---- Mock Auth API ----
export const mockAuthAPI = {
  register: async (_email: string, _password: string, full_name?: string): Promise<{ data: TokenResponse }> => {
    await simulateDelay(600);
    const user = { ...DEMO_USER, full_name: full_name || 'Demo User', email: _email };
    return mockResponse({ ...DEMO_TOKEN_RESPONSE, user });
  },

  login: async (_email: string, _password: string): Promise<{ data: TokenResponse }> => {
    await simulateDelay(600);
    return mockResponse(DEMO_TOKEN_RESPONSE);
  },

  getMe: async (): Promise<{ data: User }> => {
    await simulateDelay(200);
    const stored = localStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : DEMO_USER;
    return mockResponse(user);
  },

  updateMe: async (data: Partial<User>): Promise<{ data: User }> => {
    await simulateDelay(400);
    const stored = localStorage.getItem('user');
    const current = stored ? JSON.parse(stored) : DEMO_USER;
    const updated = { ...current, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    return mockResponse(updated);
  },
};

// ---- Mock Analysis API ----
export const mockAnalysisAPI = {
  analyze: async (_formData: FormData): Promise<{ data: SkinAnalysis }> => {
    await simulateDelay(2500); // Simulate AI processing time
    const randomScore = 60 + Math.floor(Math.random() * 30);
    return mockResponse({
      ...DEMO_ANALYSIS,
      id: Date.now(),
      overall_score: randomScore,
      hydration_level: 50 + Math.floor(Math.random() * 40),
      texture_score: 55 + Math.floor(Math.random() * 35),
      created_at: new Date().toISOString(),
    });
  },

  getHistory: async (limit = 20, _offset = 0): Promise<{ data: SkinAnalysis[] }> => {
    await simulateDelay(300);
    return mockResponse(DEMO_ANALYSES.slice(0, limit));
  },

  getTrends: async (): Promise<{ data: AnalysisHistory[] }> => {
    await simulateDelay(300);
    return mockResponse(DEMO_TRENDS);
  },

  getById: async (id: number): Promise<{ data: SkinAnalysis }> => {
    await simulateDelay(200);
    const found = DEMO_ANALYSES.find(a => a.id === id) || DEMO_ANALYSIS;
    return mockResponse(found);
  },
};

// ---- Mock Weather API ----
export const mockWeatherAPI = {
  getCurrent: async (_latitude: number, _longitude: number): Promise<{ data: WeatherData }> => {
    await simulateDelay(400);
    return mockResponse(DEMO_WEATHER);
  },

  getMyLocation: async (): Promise<{ data: WeatherData }> => {
    await simulateDelay(400);
    return mockResponse(DEMO_WEATHER);
  },
};

// ---- Mock Trials API ----
export const mockTrialsAPI = {
  search: async (condition: string, _location?: string, _status?: string, _max_results?: number): Promise<{ data: ClinicalTrial[] }> => {
    await simulateDelay(800);
    // Filter demo trials by condition keyword
    const lower = condition.toLowerCase();
    const filtered = DEMO_TRIALS.filter(t =>
      t.conditions?.some(c => c.toLowerCase().includes(lower)) ||
      t.title.toLowerCase().includes(lower)
    );
    return mockResponse(filtered.length > 0 ? filtered : DEMO_TRIALS);
  },

  getDetails: async (_nctId: string): Promise<{ data: ClinicalTrial }> => {
    await simulateDelay(300);
    const found = DEMO_TRIALS.find(t => t.nct_id === _nctId) || DEMO_TRIALS[0];
    return mockResponse(found);
  },
};

// ---- Mock Tourism API ----
export const mockTourismAPI = {
  getRecommendations: async (_condition: string, _budget_range?: string, _preferred_region?: string): Promise<{ data: MedicalTourismDest[] }> => {
    await simulateDelay(800);
    return mockResponse(DEMO_TOURISM);
  },
};

// ---- Mock Subscription API ----
export const mockSubscriptionAPI = {
  createCheckout: async (_price_id: string, _success_url: string, _cancel_url: string): Promise<{ data: { url: string } }> => {
    await simulateDelay(300);
    return mockResponse({ url: '#demo-checkout' });
  },

  getStatus: async (): Promise<{ data: SubscriptionStatus }> => {
    await simulateDelay(200);
    return mockResponse(DEMO_SUBSCRIPTION);
  },

  cancel: async (): Promise<{ data: { message: string } }> => {
    await simulateDelay(300);
    return mockResponse({ message: 'Subscription cancelled (demo)' });
  },
};

// ---- Mock Eco API ----
export const mockEcoAPI = {
  getMetrics: async (): Promise<{ data: EcoMetrics }> => {
    await simulateDelay(300);
    return mockResponse(DEMO_ECO);
  },
};
