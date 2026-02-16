/**
 * Project Face — Premium Subscription Page
 */
import React from 'react';
import { Crown, Check, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '3 skin analyses per month',
      'Basic skin health score',
      'General recommendations',
      'Weather-based advisory',
      'Carbon tracking',
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited skin analyses',
      'Detailed condition detection',
      'Personalized product recommendations',
      'Clinical trials finder',
      'Medical tourism recommendations',
      'Before/after tracking with trends',
      'Priority AI processing',
      'Export reports as PDF',
    ],
    cta: 'Upgrade to Premium',
    highlighted: true,
  },
  {
    name: 'Professional',
    price: '$24.99',
    period: '/month',
    features: [
      'Everything in Premium',
      'API access for integrations',
      'Bulk analysis uploads',
      'Custom branding for clinics',
      'Team management (up to 10)',
      'Advanced analytics dashboard',
      'Dedicated support',
      'Early access to new features',
    ],
    cta: 'Go Professional',
    highlighted: false,
  },
];

export default function Premium() {
  const handleSubscribe = (planName: string) => {
    // In production, this would create a Stripe checkout session
    alert(`Stripe checkout for ${planName} plan would open here. Configure STRIPE_SECRET_KEY in .env to enable.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-400 text-sm font-medium mb-4">
          <Crown size={16} aria-hidden="true" />
          <span>Upgrade Your Skin Journey</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-50 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-charcoal-400 max-w-xl mx-auto">
          Unlock the full power of AI skin analysis with premium features designed for your skin health goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <GlassCard
            key={plan.name}
            className={`relative ${plan.highlighted ? 'border-gold-500/30 ring-1 ring-gold-500/20' : ''}`}
            ariaLabel={`${plan.name} plan: ${plan.price} ${plan.period}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold-500 text-charcoal-950 text-xs font-bold">
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-semibold text-charcoal-100 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-charcoal-50">{plan.price}</span>
                <span className="text-charcoal-400 text-sm">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal-300">
                  <Check size={18} className="text-forest-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                plan.highlighted
                  ? 'btn-gold'
                  : plan.name === 'Free'
                  ? 'bg-charcoal-800/50 text-charcoal-400 cursor-default'
                  : 'btn-secondary'
              }`}
              disabled={plan.name === 'Free'}
            >
              {plan.name === 'Free' ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} aria-hidden="true" /> Current Plan
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap size={18} aria-hidden="true" /> {plan.cta}
                </span>
              )}
            </button>
          </GlassCard>
        ))}
      </div>

      <div className="text-center mt-8 text-sm text-charcoal-500">
        <p>Powered by Stripe. Cancel anytime. All plans include a 7-day free trial.</p>
      </div>
    </div>
  );
}
