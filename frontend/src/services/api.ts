/**
 * Project Face — API Service Layer
 * Centralized HTTP client for all backend communication.
 * Falls back to mock API in demo mode (no backend / GitHub Pages deployment).
 */
import axios from 'axios';
import type {
  TokenResponse, User, SkinAnalysis, WeatherData,
  ClinicalTrial, MedicalTourismDest, EcoMetrics,
  SubscriptionStatus, AnalysisHistory,
} from '../types';
import {
  isDemoMode,
  mockAuthAPI, mockAnalysisAPI, mockWeatherAPI,
  mockTrialsAPI, mockTourismAPI, mockSubscriptionAPI, mockEcoAPI,
} from './mockApi';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use hash-aware redirect for GitHub Pages
      window.location.href = window.location.pathname.includes('/project-face')
        ? '/project-face/login'
        : '/login';
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const authAPI = isDemoMode() ? mockAuthAPI : {
  register: (email: string, password: string, full_name?: string) =>
    api.post<TokenResponse>('/auth/register', { email, password, full_name }),

  login: (email: string, password: string) =>
    api.post<TokenResponse>('/auth/login', { email, password }),

  getMe: () => api.get<User>('/auth/me'),

  updateMe: (data: Partial<User>) => api.patch<User>('/auth/me', data),
};

// ---- Skin Analysis ----
export const analysisAPI = isDemoMode() ? mockAnalysisAPI : {
  analyze: (formData: FormData) =>
    api.post<SkinAnalysis>('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }),

  getHistory: (limit = 20, offset = 0) =>
    api.get<SkinAnalysis[]>(`/analysis/history?limit=${limit}&offset=${offset}`),

  getTrends: () => api.get<AnalysisHistory[]>('/analysis/history/trends'),

  getById: (id: number) => api.get<SkinAnalysis>(`/analysis/${id}`),
};

// ---- Weather ----
export const weatherAPI = isDemoMode() ? mockWeatherAPI : {
  getCurrent: (latitude: number, longitude: number) =>
    api.post<WeatherData>('/weather/current', { latitude, longitude }),

  getMyLocation: () => api.get<WeatherData>('/weather/my-location'),
};

// ---- Clinical Trials ----
export const trialsAPI = isDemoMode() ? mockTrialsAPI : {
  search: (condition: string, location?: string, status = 'RECRUITING', max_results = 10) =>
    api.post<ClinicalTrial[]>('/trials/search', {
      condition, location, status, max_results,
    }),

  getDetails: (nctId: string) => api.get(`/trials/${nctId}`),
};

// ---- Medical Tourism ----
export const tourismAPI = isDemoMode() ? mockTourismAPI : {
  getRecommendations: (condition: string, budget_range?: string, preferred_region?: string) =>
    api.post<MedicalTourismDest[]>('/medical-tourism', {
      condition, budget_range, preferred_region,
    }),
};

// ---- Subscription ----
export const subscriptionAPI = isDemoMode() ? mockSubscriptionAPI : {
  createCheckout: (price_id: string, success_url: string, cancel_url: string) =>
    api.post('/subscription/checkout', { price_id, success_url, cancel_url }),

  getStatus: () => api.get<SubscriptionStatus>('/subscription/status'),

  cancel: () => api.post('/subscription/cancel'),
};

// ---- Eco Metrics ----
export const ecoAPI = isDemoMode() ? mockEcoAPI : {
  getMetrics: () => api.get<EcoMetrics>('/eco-metrics'),
};

export default api;
