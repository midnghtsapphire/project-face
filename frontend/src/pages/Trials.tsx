/**
 * Project Face — Clinical Trials Finder Page
 */
import React, { useState } from 'react';
import { Search, ExternalLink, MapPin, Loader } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { trialsAPI } from '../services/api';
import type { ClinicalTrial } from '../types';

export default function Trials() {
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<ClinicalTrial[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await trialsAPI.search(
        condition,
        location || undefined,
        'RECRUITING',
        15
      );
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
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Clinical Trials Finder</h1>
        <p className="text-charcoal-400">
          Search ClinicalTrials.gov for active dermatology studies near you
        </p>
      </div>

      {/* Search Form */}
      <GlassCard className="mb-8" ariaLabel="Clinical trials search form">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="condition" className="block text-sm font-medium text-charcoal-200 mb-2">
              Skin Condition
            </label>
            <input
              id="condition"
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., acne, psoriasis, eczema, melanoma"
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-charcoal-200 mb-2">
              Location <span className="text-charcoal-500">(optional)</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Colorado, New York, California"
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 py-3"
            >
              {loading ? (
                <Loader size={20} className="animate-spin" aria-hidden="true" />
              ) : (
                <Search size={20} aria-hidden="true" />
              )}
              <span>Search</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-charcoal-400">
          <Loader size={32} className="animate-spin mx-auto mb-4" aria-hidden="true" />
          <p>Searching ClinicalTrials.gov...</p>
        </div>
      ) : searched && results.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-charcoal-400">No recruiting trials found for &quot;{condition}&quot;. Try a different search term.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {results.length > 0 && (
            <p className="text-sm text-charcoal-400 mb-2">{results.length} trial(s) found</p>
          )}
          {results.map((trial) => (
            <GlassCard key={trial.nct_id} ariaLabel={`Clinical trial: ${trial.title}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-forest-500/20 text-forest-400 text-xs font-medium">
                      {trial.status}
                    </span>
                    <span className="text-xs text-charcoal-500">{trial.nct_id}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-charcoal-100 mb-2">
                    {trial.title}
                  </h3>
                  {trial.summary && (
                    <p className="text-sm text-charcoal-300 mb-3 line-clamp-3">
                      {trial.summary}
                    </p>
                  )}
                  {trial.conditions && trial.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {trial.conditions.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {trial.locations && trial.locations.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-charcoal-400">
                      <MapPin size={14} aria-hidden="true" />
                      <span>
                        {trial.locations.slice(0, 3).map((l) =>
                          [l.city, l.state, l.country].filter(Boolean).join(', ')
                        ).join(' | ')}
                      </span>
                    </div>
                  )}
                </div>
                {trial.url && (
                  <a
                    href={trial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 rounded-lg text-gold-400 hover:bg-gold-500/10 transition-colors"
                    aria-label={`View trial ${trial.nct_id} on ClinicalTrials.gov (opens in new tab)`}
                  >
                    <ExternalLink size={20} aria-hidden="true" />
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
