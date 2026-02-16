/**
 * Project Face — Settings Page
 */
import React, { useState } from 'react';
import { Settings, MapPin, Save } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { authAPI } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import type { User } from '../types';

interface SettingsProps {
  user: User;
  onUpdate: () => void;
}

export default function SettingsPage({ user, onUpdate }: SettingsProps) {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { position, requestLocation, loading: geoLoading } = useGeolocation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await authAPI.updateMe({
        full_name: fullName,
        latitude: position?.latitude ?? user.latitude,
        longitude: position?.longitude ?? user.longitude,
      } as any);
      setMessage('Settings saved successfully!');
      onUpdate();
    } catch {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Settings</h1>
        <p className="text-charcoal-400">Manage your account and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <GlassCard ariaLabel="Profile settings">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={20} className="text-gold-400" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-charcoal-100">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900/30 border border-charcoal-700/30 text-charcoal-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-charcoal-200 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-200 mb-2">
                Subscription
              </label>
              <p className="text-charcoal-300 capitalize">{user.subscription_tier} Plan</p>
            </div>
          </div>
        </GlassCard>

        {/* Location */}
        <GlassCard ariaLabel="Location settings">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={20} className="text-forest-400" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-charcoal-100">Location</h2>
          </div>

          <p className="text-sm text-charcoal-400 mb-4">
            Your location is used for weather-based skin recommendations. It is never shared.
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={requestLocation}
              disabled={geoLoading}
              className="btn-secondary text-sm py-2 px-4"
            >
              {geoLoading ? 'Detecting...' : position ? 'Location Updated' : 'Detect My Location'}
            </button>
            {(position || user.latitude) && (
              <span className="text-xs text-charcoal-400">
                {(position?.latitude ?? user.latitude)?.toFixed(4)}, {(position?.longitude ?? user.longitude)?.toFixed(4)}
              </span>
            )}
          </div>
        </GlassCard>

        {/* Save */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-forest-500/10 text-forest-400' : 'bg-ember-500/10 text-ember-400'}`} role="status">
            {message}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={20} aria-hidden="true" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
}
