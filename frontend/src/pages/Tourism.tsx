/**
 * Project Face — Medical Tourism Page
 */
import React, { useState } from 'react';
import { Globe, Star, MapPin, Loader, Plane } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { tourismAPI } from '../services/api';
import type { MedicalTourismDest } from '../types';

export default function Tourism() {
  const [condition, setCondition] = useState('');
  const [region, setRegion] = useState('');
  const [results, setResults] = useState<MedicalTourismDest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await tourismAPI.getRecommendations(condition, undefined, region || undefined);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Medical Tourism</h1>
        <p className="text-charcoal-400">
          Discover world-class dermatology destinations for your skin condition
        </p>
      </div>

      {/* Search */}
      <GlassCard className="mb-8" ariaLabel="Medical tourism search">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="mt-condition" className="block text-sm font-medium text-charcoal-200 mb-2">
              Skin Condition
            </label>
            <input
              id="mt-condition"
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., acne scars, psoriasis, anti-aging"
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="mt-region" className="block text-sm font-medium text-charcoal-200 mb-2">
              Preferred Region <span className="text-charcoal-500">(optional)</span>
            </label>
            <input
              id="mt-region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g., Asia, Europe, South America"
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 py-3">
              {loading ? <Loader size={20} className="animate-spin" aria-hidden="true" /> : <Globe size={20} aria-hidden="true" />}
              <span>Search</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-charcoal-400">
          <Loader size={32} className="animate-spin mx-auto mb-4" aria-hidden="true" />
          <p>Finding destinations...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((dest, i) => (
            <GlassCard key={i} ariaLabel={`Medical tourism destination: ${dest.destination}`}>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Plane size={20} className="text-gold-400" aria-hidden="true" />
                    <h3 className="font-display text-xl font-semibold text-charcoal-100">
                      {dest.destination}
                    </h3>
                  </div>
                  <p className="text-sm text-charcoal-300 mb-4">{dest.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dest.specialties.map((s, j) => (
                      <span key={j} className="px-2 py-1 rounded-full bg-ember-500/10 text-ember-400 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-charcoal-400">Estimated Cost</p>
                      <p className="font-semibold text-gold-400">{dest.estimated_cost_range}</p>
                    </div>
                    <div>
                      <p className="text-charcoal-400">Quality Rating</p>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-gold-400 fill-gold-400" aria-hidden="true" />
                        <span className="font-semibold text-charcoal-100">{dest.quality_rating}/10</span>
                      </div>
                    </div>
                  </div>

                  {dest.facilities.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-charcoal-400 mb-1">Top Facilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {dest.facilities.map((f, k) => (
                          <span key={k} className="flex items-center gap-1 text-xs text-charcoal-300">
                            <MapPin size={12} aria-hidden="true" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dest.travel_advisory && (
                    <div className="mt-4 p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                      <p className="text-xs text-gold-300">{dest.travel_advisory}</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
