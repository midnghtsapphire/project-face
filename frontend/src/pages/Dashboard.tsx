/**
 * Project Face — Dashboard Page
 * Overview of skin health, recent analyses, weather, and eco metrics.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, TrendingUp, Droplets, Sun, Wind,
  Leaf, ArrowRight, Thermometer
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { getScoreColor, getScoreLabel, formatDate } from '../utils/helpers';
import { analysisAPI, weatherAPI, ecoAPI } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import type { SkinAnalysis, WeatherData, EcoMetrics, User } from '../types';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [latestAnalysis, setLatestAnalysis] = useState<SkinAnalysis | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [eco, setEco] = useState<EcoMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { position, requestLocation } = useGeolocation();

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (position) {
      weatherAPI.getCurrent(position.latitude, position.longitude)
        .then(res => setWeather(res.data))
        .catch(() => {});
    }
  }, [position]);

  const loadDashboard = async () => {
    setLoading(false);
    try {
      const [historyRes, ecoRes] = await Promise.all([
        analysisAPI.getHistory(1, 0).catch(() => ({ data: [] })),
        ecoAPI.getMetrics().catch(() => ({ data: null })),
      ]);

      if (historyRes.data.length > 0) {
        setLatestAnalysis(historyRes.data[0]);
      }
      if (ecoRes.data) {
        setEco(ecoRes.data);
      }

      requestLocation();
    } catch {
      // Graceful degradation
    }
  };

  const score = latestAnalysis?.overall_score ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">
          Welcome back{user.full_name ? `, ${user.full_name}` : ''}
        </h1>
        <p className="text-charcoal-400">Here&apos;s your skin health overview</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/analyze" className="glass-card p-5 flex items-center gap-4 group hover:border-ember-500/30">
          <div className="w-12 h-12 rounded-xl bg-ember-500/20 flex items-center justify-center" aria-hidden="true">
            <Camera size={24} className="text-ember-400" />
          </div>
          <div>
            <p className="font-semibold text-charcoal-100 group-hover:text-ember-400 transition-colors">New Analysis</p>
            <p className="text-xs text-charcoal-400">Scan your skin now</p>
          </div>
        </Link>

        <Link to="/history" className="glass-card p-5 flex items-center gap-4 group hover:border-forest-500/30">
          <div className="w-12 h-12 rounded-xl bg-forest-500/20 flex items-center justify-center" aria-hidden="true">
            <TrendingUp size={24} className="text-forest-400" />
          </div>
          <div>
            <p className="font-semibold text-charcoal-100 group-hover:text-forest-400 transition-colors">View Trends</p>
            <p className="text-xs text-charcoal-400">Track your progress</p>
          </div>
        </Link>

        <Link to="/trials" className="glass-card p-5 flex items-center gap-4 group hover:border-gold-500/30">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center" aria-hidden="true">
            <Sun size={24} className="text-gold-400" />
          </div>
          <div>
            <p className="font-semibold text-charcoal-100 group-hover:text-gold-400 transition-colors">Clinical Trials</p>
            <p className="text-xs text-charcoal-400">Find studies near you</p>
          </div>
        </Link>

        <Link to="/eco" className="glass-card p-5 flex items-center gap-4 group hover:border-forest-500/30">
          <div className="w-12 h-12 rounded-xl bg-forest-500/20 flex items-center justify-center" aria-hidden="true">
            <Leaf size={24} className="text-forest-400" />
          </div>
          <div>
            <p className="font-semibold text-charcoal-100 group-hover:text-forest-400 transition-colors">Eco Impact</p>
            <p className="text-xs text-charcoal-400">{eco ? eco.eco_rating : 'View metrics'}</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Analysis */}
        <GlassCard className="lg:col-span-2" ariaLabel="Latest skin analysis results">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-charcoal-100">Latest Analysis</h2>
            {latestAnalysis && (
              <span className="text-sm text-charcoal-400">{formatDate(latestAnalysis.created_at)}</span>
            )}
          </div>

          {latestAnalysis ? (
            <div>
              {/* Overall Score */}
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                    {Math.round(score)}
                  </div>
                  <div className="text-sm text-charcoal-400 mt-1">{getScoreLabel(score)}</div>
                </div>
                <div className="flex-1">
                  <p className="text-charcoal-300 text-sm mb-2">
                    Skin Type: <span className="text-charcoal-100 font-medium capitalize">{latestAnalysis.skin_type}</span>
                  </p>
                  <p className="text-charcoal-300 text-sm">
                    Confidence: <span className="text-charcoal-100 font-medium">{Math.round((latestAnalysis.confidence_score ?? 0) * 100)}%</span>
                  </p>
                </div>
              </div>

              {/* Score Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Hydration', value: latestAnalysis.hydration_level, icon: Droplets },
                  { label: 'Texture', value: latestAnalysis.texture_score },
                  { label: 'Sun Damage', value: latestAnalysis.sun_damage_score, invert: true },
                  { label: 'Redness', value: latestAnalysis.redness_score, invert: true },
                ].map((item, i) => {
                  const val = item.value ?? 0;
                  const displayScore = item.invert ? 100 - val : val;
                  return (
                    <div key={i} className="glass-panel-light p-3 rounded-xl text-center">
                      <p className="text-xs text-charcoal-400 mb-1">{item.label}</p>
                      <p className={`text-lg font-bold ${getScoreColor(displayScore)}`}>
                        {Math.round(val)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link to="/history" className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium">
                View full history <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera size={48} className="mx-auto text-charcoal-600 mb-4" aria-hidden="true" />
              <p className="text-charcoal-400 mb-4">No analyses yet. Start your skin journey!</p>
              <Link to="/analyze" className="btn-primary inline-flex items-center gap-2">
                <Camera size={20} aria-hidden="true" />
                Take Your First Scan
              </Link>
            </div>
          )}
        </GlassCard>

        {/* Weather & Environment */}
        <div className="space-y-6">
          <GlassCard ariaLabel="Current weather and skin advisory">
            <h2 className="font-display text-xl font-semibold text-charcoal-100 mb-4">Environment</h2>
            {weather ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Thermometer size={20} className="text-ember-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-charcoal-400">Temperature</p>
                    <p className="text-lg font-semibold text-charcoal-100">{weather.temperature}°F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets size={20} className="text-forest-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-charcoal-400">Humidity</p>
                    <p className="text-lg font-semibold text-charcoal-100">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sun size={20} className="text-gold-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-charcoal-400">UV Index</p>
                    <p className="text-lg font-semibold text-charcoal-100">{weather.uv_index}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind size={20} className="text-charcoal-300" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-charcoal-400">Wind</p>
                    <p className="text-lg font-semibold text-charcoal-100">{weather.wind_speed} mph</p>
                  </div>
                </div>
                {weather.skin_advisory && (
                  <div className="mt-4 p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                    <p className="text-sm text-gold-300 font-medium">Skin Advisory</p>
                    <p className="text-xs text-charcoal-300 mt-1">{weather.skin_advisory}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-charcoal-400 text-sm mb-3">Enable location for weather-based skin advice</p>
                <button onClick={requestLocation} className="btn-secondary text-sm py-2 px-4">
                  Enable Location
                </button>
              </div>
            )}
          </GlassCard>

          {/* Eco Summary */}
          {eco && (
            <GlassCard ariaLabel="Carbon efficiency metrics">
              <h2 className="font-display text-xl font-semibold text-charcoal-100 mb-4">Eco Impact</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-charcoal-400">Rating</span>
                  <span className="text-sm font-semibold text-forest-400">{eco.eco_rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-charcoal-400">Total CO₂</span>
                  <span className="text-sm font-semibold text-charcoal-200">{eco.total_carbon_grams.toFixed(2)}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-charcoal-400">Analyses</span>
                  <span className="text-sm font-semibold text-charcoal-200">{eco.total_analyses}</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
