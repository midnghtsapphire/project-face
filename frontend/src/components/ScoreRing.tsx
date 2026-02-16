/**
 * Project Face — Score Ring Component
 * Circular progress indicator for skin scores.
 */
import React from 'react';
import { getScoreColor, getScoreLabel } from '../utils/helpers';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 120, strokeWidth = 8, label }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const colorClass = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  // Map color class to actual stroke color
  const strokeColor =
    score >= 80 ? '#5ea56c' :
    score >= 60 ? '#8ec298' :
    score >= 40 ? '#f1c232' :
    score >= 20 ? '#f07052' : '#e54d2e';

  return (
    <div className="flex flex-col items-center gap-2" role="img" aria-label={`${label || 'Score'}: ${score} out of 100, rated ${scoreLabel}`}>
      <svg width={size} height={size} className="transform -rotate-90" aria-hidden="true">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(232, 228, 222, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: size * 0.25 }}>
        <span className={`text-2xl font-bold ${colorClass}`}>{Math.round(score)}</span>
        <span className="text-xs text-charcoal-400">{scoreLabel}</span>
      </div>
      {label && (
        <span className="text-sm text-charcoal-300 font-medium">{label}</span>
      )}
    </div>
  );
}
