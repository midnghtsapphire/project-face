/**
 * Project Face — Skin Analysis Page
 * Camera/upload interface with results display.
 */
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { analysisAPI } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { getScoreColor, getScoreLabel } from '../utils/helpers';
import type { SkinAnalysis } from '../types';

export default function Analyze() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinAnalysis | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { position, requestLocation } = useGeolocation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    if (position) {
      formData.append('latitude', position.latitude.toString());
      formData.append('longitude', position.longitude.toString());
    }

    try {
      const { data } = await analysisAPI.analyze(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Skin Analysis</h1>
        <p className="text-charcoal-400">Upload a clear selfie for AI-powered skin assessment</p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {/* Upload Area */}
          <GlassCard ariaLabel="Photo upload area">
            <div
              className="border-2 border-dashed border-charcoal-700/50 rounded-xl p-8 text-center cursor-pointer hover:border-gold-500/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Click to upload a selfie photo, or drag and drop"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Select photo file"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview of selected selfie for skin analysis"
                    className="max-h-64 mx-auto rounded-xl object-cover"
                  />
                  <p className="text-sm text-charcoal-300">{selectedFile?.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetAnalysis(); }}
                    className="text-sm text-ember-400 hover:text-ember-300"
                  >
                    Choose different photo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-charcoal-800/50 flex items-center justify-center" aria-hidden="true">
                    <Upload size={32} className="text-charcoal-400" />
                  </div>
                  <div>
                    <p className="text-charcoal-200 font-medium">Upload a selfie</p>
                    <p className="text-sm text-charcoal-400 mt-1">
                      JPEG, PNG, or WebP — max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* GPS Toggle */}
          <GlassCard ariaLabel="Location settings for weather-based recommendations">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-charcoal-200">Location-aware analysis</p>
                <p className="text-sm text-charcoal-400">
                  {position
                    ? 'Location enabled — weather data will enhance your results'
                    : 'Enable location for weather-personalized recommendations'}
                </p>
              </div>
              <button
                onClick={requestLocation}
                className={`btn-secondary text-sm py-2 px-4 ${position ? 'bg-forest-500/20 text-forest-400 border-forest-500/30' : ''}`}
              >
                {position ? 'Enabled' : 'Enable'}
              </button>
            </div>
          </GlassCard>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-ember-500/10 border border-ember-500/20 flex items-center gap-3" role="alert">
              <AlertTriangle size={20} className="text-ember-400 flex-shrink-0" aria-hidden="true" />
              <p className="text-ember-400 text-sm">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || analyzing}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader size={24} className="animate-spin" aria-hidden="true" />
                <span>Analyzing your skin...</span>
              </>
            ) : (
              <>
                <Camera size={24} aria-hidden="true" />
                <span>Analyze My Skin</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-forest-400">
              <CheckCircle size={24} aria-hidden="true" />
              <span className="font-medium">Analysis Complete</span>
            </div>
            <button onClick={resetAnalysis} className="btn-secondary text-sm py-2 px-4">
              New Analysis
            </button>
          </div>

          {/* Overall Score */}
          <GlassCard className="text-center" ariaLabel="Overall skin health score">
            <h2 className="font-display text-2xl font-semibold text-charcoal-100 mb-4">Overall Skin Health</h2>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.overall_score ?? 0)}`}>
              {Math.round(result.overall_score ?? 0)}
            </div>
            <p className="text-charcoal-300 text-lg">{getScoreLabel(result.overall_score ?? 0)}</p>
            <p className="text-sm text-charcoal-400 mt-2">
              Skin Type: <span className="capitalize font-medium text-charcoal-200">{result.skin_type}</span>
              {' | '}
              Confidence: <span className="font-medium text-charcoal-200">{Math.round((result.confidence_score ?? 0) * 100)}%</span>
            </p>
          </GlassCard>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Hydration', value: result.hydration_level },
              { label: 'Texture', value: result.texture_score },
              { label: 'Sun Damage', value: result.sun_damage_score },
              { label: 'Acne', value: result.acne_severity ? result.acne_severity * 10 : 0 },
              { label: 'Wrinkles', value: result.wrinkle_score },
              { label: 'Pigmentation', value: result.pigmentation_score },
              { label: 'Redness', value: result.redness_score },
              { label: 'Pore Size', value: result.pore_size_score },
            ].map((item, i) => (
              <GlassCard key={i} className="text-center p-4">
                <p className="text-xs text-charcoal-400 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${getScoreColor(100 - (item.value ?? 0))}`}>
                  {Math.round(item.value ?? 0)}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Conditions */}
          {result.conditions_detected && result.conditions_detected.length > 0 && (
            <GlassCard ariaLabel="Detected skin conditions">
              <h3 className="font-display text-xl font-semibold text-charcoal-100 mb-4">Conditions Detected</h3>
              <div className="space-y-3">
                {result.conditions_detected.map((condition, i) => (
                  <div key={i} className="glass-panel-light p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-charcoal-100">{condition.name}</span>
                      <span className="text-sm text-charcoal-400">
                        Severity: {condition.severity}/10 | Confidence: {Math.round(condition.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-charcoal-300">{condition.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <GlassCard ariaLabel="Skincare recommendations">
              <h3 className="font-display text-xl font-semibold text-charcoal-100 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-charcoal-300">
                    <span className="w-6 h-6 rounded-full bg-forest-500/20 text-forest-400 flex items-center justify-center flex-shrink-0 text-xs font-bold" aria-hidden="true">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Product Recommendations */}
          {result.product_recommendations && result.product_recommendations.length > 0 && (
            <GlassCard ariaLabel="Product recommendations">
              <h3 className="font-display text-xl font-semibold text-charcoal-100 mb-4">Recommended Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.product_recommendations.map((product, i) => (
                  <div key={i} className="glass-panel-light p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-charcoal-100">{product.name}</span>
                      <span className="text-xs text-gold-400 font-medium">{product.price_range}</span>
                    </div>
                    {product.brand && (
                      <p className="text-xs text-charcoal-400 mb-1">{product.brand} — {product.category}</p>
                    )}
                    {product.reason && (
                      <p className="text-sm text-charcoal-300">{product.reason}</p>
                    )}
                    {product.affiliate_url && (
                      <a
                        href={product.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-gold-400 hover:text-gold-300 font-medium"
                      >
                        View Product →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Carbon Cost */}
          {result.carbon_cost_grams !== null && (
            <div className="text-center text-xs text-charcoal-500 flex items-center justify-center gap-1">
              <Leaf size={14} aria-hidden="true" />
              <span>This analysis used approximately {result.carbon_cost_grams?.toFixed(3)}g CO₂</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
