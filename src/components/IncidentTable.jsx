import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, AlertCircle, ChevronRight, CheckCircle2,
  Clock, Flame, ArrowUpDown, RefreshCw
} from 'lucide-react';

export function IncidentTable({
  incidents,
  onSelectIncident,
  onUpdateStatus,
  isLoading,
  onRefresh
}) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = incidents.filter(inc => {
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

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity) => {
    const sev = (severity || 'LOW').toUpperCase();
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-status-critical/10 text-status-critical border border-status-critical/20">
            <Flame className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-status-warning/10 text-status-warning border border-status-warning/20">
            <AlertCircle className="w-3 h-3" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-status-success/10 text-status-success border border-status-success/20">
            LOW
          </span>
        );
    }
  };

  const getStatusPill = (status) => {
    const st = (status || 'DETECTED').toUpperCase();
    if (st === 'RESOLVED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-status-success/10 text-status-success">
          <CheckCircle2 className="w-3 h-3" />
          Resolved
        </span>
      );
    }
    if (st === 'DIAGNOSED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-primary/10 text-accent-primary">
          Diagnosed
        </span>
      );
    }
    if (st === 'INVESTIGATING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-status-warning/10 text-status-warning animate-pulse">
          Investigating
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary border border-border-subtle">
        {st}
      </span>
    );
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by error, service, or hash..."
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/10 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Tabs */}
          <div className="flex items-center bg-surface-secondary p-1 rounded-xl border border-border-subtle text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  severityFilter === sev
                    ? 'bg-surface-main text-text-primary shadow-soft-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-surface-secondary border border-border-subtle rounded-xl text-xs font-medium text-text-primary focus:outline-none focus:border-accent-primary/50"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open Incidents</option>
            <option value="RESOLVED">Resolved Only</option>
            <option value="DIAGNOSED">Diagnosed</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl border border-border-subtle bg-surface-secondary hover:bg-surface-main text-text-secondary hover:text-text-primary transition-colors"
            title="Refresh Incidents"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Body */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border-subtle flex items-center justify-center mx-auto mb-3 text-text-secondary">
            <CheckCircle2 className="w-6 h-6 text-status-success" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">No Incidents Found</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {incidents.length === 0
              ? 'Your production services are healthy! Correlated alerts will appear here in real time.'
              : 'No incidents match the active search and filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {filtered.map(inc => (
            <motion.div
              key={inc._id}
              onClick={() => onSelectIncident(inc)}
              className="p-4 sm:px-6 hover:bg-surface-secondary/60 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="mt-0.5">{getSeverityBadge(inc.severity)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-primary transition-colors">
                      {inc.title}
                    </h4>
                    {/* Risk Score Pill */}
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-status-critical/10 text-status-critical border border-status-critical/20">
                      Risk {inc.riskScore || (inc.severity === 'CRITICAL' ? 88 : inc.severity === 'HIGH' ? 74 : 45)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-text-secondary">
                    <span className="font-medium text-text-primary/80 px-2 py-0.5 rounded bg-surface-secondary border border-border-subtle font-mono text-[11px]">
                      {inc.service || 'unknown-service'}
                    </span>
                    <span className="text-[11px]">
                      {inc.eventCount || 1} {inc.eventCount === 1 ? 'event' : 'events correlated'}
                    </span>
                    <span className="text-[11px] text-text-secondary/70">·</span>
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-text-secondary" />
                      {formatRelativeTime(inc.lastSeen || inc.updatedAt)}
                    </span>
                    {inc.aiHypothesis && (
                      <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-accent-primary font-medium bg-accent-primary/5 px-2 py-0.5 rounded border border-accent-primary/20 truncate max-w-xs">
                        AI: {inc.aiHypothesis}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status Pill & Action */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div>{getStatusPill(inc.status)}</div>
                <div className="p-1 rounded-lg group-hover:bg-surface-main text-text-secondary group-hover:text-text-primary transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
