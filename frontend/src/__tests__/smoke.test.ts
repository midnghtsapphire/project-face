/**
 * Project Face — Smoke Tests
 * Basic tests to verify core modules load and demo mode works.
 */
import { describe, it, expect } from 'vitest';
import { isDemoMode } from '../services/mockApi';
import {
  DEMO_USER, DEMO_ANALYSIS, DEMO_TRIALS, DEMO_TOURISM,
  DEMO_ECO, DEMO_WEATHER, DEMO_TRENDS, DEMO_SUBSCRIPTION,
} from '../services/mockData';
import { getScoreColor, getScoreLabel, formatDate, truncate } from '../utils/helpers';

describe('Demo Mode Detection', () => {
  it('should detect demo mode when VITE_DEMO_MODE is true', () => {
    expect(isDemoMode()).toBe(true);
  });
});

describe('Mock Data Integrity', () => {
  it('demo user has required fields', () => {
    expect(DEMO_USER.id).toBe(1);
    expect(DEMO_USER.email).toBe('demo@projectface.app');
    expect(DEMO_USER.full_name).toBe('Demo User');
    expect(DEMO_USER.is_active).toBe(true);
  });

  it('demo analysis has valid scores', () => {
    expect(DEMO_ANALYSIS.overall_score).toBeGreaterThanOrEqual(0);
    expect(DEMO_ANALYSIS.overall_score).toBeLessThanOrEqual(100);
    expect(DEMO_ANALYSIS.skin_type).toBeTruthy();
    expect(DEMO_ANALYSIS.conditions_detected!.length).toBeGreaterThan(0);
    expect(DEMO_ANALYSIS.recommendations!.length).toBeGreaterThan(0);
    expect(DEMO_ANALYSIS.product_recommendations!.length).toBeGreaterThan(0);
  });

  it('demo trials have required fields', () => {
    expect(DEMO_TRIALS.length).toBeGreaterThan(0);
    DEMO_TRIALS.forEach(trial => {
      expect(trial.nct_id).toBeTruthy();
      expect(trial.title).toBeTruthy();
      expect(trial.status).toBe('RECRUITING');
      expect(trial.conditions!.length).toBeGreaterThan(0);
    });
  });

  it('demo tourism destinations are valid', () => {
    expect(DEMO_TOURISM.length).toBeGreaterThan(0);
    DEMO_TOURISM.forEach(dest => {
      expect(dest.destination).toBeTruthy();
      expect(dest.quality_rating).toBeGreaterThan(0);
      expect(dest.specialties.length).toBeGreaterThan(0);
    });
  });

  it('demo eco metrics are valid', () => {
    expect(DEMO_ECO.eco_rating).toBe('Excellent');
    expect(DEMO_ECO.total_analyses).toBe(4);
    expect(DEMO_ECO.total_carbon_grams).toBeGreaterThan(0);
  });

  it('demo weather data is valid', () => {
    expect(DEMO_WEATHER.city).toBe('Denver');
    expect(DEMO_WEATHER.uv_index).toBeGreaterThanOrEqual(0);
    expect(DEMO_WEATHER.skin_advisory).toBeTruthy();
  });

  it('demo trends have chronological order', () => {
    for (let i = 1; i < DEMO_TRENDS.length; i++) {
      const prev = new Date(DEMO_TRENDS[i - 1].recorded_at).getTime();
      const curr = new Date(DEMO_TRENDS[i].recorded_at).getTime();
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it('demo subscription defaults to free tier', () => {
    expect(DEMO_SUBSCRIPTION.tier).toBe('free');
    expect(DEMO_SUBSCRIPTION.subscription_id).toBeNull();
  });
});

describe('Utility Functions', () => {
  it('getScoreColor returns correct Tailwind classes', () => {
    expect(getScoreColor(90)).toBe('text-forest-400');
    expect(getScoreColor(70)).toBe('text-forest-300');
    expect(getScoreColor(40)).toBe('text-gold-400');
    expect(getScoreColor(10)).toBe('text-ember-500');
  });

  it('getScoreLabel returns correct labels', () => {
    expect(getScoreLabel(90)).toBe('Excellent');
    expect(getScoreLabel(75)).toBe('Good');
    expect(getScoreLabel(55)).toBe('Moderate');
    expect(getScoreLabel(30)).toBe('Needs Attention');
    expect(getScoreLabel(10)).toBe('Critical');
  });

  it('formatDate handles ISO strings', () => {
    const result = formatDate('2025-02-10T14:30:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('truncate works correctly', () => {
    expect(truncate('Hello World', 20)).toBe('Hello World');
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });
});
