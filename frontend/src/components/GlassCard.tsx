/**
 * Project Face — Glassmorphism Card Component
 * Reusable frosted glass panel with WCAG AAA compliance.
 */
import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className,
  as: Component = 'div',
  role,
  ariaLabel,
  ariaLabelledBy,
  style,
}: GlassCardProps) {
  return (
    <Component
      className={clsx('glass-card p-6', className)}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      style={style}
    >
      {children}
    </Component>
  );
}
