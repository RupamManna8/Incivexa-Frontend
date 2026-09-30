import React, { useState } from 'react';
import { Network, Search, ArrowUpRight, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatLatency, formatPercent } from '../../utils/chartUtils';

export function TopEndpoints({ endpoints = [] }) {
  const [search, setSearch] = useState('');

  const filtered = endpoints.filter((ep) =>
    ep.path.toLowerCase().includes(search.toLowerCase()) ||
    ep.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 transition-all flex flex-col h-full">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Top API Endpoints & Health
            </h3>
            <p className="text-[11px] text-text-secondary">
              Throughput, tail latency, and error rate across key routes
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter endpoint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-subtle bg-surface-secondary text-xs text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="overflow-x-auto mt-2 flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border-subtle text-text-secondary uppercase text-[10px] tracking-wider bg-surface-secondary/40">
              <th className="py-2.5 px-3 font-semibold">Endpoint Route</th>
              <th className="py-2.5 px-3 font-semibold text-center">Method</th>
              <th className="py-2.5 px-3 font-semibold text-right">Throughput</th>
              <th className="py-2.5 px-3 font-semibold text-right">P95 Latency</th>
              <th className="py-2.5 px-3 font-semibold text-right">Error %</th>
              <th className="py-2.5 px-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/70 font-mono">
            {filtered.length > 0 ? (
              filtered.map((ep, idx) => {
                const isDegraded = ep.status === 'Degraded';
                const isCritical = ep.status === 'Critical';
                return (
                  <tr key={idx} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-2.5 px-3 text-text-primary font-medium truncate max-w-[220px]">
                      {ep.path}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        ep.method === 'POST' ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-text-primary">
                      {ep.rps} req/s
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={isDegraded || isCritical ? 'text-amber-600 font-bold' : 'text-text-secondary'}>
                        {formatLatency(ep.p95Latency)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={ep.errorRate > 0.05 ? 'text-status-critical font-bold' : 'text-text-secondary'}>
                        {formatPercent(ep.errorRate)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isCritical ? 'bg-status-critical/10 text-status-critical border border-status-critical/20' :
                        isDegraded ? 'bg-status-warning/10 text-status-warning border border-status-warning/20' :
                        'bg-status-success/10 text-status-success border border-status-success/20'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {ep.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-text-secondary font-sans">
                  No active endpoint telemetry recorded yet. Live requests will appear here in real time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
