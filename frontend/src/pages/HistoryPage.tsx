/**
 * Project Face — Analysis History & Trends Page
 * Before/after tracking over time with charts.
 */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { analysisAPI } from '../services/api';
import { formatDate, getScoreColor, getScoreLabel } from '../utils/helpers';
import type { SkinAnalysis, AnalysisHistory } from '../types';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([]);
  const [trends, setTrends] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [historyRes, trendsRes] = await Promise.all([
        analysisAPI.getHistory(50, 0),
        analysisAPI.getTrends(),
      ]);
      setAnalyses(historyRes.data);
      setTrends(trendsRes.data);
    } catch {
      // Graceful degradation
    } finally {
      setLoading(false);
    }
  };

  const chartData = trends.map((t) => ({
    date: formatDate(t.recorded_at),
    'Overall Score': t.overall_score ?? 0,
    'Hydration': t.hydration_level ?? 0,
    'Texture': t.texture_score ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Analysis History</h1>
        <p className="text-charcoal-400">Track your skin health journey over time</p>
      </div>

      {/* Trends Chart */}
      {chartData.length > 1 && (
        <GlassCard className="mb-8" ariaLabel="Skin health trends chart">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-gold-400" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-charcoal-100">Trends Over Time</h2>
          </div>
          <div className="h-72" role="img" aria-label="Line chart showing skin health score trends over time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,228,222,0.06)" />
                <XAxis dataKey="date" stroke="#9a8a73" fontSize={12} />
                <YAxis stroke="#9a8a73" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30,27,24,0.9)',
                    border: '1px solid rgba(232,228,222,0.1)',
                    borderRadius: '12px',
                    color: '#e8e4de',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Overall Score" stroke="#f1c232" strokeWidth={2} dot={{ fill: '#f1c232' }} />
                <Line type="monotone" dataKey="Hydration" stroke="#5ea56c" strokeWidth={2} dot={{ fill: '#5ea56c' }} />
                <Line type="monotone" dataKey="Texture" stroke="#e54d2e" strokeWidth={2} dot={{ fill: '#e54d2e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* History List */}
      <GlassCard ariaLabel="Analysis history list">
        <h2 className="font-display text-xl font-semibold text-charcoal-100 mb-6">All Analyses</h2>

        {loading ? (
          <div className="text-center py-12 text-charcoal-400">Loading history...</div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-12 text-charcoal-400">
            <Calendar size={48} className="mx-auto mb-4 text-charcoal-600" aria-hidden="true" />
            <p>No analyses yet. Start by uploading a selfie!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis) => {
              const score = analysis.overall_score ?? 0;
              return (
                <div
                  key={analysis.id}
                  className="glass-panel-light p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${getScoreColor(score)} w-12 text-center`}>
                      {Math.round(score)}
                    </div>
                    <div>
                      <p className="text-charcoal-200 font-medium capitalize">
                        {analysis.skin_type || 'Unknown'} Skin
                      </p>
                      <p className="text-xs text-charcoal-400">
                        {formatDate(analysis.created_at)} — {getScoreLabel(score)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-charcoal-300">
                      Hydration: {Math.round(analysis.hydration_level ?? 0)} |
                      Texture: {Math.round(analysis.texture_score ?? 0)}
                    </p>
                    {analysis.conditions_detected && (
                      <p className="text-xs text-charcoal-400">
                        {analysis.conditions_detected.length} condition(s) detected
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
