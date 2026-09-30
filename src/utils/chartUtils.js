/**
 * Chart utility helpers, color palettes, and formatters
 * Aligned with the Autonomous SRE enterprise light theme.
 */

export const CHART_COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#4338CA',
  primaryBg: 'rgba(79, 70, 229, 0.08)',
  
  success: '#15803D',
  successLight: '#22C55E',
  successBg: 'rgba(21, 128, 61, 0.08)',
  
  warning: '#B45309',
  warningLight: '#F59E0B',
  warningBg: 'rgba(180, 83, 9, 0.08)',
  
  critical: '#DC2626',
  criticalLight: '#EF4444',
  criticalBg: 'rgba(220, 38, 38, 0.08)',
  
  info: '#0284C7',
  infoLight: '#38BDF8',
  infoBg: 'rgba(2, 132, 199, 0.08)',
  
  neutral: '#667085',
  neutralLight: '#94A3B8',
  border: '#E2E6EA',
  surface: '#FFFFFF',
  background: '#F8F9FB',
};

export const STATUS_CODE_COLORS = {
  '2xx': '#16A34A',
  '3xx': '#0284C7',
  '4xx': '#EA580C',
  '5xx': '#DC2626',
};

export const METHOD_COLORS = {
  GET: '#2563EB',
  POST: '#16A34A',
  PUT: '#D97706',
  DELETE: '#DC2626',
  PATCH: '#9333EA',
  OPTIONS: '#64748B',
};

export const GEO_PALETTE = [
  '#4F46E5', // Maharashtra
  '#6366F1', // Karnataka
  '#0D9488', // Delhi NCR
  '#0284C7', // Tamil Nadu
  '#059669', // Telangana
  '#D97706', // Gujarat
  '#7C3AED', // Uttar Pradesh
  '#EC4899', // West Bengal
  '#94A3B8', // Outside India
];

/**
 * Format numbers with compact K, M, B suffixes
 */
export function formatCompactNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const absNum = Math.abs(num);
  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

/**
 * Format milliseconds into human readable string
 */
export function formatLatency(ms) {
  if (ms === null || ms === undefined || isNaN(ms)) return '0ms';
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  return `${Math.round(ms)}ms`;
}

/**
 * Format percentages
 */
export function formatPercent(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '0%';
  return `${Number(val).toFixed(decimals)}%`;
}

/**
 * Format currency in USD
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
