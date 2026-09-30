import React from 'react';
import { ChevronRight, Globe, MapPin } from 'lucide-react';
import { formatCompactNumber, formatLatency, formatPercent } from '../../utils/chartUtils';

export function GeoTable({ regions, onSelectRegion }) {
  if (!regions || regions.length === 0) {
    return (
      <div className="text-xs text-text-secondary text-center py-6">
        No regional ingress records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border-subtle text-text-secondary uppercase text-[10px] tracking-wider bg-surface-secondary/40">
            <th className="py-2.5 px-3 font-semibold">Region / State</th>
            <th className="py-2.5 px-3 font-semibold text-right">Share %</th>
            <th className="py-2.5 px-3 font-semibold text-right">Requests</th>
            <th className="py-2.5 px-3 font-semibold text-right">P95 Latency</th>
            <th className="py-2.5 px-3 font-semibold text-right">Error Rate</th>
            <th className="py-2.5 px-3 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle/70">
          {regions.map((reg) => {
            const isOutsideIndia = reg.state === 'Outside India';
            return (
              <tr
                key={reg.state}
                className="hover:bg-surface-secondary/40 transition-colors group cursor-pointer"
                onClick={() => onSelectRegion?.(reg)}
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isOutsideIndia
                        ? 'bg-neutral-200 text-neutral-700'
                        : 'bg-accent-primary/10 text-accent-primary'
                    }`}>
                      {isOutsideIndia ? <Globe className="w-3 h-3" /> : reg.code}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                        {reg.state}
                      </div>
                      <div className="text-[10px] text-text-secondary">
                        {isOutsideIndia ? 'Aggregated Global Ingress' : `${reg.cities?.length || 0} telemetry PoPs`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-text-primary">
                  {reg.share}%
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                  {formatCompactNumber(reg.requests)}
                </td>
                <td className="py-2.5 px-3 text-right text-text-secondary">
                  <span className="font-medium text-text-primary">{formatLatency(reg.latency)}</span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    reg.errorRate > 0.3
                      ? 'bg-status-warning/10 text-status-warning'
                      : 'bg-status-success/10 text-status-success'
                  }`}>
                    {formatPercent(reg.errorRate)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRegion?.(reg);
                    }}
                    className="p-1 rounded hover:bg-surface-secondary text-text-secondary group-hover:text-accent-primary transition-colors"
                    title="View regional details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
