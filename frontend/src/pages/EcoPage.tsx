/**
 * Project Face — Eco Metrics Page
 * Carbon efficiency tracking and sustainability dashboard.
 */
import React, { useEffect, useState } from 'react';
import { Leaf, TreePine, Zap, BarChart3 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ecoAPI } from '../services/api';
import type { EcoMetrics } from '../types';

export default function EcoPage() {
  const [metrics, setMetrics] = useState<EcoMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ecoAPI.getMetrics()
      .then(res => setMetrics(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'text-forest-400';
      case 'Good': return 'text-forest-300';
      case 'Moderate': return 'text-gold-400';
      default: return 'text-ember-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Eco Impact</h1>
        <p className="text-charcoal-400">
          Track the carbon footprint of your AI skin analyses. We believe in sustainable technology.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-charcoal-400">Loading eco metrics...</div>
      ) : metrics ? (
        <div className="space-y-6">
          {/* Rating */}
          <GlassCard className="text-center" ariaLabel="Eco efficiency rating">
            <Leaf size={48} className="mx-auto text-forest-400 mb-4" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold text-charcoal-100 mb-2">
              Your Eco Rating
            </h2>
            <div className={`text-4xl font-bold ${getRatingColor(metrics.eco_rating)}`}>
              {metrics.eco_rating}
            </div>
            <p className="text-sm text-charcoal-400 mt-2">
              Based on average carbon cost per analysis
            </p>
          </GlassCard>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="text-center" ariaLabel="Total carbon dioxide used">
              <Zap size={24} className="mx-auto text-gold-400 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-charcoal-100">
                {metrics.total_carbon_grams.toFixed(2)}g
              </p>
              <p className="text-xs text-charcoal-400">Total CO₂</p>
            </GlassCard>

            <GlassCard className="text-center" ariaLabel="Total analyses performed">
              <BarChart3 size={24} className="mx-auto text-ember-400 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-charcoal-100">
                {metrics.total_analyses}
              </p>
              <p className="text-xs text-charcoal-400">Total Analyses</p>
            </GlassCard>

            <GlassCard className="text-center" ariaLabel="Average carbon per analysis">
              <Leaf size={24} className="mx-auto text-forest-400 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-charcoal-100">
                {metrics.avg_carbon_per_analysis.toFixed(3)}g
              </p>
              <p className="text-xs text-charcoal-400">Avg CO₂/Analysis</p>
            </GlassCard>

            <GlassCard className="text-center" ariaLabel="Trees equivalent">
              <TreePine size={24} className="mx-auto text-forest-400 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-charcoal-100">
                {metrics.trees_equivalent.toFixed(6)}
              </p>
              <p className="text-xs text-charcoal-400">Trees Equivalent</p>
            </GlassCard>
          </div>

          {/* Info */}
          <GlassCard ariaLabel="About our carbon tracking">
            <h3 className="font-display text-lg font-semibold text-charcoal-100 mb-3">
              How We Track Carbon
            </h3>
            <div className="space-y-3 text-sm text-charcoal-300">
              <p>
                Every AI analysis requires computational resources that consume energy.
                We estimate the carbon footprint of each API call based on processing time
                and model complexity.
              </p>
              <p>
                Our goal is to minimize environmental impact while delivering accurate skin analysis.
                We use efficient models, cache results where possible, and continuously optimize
                our inference pipeline.
              </p>
              <p>
                One mature tree absorbs approximately 22kg of CO₂ per year. The &quot;Trees Equivalent&quot;
                metric shows how your total usage compares to a tree&apos;s annual absorption capacity.
              </p>
            </div>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="text-center py-12">
          <p className="text-charcoal-400">Unable to load eco metrics. Start an analysis to begin tracking!</p>
        </GlassCard>
      )}
    </div>
  );
}
