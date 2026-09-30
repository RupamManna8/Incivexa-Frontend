import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Calendar, ChevronRight,
  Clock, AlertTriangle, Flame, CheckCircle2, AlertCircle,
  FileText, ArrowUpDown
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 'INC-2048', severity: 'CRITICAL', service: 'checkout-service',
    rootCause: 'Database connection pool exhaustion under sustained write load',
    impact: '312 failed requests, $4.2K revenue impact',
    resolutionTime: '14m', fix: 'PR #482', status: 'RESOLVED',
    date: '2026-09-28T14:32:00Z'
  },
  {
    id: 'INC-2041', severity: 'HIGH', service: 'payment-service',
    rootCause: 'Null pointer on missing billing address field',
    impact: '89 failed checkouts',
    resolutionTime: '8m', fix: 'PR #479', status: 'RESOLVED',
    date: '2026-09-27T09:15:00Z'
  },
  {
    id: 'INC-2036', severity: 'MEDIUM', service: 'notification-service',
    rootCause: 'Rate limit exceeded on email provider API',
    impact: '1,240 delayed notifications',
    resolutionTime: '22m', fix: 'Config update', status: 'RESOLVED',
    date: '2026-09-26T16:45:00Z'
  },
  {
    id: 'INC-2029', severity: 'CRITICAL', service: 'auth-service',
    rootCause: 'JWT token validation regression after dependency update',
    impact: '2,100 auth failures, 45min partial outage',
    resolutionTime: '45m', fix: 'PR #471', status: 'RESOLVED',
    date: '2026-09-25T02:10:00Z'
  },
  {
    id: 'INC-2022', severity: 'LOW', service: 'inventory-service',
    rootCause: 'Stale cache not invalidated on inventory update',
    impact: '23 incorrect stock displays',
    resolutionTime: '6m', fix: 'PR #468', status: 'RESOLVED',
    date: '2026-09-24T11:30:00Z'
  },
];

export function IncidentReportsPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return MOCK_REPORTS.filter(r => {
      const matchSearch = !search ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.service.toLowerCase().includes(search.toLowerCase()) ||
        r.rootCause.toLowerCase().includes(search.toLowerCase());
      const matchSev = severityFilter === 'ALL' || r.severity === severityFilter;
      return matchSearch && matchSev;
    });
  }, [search, severityFilter]);

  const sevConfig = {
    CRITICAL: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    HIGH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    MEDIUM: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    LOW: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Incident Reports</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Historical incident intelligence and post-mortem analysis
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by incident ID, service, or root cause..."
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-300 transition-colors"
          />
        </div>
        <div className="flex items-center bg-gray-50 p-0.5 rounded-md border border-gray-200 text-[11px]">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-white text-gray-900 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              <th className="py-2.5 px-4">Incident ID</th>
              <th className="py-2.5 px-4">Severity</th>
              <th className="py-2.5 px-4">Service</th>
              <th className="py-2.5 px-4">Root Cause</th>
              <th className="py-2.5 px-4">Impact</th>
              <th className="py-2.5 px-4 text-right">Resolution Time</th>
              <th className="py-2.5 px-4">Fix</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(r => {
              const sc = sevConfig[r.severity] || sevConfig.LOW;
              return (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="py-3 px-4">
                    <span className="text-[12px] font-mono font-semibold text-indigo-600">
                      {r.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                      {r.service}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[250px]">
                    <span className="text-[12px] text-gray-700 truncate block">{r.rootCause}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] text-gray-600">{r.impact}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[12px] font-mono font-medium text-gray-900">{r.resolutionTime}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] font-medium text-indigo-600">{r.fix}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700">
                      <CheckCircle2 className="w-3 h-3" />
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[12px] text-gray-500">{new Date(r.date).toLocaleDateString()}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-gray-400">
            No incident reports match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
