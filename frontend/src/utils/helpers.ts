/**
 * Project Face — Utility Functions
 */

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-forest-400';
  if (score >= 60) return 'text-forest-300';
  if (score >= 40) return 'text-gold-400';
  if (score >= 20) return 'text-ember-400';
  return 'text-ember-500';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Needs Attention';
  return 'Critical';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-forest-500/20';
  if (score >= 60) return 'bg-forest-400/20';
  if (score >= 40) return 'bg-gold-500/20';
  if (score >= 20) return 'bg-ember-400/20';
  return 'bg-ember-500/20';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
