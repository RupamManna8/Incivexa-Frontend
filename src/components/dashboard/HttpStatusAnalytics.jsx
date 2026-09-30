import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertOctagon, Server } from 'lucide-react';
import { formatCompactNumber } from '../../utils/chartUtils';

export function HttpStatusAnalytics({ data }) {
  const distribution = data?.distribution || [
    { codeGroup: '2xx Success', count: 0, percent: 100, color: '#16A34A' },
    { codeGroup: '3xx Redirection', count: 0, percent: 0, color: '#0284C7' },
    { codeGroup: '4xx Client Error', count: 0, percent: 0, color: '#EA580C' },
    { codeGroup: '5xx Server Error', count: 0, percent: 0, color: '#DC2626' },
  ];

  const recent5xx = data?.recent5xxBreakdown || [];
  const item2xx = distribution.find(d => d.codeGroup.startsWith('2xx'))?.percent ?? 100;
  const total5xx = distribution.find(d => d.codeGroup.startsWith('5xx'))?.count ?? 0;

  const icons = {
    '2xx': <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />,
    '3xx': <Info className="w-3.5 h-3.5 text-sky-600" />,
    '4xx': <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
    '5xx': <AlertOctagon className="w-3.5 h-3.5 text-status-critical" />,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 transition-all flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-status-success/10 border border-status-success/20 flex items-center justify-center text-status-success">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              HTTP Status Distribution
            </h3>
            <p className="text-[11px] text-text-secondary">
              Response code breakdown across all edge gateways
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
          item2xx >= 99 ? 'text-status-success bg-status-success/10 border-status-success/20' :
          item2xx >= 95 ? 'text-status-warning bg-status-warning/10 border-status-warning/20' :
          'text-status-critical bg-status-critical/10 border-status-critical/20'
        }`}>
          {item2xx}% 2xx {item2xx >= 95 ? 'Healthy' : 'Degraded'}
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="my-4">
        <div className="h-3 w-full rounded-full bg-border-subtle/60 flex overflow-hidden p-0.5 gap-0.5">
          {distribution.map((item) => (
            <div
              key={item.codeGroup}
              style={{
                width: `${Math.max(item.percent, 0.5)}%`,
                backgroundColor: item.color,
              }}
              className="h-full rounded-sm transition-all"
              title={`${item.codeGroup}: ${item.percent}%`}
            />
          ))}
        </div>
      </div>

      {/* Breakdown Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {distribution.map((item) => {
          const prefix = item.codeGroup.substring(0, 3);
          return (
            <div
              key={item.codeGroup}
              className="p-3 rounded-xl border border-border-subtle bg-surface-secondary/40 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                  {icons[prefix] || <Server className="w-3.5 h-3.5" />}
                  <span>{item.codeGroup}</span>
                </div>
                <div className="text-[11px] text-text-secondary mt-0.5">
                  {formatCompactNumber(item.count)} calls
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-text-primary">
                  {item.percent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent 5xx Error Anomalies Log */}
      <div className="mt-auto pt-3 border-t border-border-subtle">
        <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active 5xx Error Attribution</span>
          <span className={`font-semibold ${total5xx > 0 ? 'text-status-critical' : 'text-text-secondary'}`}>
            {formatCompactNumber(total5xx)} errors
          </span>
        </div>
        <div className="space-y-1.5">
          {recent5xx.length > 0 ? (
            recent5xx.slice(0, 3).map((err, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-status-critical/5 border border-status-critical/15 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-critical" />
                  <span className="font-semibold text-text-primary">{err.code}</span>
                  {err.service && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-main border border-border-subtle text-text-secondary">
                      {err.service}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[11px] text-status-critical font-bold">
                  {err.count} reqs
                </span>
              </div>
            ))
          ) : (
            <div className="text-[11px] text-text-secondary text-center py-2">
              No active 5xx error anomalies detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
