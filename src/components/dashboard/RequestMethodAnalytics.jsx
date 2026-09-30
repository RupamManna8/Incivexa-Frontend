import React from 'react';
import { Send, Clock, Layers } from 'lucide-react';
import { formatCompactNumber, formatLatency } from '../../utils/chartUtils';

export function RequestMethodAnalytics({ data }) {
  const methods = data?.methods || [
    { method: 'GET', count: 0, percent: 0, avgLatency: 0, color: '#2563EB' }
  ];

  const totalCalls = methods.reduce((s, m) => s + (m.count || 0), 0);
  const activeMethods = methods.filter(m => m.count > 0);
  const dominant = activeMethods.length > 0 ? [...activeMethods].sort((a, b) => b.count - a.count)[0] : null;
  const heaviest = activeMethods.length > 0 ? [...activeMethods].sort((a, b) => b.avgLatency - a.avgLatency)[0] : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 transition-all flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              HTTP Method Distribution
            </h3>
            <p className="text-[11px] text-text-secondary">
              Traffic ratio & average processing latency by method
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-text-secondary">
          {methods.length} HTTP {methods.length === 1 ? 'Verb' : 'Verbs'}
        </span>
      </div>

      {/* Method Bars List */}
      <div className="space-y-3.5 py-4 flex-1">
        {methods.map((m) => (
          <div key={m.method} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono font-bold px-1.5 py-0.5 rounded text-[11px] text-white"
                  style={{ backgroundColor: m.color }}
                >
                  {m.method}
                </span>
                <span className="font-medium text-text-secondary">
                  {formatCompactNumber(m.count)} calls
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-text-secondary flex items-center gap-1">
                  <Clock className="w-3 h-3 text-status-warning" />
                  {formatLatency(m.avgLatency)}
                </span>
                <span className="font-bold text-text-primary w-10 text-right">
                  {m.percent}%
                </span>
              </div>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full bg-border-subtle/50 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(m.percent, totalCalls === 0 ? 0 : 0.5)}%`,
                  backgroundColor: m.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
        <span>Dominant: <strong>{dominant ? `${dominant.method} (${dominant.percent}%)` : 'Baseline Ready'}</strong></span>
        <span>Heaviest: <strong>{heaviest ? `${heaviest.method} (${formatLatency(heaviest.avgLatency)} avg)` : 'N/A'}</strong></span>
      </div>
    </div>
  );
}
