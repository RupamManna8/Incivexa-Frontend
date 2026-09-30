import React, { useState, useMemo } from 'react';
import {
  Search, Filter, AlertCircle, ChevronRight, CheckCircle2,
  Clock, Flame, RefreshCw, AlertTriangle, ChevronDown,
  ArrowUpDown, Eye, Bot, XCircle
} from 'lucide-react';

export function IncidentsPage({
  incidents = [],
  onSelectIncident,
  onUpdateStatus,
  isLoading,
  onRefresh,
}) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('lastSeen'); // 'lastSeen' | 'severity' | 'eventCount'
  const [sortDir, setSortDir] = useState('desc');

  // Extract unique services
  const services = useMemo(() => {
    const set = new Set(incidents.map(i => i.service).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [incidents]);

  const filtered = useMemo(() => {
    let result = incidents.filter(inc => {
      const matchesSearch =
        !search ||
        inc.title?.toLowerCase().includes(search.toLowerCase()) ||
        inc.service?.toLowerCase().includes(search.toLowerCase()) ||
        inc.primaryHash?.toLowerCase().includes(search.toLowerCase());

      const incSev = (inc.severity || 'LOW').toUpperCase();
      const matchesSeverity = severityFilter === 'ALL' || incSev === severityFilter;

      const incStatus = (inc.status || 'DETECTED').toUpperCase();
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'OPEN' && incStatus !== 'RESOLVED') ||
        (statusFilter === 'RESOLVED' && incStatus === 'RESOLVED') ||
        incStatus === statusFilter;

      const matchesService = serviceFilter === 'ALL' || inc.service === serviceFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesService;
    });

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'lastSeen') {
        cmp = new Date(b.lastSeen || b.updatedAt || 0) - new Date(a.lastSeen || a.updatedAt || 0);
      } else if (sortBy === 'severity') {
        const sev = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        cmp = (sev[(b.severity || 'LOW').toUpperCase()] || 0) - (sev[(a.severity || 'LOW').toUpperCase()] || 0);
      } else if (sortBy === 'eventCount') {
        cmp = (b.eventCount || 0) - (a.eventCount || 0);
      }
      return sortDir === 'desc' ? cmp : -cmp;
    });

    return result;
  }, [incidents, search, severityFilter, statusFilter, serviceFilter, sortBy, sortDir]);

  const severityConfig = {
    CRITICAL: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', icon: Flame },
    HIGH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: AlertCircle },
    MEDIUM: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500', icon: AlertTriangle },
    LOW: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400', icon: AlertTriangle },
  };

  const statusConfig = {
    RESOLVED: { bg: 'bg-green-50', text: 'text-green-700' },
    DIAGNOSED: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    INVESTIGATING: { bg: 'bg-amber-50', text: 'text-amber-700' },
    TRIAGING: { bg: 'bg-sky-50', text: 'text-sky-700' },
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'just now';
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const openCount = incidents.filter(i => (i.status || 'DETECTED').toUpperCase() !== 'RESOLVED').length;
  const critCount = incidents.filter(i => (i.severity || 'LOW').toUpperCase() === 'CRITICAL').length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Incidents</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Real-time correlated incidents across all monitored services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
              {openCount} Open
            </span>
            {critCount > 0 && (
              <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 font-medium border border-red-200">
                {critCount} Critical
              </span>
            )}
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by error, service, or hash..."
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-colors"
          />
        </div>

        {/* Severity filter pills */}
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

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 focus:outline-none focus:border-indigo-300"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DIAGNOSED">Diagnosed</option>
          <option value="INVESTIGATING">Investigating</option>
        </select>

        {/* Service filter */}
        {services.length > 2 && (
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 focus:outline-none focus:border-indigo-300"
          >
            {services.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Services' : s}</option>
            ))}
          </select>
        )}
      </div>

      {/* Incident list */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_120px_100px_100px_80px_40px] gap-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          <button onClick={() => toggleSort('lastSeen')} className="flex items-center gap-1 hover:text-gray-700 text-left">
            Incident
            {sortBy === 'lastSeen' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <span>Service</span>
          <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 hover:text-gray-700">
            Severity
            {sortBy === 'severity' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <span>Status</span>
          <button onClick={() => toggleSort('eventCount')} className="flex items-center gap-1 hover:text-gray-700">
            Events
            {sortBy === 'eventCount' && <ArrowUpDown className="w-3 h-3" />}
          </button>
          <span></span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-[13px] font-semibold text-gray-900 mb-1">No Incidents Found</h3>
            <p className="text-[12px] text-gray-500 max-w-sm mx-auto">
              {incidents.length === 0
                ? 'All services are healthy. Correlated incidents will appear here in real time.'
                : 'No incidents match the current filters.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(inc => {
              const sev = (inc.severity || 'LOW').toUpperCase();
              const config = severityConfig[sev] || severityConfig.LOW;
              const st = (inc.status || 'DETECTED').toUpperCase();
              const stConfig = statusConfig[st] || { bg: 'bg-gray-50', text: 'text-gray-600' };
              const SevIcon = config.icon;

              return (
                <div
                  key={inc._id}
                  onClick={() => onSelectIncident(inc)}
                  className="grid grid-cols-[1fr_120px_100px_100px_80px_40px] gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors items-center group"
                >
                  {/* Title + time */}
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {inc.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(inc.lastSeen || inc.updatedAt)}</span>
                      {inc.riskScore && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-600 border border-red-200">
                          Risk {inc.riskScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-100 text-gray-700 border border-gray-200 truncate max-w-full">
                      {inc.service || 'unknown'}
                    </span>
                  </div>

                  {/* Severity */}
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.bg} ${config.text} border ${config.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {sev}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${stConfig.bg} ${stConfig.text}`}>
                      {st === 'RESOLVED' && <CheckCircle2 className="w-3 h-3" />}
                      {st === 'INVESTIGATING' && <Eye className="w-3 h-3 animate-pulse" />}
                      {st.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Event count */}
                  <div className="text-[12px] font-medium text-gray-700 tabular-nums">
                    {(inc.eventCount || 1).toLocaleString()}
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-end">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
