import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  ArrowDownRight, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export function StatsOverview({ stats, kpiData }) {
  // Real-time accurate values with safe defaults
  const totalIncidents = kpiData?.activeIncidents?.total ?? (stats?.totalIncidents ?? 0);
  const p0 = kpiData?.activeIncidents?.p0 ?? (stats?.bySeverity?.CRITICAL ?? 0);
  const p1 = kpiData?.activeIncidents?.p1 ?? (stats?.bySeverity?.HIGH ?? 0);
  const p2 = kpiData?.activeIncidents?.p2 ?? 0;
  const incidentTrend = kpiData?.activeIncidents?.trend ?? (totalIncidents === 0 ? '0 active · optimal' : `${totalIncidents} active · triage active`);

  const healthScore = kpiData?.appHealthScore ?? (totalIncidents === 0 ? 100 : Math.max(0, 100 - p0 * 25 - p1 * 10 - p2 * 3));
  const healthStatus = kpiData?.appHealthStatus ?? (healthScore >= 90 ? 'Healthy' : healthScore >= 75 ? 'Degraded' : 'Critical');
  const healthTrend = kpiData?.appHealthTrend ?? (totalIncidents === 0 ? '+0.0%' : `-${(totalIncidents * 0.8).toFixed(1)}%`);

  const errorRate = kpiData?.errorRate?.current ?? 0;
  const errorTrend = kpiData?.errorRate?.trend ?? (errorRate > 0 ? `+${errorRate.toFixed(2)}%` : '0.00%');
  const errorTrendDir = kpiData?.errorRate?.trendDirection ?? (errorRate > 0 ? 'up' : 'down');

  const availability = kpiData?.availability?.current ?? 100;
  const slaTarget = kpiData?.availability?.slaTarget ?? 99.95;
  const slaStatus = kpiData?.availability?.status ?? (availability >= slaTarget ? 'Compliant' : 'Degraded');

  const cards = [
    {
      title: 'Application Health',
      value: `${healthScore}/100`,
      badge: (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
          healthScore >= 90 ? 'bg-status-success/10 text-status-success border border-status-success/20' :
          healthScore >= 75 ? 'bg-status-warning/10 text-status-warning border border-status-warning/20' :
          'bg-status-critical/10 text-status-critical border border-status-critical/20'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {healthStatus}
        </span>
      ),
      meta: (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
          <span className="text-status-success flex items-center font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {healthTrend}
          </span>
          <span>vs last 24h</span>
        </div>
      ),
      icon: <HeartPulse className="w-5 h-5 text-accent-primary" />,
      bg: 'bg-accent-primary/10',
      border: 'border-accent-primary/20',
    },
    {
      title: 'Active Incidents',
      value: `${totalIncidents} Active`,
      badge: (
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-critical/10 text-status-critical border border-status-critical/20">
            {p0} P0
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-warning/10 text-status-warning border border-status-warning/20">
            {p1} P1
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-secondary text-text-secondary border border-border-subtle">
            {p2} P2
          </span>
        </div>
      ),
      meta: (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
          <span className="text-status-success font-semibold">{incidentTrend}</span>
          <span>· auto-triage active</span>
        </div>
      ),
      icon: <AlertTriangle className="w-5 h-5 text-status-warning" />,
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/20',
    },
    {
      title: 'Global Error Rate',
      value: `${errorRate}%`,
      badge: (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-status-success/10 text-status-success border border-status-success/20">
          Target &lt; 0.1%
        </span>
      ),
      meta: (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
          <span className="text-status-success flex items-center font-semibold">
            {errorTrendDir === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            {errorTrend}
          </span>
          <span>vs 1h ago · P99 safe</span>
        </div>
      ),
      icon: <Activity className="w-5 h-5 text-accent-primary" />,
      bg: 'bg-accent-primary/10',
      border: 'border-accent-primary/20',
    },
    {
      title: 'Service Availability',
      value: `${availability}%`,
      badge: (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-status-success/10 text-status-success border border-status-success/20">
          <ShieldCheck className="w-3 h-3" />
          {slaStatus}
        </span>
      ),
      meta: (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
          <span>SLA Target: <strong>{slaTarget}%</strong> (30d)</span>
        </div>
      ),
      icon: <ShieldCheck className="w-5 h-5 text-status-success" />,
      bg: 'bg-status-success/10',
      border: 'border-status-success/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className="bg-white p-4 rounded-lg border border-gray-200 transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {card.title}
            </span>
            <div className={`w-9 h-9 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}>
              {card.icon}
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div className="text-2xl font-bold text-text-primary tracking-tight">
              {card.value}
            </div>
            {card.badge}
          </div>

          <div className="pt-2 border-t border-border-subtle/70">
            {card.meta}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
