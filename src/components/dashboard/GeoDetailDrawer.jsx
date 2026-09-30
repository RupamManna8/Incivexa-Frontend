import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Activity, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatCompactNumber, formatLatency, formatPercent } from '../../utils/chartUtils';

export function GeoDetailDrawer({ region, isOpen, onClose }) {
  if (!region) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/20 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-surface-main border-l border-border-subtle shadow-soft-xl z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-surface-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">
                    {region.state}
                  </h3>
                  <div className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-accent-primary">{region.code}</span>
                    <span>·</span>
                    <span>{region.share}% of Total Ingress</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Regional Summary Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border-subtle">
                  <div className="text-[11px] font-semibold text-text-secondary uppercase">Requests</div>
                  <div className="text-base font-bold text-text-primary mt-1">
                    {formatCompactNumber(region.requests)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border-subtle">
                  <div className="text-[11px] font-semibold text-text-secondary uppercase">P95 Latency</div>
                  <div className="text-base font-bold text-text-primary mt-1">
                    {formatLatency(region.latency)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border-subtle">
                  <div className="text-[11px] font-semibold text-text-secondary uppercase">Error Rate</div>
                  <div className={`text-base font-bold mt-1 ${region.errorRate > 0.2 ? 'text-status-warning' : 'text-status-success'}`}>
                    {formatPercent(region.errorRate)}
                  </div>
                </div>
              </div>

              {/* Edge Node Status */}
              <div className="p-4 rounded-xl border border-border-subtle bg-surface-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-status-success" />
                    Edge PoP Infrastructure
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-status-success/10 text-status-success">
                    Operational
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Traffic is routed through Cloudflare / Anycast edge nodes in {region.state}. Route health is monitored every 5 seconds.
                </p>
              </div>

              {/* Major Cities Drill-Down */}
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                  City-Level Telemetry Breakdown
                </h4>
                <div className="space-y-2.5">
                  {region.cities && region.cities.length > 0 ? (
                    region.cities.map((city, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-border-subtle bg-surface-main hover:bg-surface-secondary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-xs text-text-primary">
                            {city.name}
                          </span>
                          <span className="text-xs font-bold text-text-primary">
                            {formatCompactNumber(city.requests)} reqs
                          </span>
                        </div>

                        {/* Progress visual */}
                        <div className="w-full bg-border-subtle/50 h-1.5 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-accent-primary h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (city.requests / (region.requests || 1)) * 100)}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-status-warning" />
                            {formatLatency(city.latency)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-status-success" />
                            {formatPercent(city.errorRate)} errors
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-text-secondary text-center py-6">
                      No nested city telemetry available for this region.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle bg-surface-secondary/20 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-surface-secondary hover:bg-border-subtle text-xs font-semibold text-text-primary transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
