/**
 * Project Face — Registration Page
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface RegisterProps {
  onRegister: (email: string, password: string, full_name?: string) => Promise<any>;
}

export default function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await onRegister(email, password, fullName || undefined);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Create Account</h1>
          <p className="text-charcoal-400">Start your AI-powered skin journey</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-ember-500/10 border border-ember-500/20 text-ember-400 text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-charcoal-200 mb-2">
                Full Name <span className="text-charcoal-500">(optional)</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors pr-12"
                  placeholder="Min. 8 characters"
                  aria-describedby="password-req"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
              <p id="password-req" className="mt-1 text-xs text-charcoal-500">Must be at least 8 characters</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-200 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors"
                placeholder="Repeat your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <UserPlus size={20} aria-hidden="true" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-charcoal-400">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
