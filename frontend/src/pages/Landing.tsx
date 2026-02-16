/**
 * Project Face — Landing Page
 * Hero section with warm earthy theme and glassmorphism.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Shield, Globe, Leaf, TrendingUp, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const features = [
  {
    icon: Camera,
    title: 'AI Skin Analysis',
    description: 'Upload a selfie and receive a comprehensive AI-powered skin health assessment covering texture, hydration, sun damage, and more.',
  },
  {
    icon: Globe,
    title: 'GPS Personalization',
    description: 'Your local weather, UV index, and humidity are factored into personalized skincare recommendations.',
  },
  {
    icon: Shield,
    title: 'Clinical Trials Finder',
    description: 'Discover relevant dermatology clinical trials near you through our ClinicalTrials.gov integration.',
  },
  {
    icon: TrendingUp,
    title: 'Before & After Tracking',
    description: 'Track your skin health journey over time with detailed trend analysis and progress visualization.',
  },
  {
    icon: Sparkles,
    title: 'Product Recommendations',
    description: 'Get evidence-based product recommendations tailored to your specific skin conditions and environment.',
  },
  {
    icon: Leaf,
    title: 'Carbon Efficient',
    description: 'We track the carbon footprint of every analysis. Sustainable AI for a healthier planet and healthier skin.',
  },
];

export default function Landing() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4" aria-label="Hero section">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ember-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-400 text-sm font-medium mb-8">
            <Leaf size={16} aria-hidden="true" />
            <span>Carbon-efficient AI skincare</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-charcoal-50 mb-6 leading-tight">
            Your Skin,{' '}
            <span className="bg-gradient-to-r from-ember-400 via-gold-400 to-forest-400 bg-clip-text text-transparent">
              Understood
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-charcoal-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered skin analysis that adapts to your environment. Get personalized
            recommendations, track your progress, and discover clinical trials — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto text-center">
              Start Free Analysis
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto text-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" aria-label="Features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-50 mb-4">
              Everything Your Skin Needs
            </h2>
            <p className="text-charcoal-400 max-w-xl mx-auto">
              Comprehensive skin intelligence powered by AI, personalized to your location and lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500/20 to-gold-500/20 flex items-center justify-center mb-4" aria-hidden="true">
                    <Icon size={24} className="text-gold-400" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" aria-label="Call to action">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="text-center p-12">
            <h2 className="font-display text-3xl font-bold text-charcoal-50 mb-4">
              Ready to Know Your Skin?
            </h2>
            <p className="text-charcoal-300 mb-8 max-w-lg mx-auto">
              Join thousands who trust Project Face for their skincare journey.
              Free tier available — no credit card required.
            </p>
            <Link to="/register" className="btn-gold text-lg px-8 py-4 inline-block">
              Get Started Free
            </Link>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
