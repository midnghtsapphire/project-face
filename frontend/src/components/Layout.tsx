/**
 * Project Face — Main Layout Component
 * Glassmorphism navigation + footer with GlowStarLabs branding
 */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Camera, History, Search, Globe, Leaf,
  Crown, Settings, LogOut, Menu, X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
  userName?: string | null;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, ariaLabel: 'Go to dashboard' },
  { path: '/analyze', label: 'Analyze', icon: Camera, ariaLabel: 'Start skin analysis' },
  { path: '/history', label: 'History', icon: History, ariaLabel: 'View analysis history' },
  { path: '/trials', label: 'Trials', icon: Search, ariaLabel: 'Search clinical trials' },
  { path: '/tourism', label: 'Tourism', icon: Globe, ariaLabel: 'Medical tourism recommendations' },
  { path: '/eco', label: 'Eco', icon: Leaf, ariaLabel: 'View eco metrics' },
];

export default function Layout({ children, isAuthenticated, onLogout, userName }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content — WCAG AAA */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b border-charcoal-800/50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="flex items-center gap-3 group"
              aria-label="Project Face home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 via-gold-500 to-forest-500 flex items-center justify-center font-display font-bold text-charcoal-950 text-lg" aria-hidden="true">
                PF
              </div>
              <div>
                <span className="text-lg font-display font-semibold text-charcoal-100 group-hover:text-gold-400 transition-colors">
                  Project Face
                </span>
                <span className="hidden sm:block text-xs text-charcoal-400">by GlowStarLabs</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-ember-500/20 text-ember-400'
                          : 'text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/50'
                      }`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/premium"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 text-sm font-medium hover:bg-gold-500/30 transition-colors"
                    aria-label="Upgrade to premium"
                  >
                    <Crown size={16} aria-hidden="true" />
                    <span>Premium</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="p-2 rounded-lg text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800/50 transition-colors"
                    aria-label="Settings"
                  >
                    <Settings size={20} aria-hidden="true" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-charcoal-400 hover:text-ember-400 hover:bg-charcoal-800/50 transition-colors"
                    aria-label="Log out"
                  >
                    <LogOut size={20} aria-hidden="true" />
                  </button>
                  {/* Mobile menu toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-charcoal-400 hover:text-charcoal-100"
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                  >
                    {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isAuthenticated && mobileMenuOpen && (
          <nav
            className="md:hidden border-t border-charcoal-800/50 py-2 px-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ember-500/20 text-ember-400'
                      : 'text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/50'
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800/30 py-8 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-charcoal-100 mb-3">Project Face</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">
                AI-powered skin analysis for everyone. Part of the GlowStarLabs ecosystem.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-charcoal-100 mb-3">Ecosystem</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://rvvel.com" target="_blank" rel="noopener noreferrer" className="text-charcoal-400 hover:text-gold-400 transition-colors">
                    Rvvel Hub
                  </a>
                </li>
                <li>
                  <a href="https://audreyevansofficial.com" target="_blank" rel="noopener noreferrer" className="text-charcoal-400 hover:text-gold-400 transition-colors">
                    Audrey Evans Official
                  </a>
                </li>
                <li>
                  <a href="https://glowstarlabs.com" target="_blank" rel="noopener noreferrer" className="text-charcoal-400 hover:text-gold-400 transition-colors">
                    GlowStarLabs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-charcoal-100 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-charcoal-400 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-charcoal-400 hover:text-gold-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/accessibility" className="text-charcoal-400 hover:text-gold-400 transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-charcoal-800/30 pt-6 text-center text-xs text-charcoal-500">
            <p>&copy; {new Date().getFullYear()} GlowStarLabs / Audrey Evans. All rights reserved.</p>
            <p className="mt-1">Built with care for accessibility, sustainability, and your skin.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
