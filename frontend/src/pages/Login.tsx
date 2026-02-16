/**
 * Project Face — Login Page
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<any>;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal-50 mb-2">Welcome Back</h1>
          <p className="text-charcoal-400">Sign in to continue your skin journey</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-ember-500/10 border border-ember-500/20 text-ember-400 text-sm" role="alert">
                {error}
              </div>
            )}

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
                aria-describedby="email-desc"
              />
              <span id="email-desc" className="sr-only">Enter your registered email address</span>
            </div>

            <div className="mb-6">
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
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-900/50 border border-charcoal-700/50 text-charcoal-100 placeholder-charcoal-500 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-colors pr-12"
                  placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn size={20} aria-hidden="true" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-charcoal-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium">
              Create one free
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
