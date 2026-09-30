import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Play, ShieldAlert, CheckCircle2, Zap, Flame,
  Activity, ArrowRight, AlertTriangle
} from 'lucide-react';
import { api, API_BASE } from '../api/client';

export function SimulationModal({
  isOpen,
  onClose,
  project,
  showToast,
  onTriggerRefresh,
  onTriggered
}) {
  const [runningScenario, setRunningScenario] = useState(null);

  if (!isOpen) return null;

  const SDK_PORT = '3001';
  const HOST = window.location.hostname || 'localhost';
  const SDK_URL = `http://${HOST}:${SDK_PORT}`;

  const triggerRefreshCallback = () => {
    if (typeof onTriggerRefresh === 'function') onTriggerRefresh();
    if (typeof onTriggered === 'function') onTriggered();
  };

  const handleRunScenario = async (scenarioKey) => {
    setRunningScenario(scenarioKey);
    try {
      if (scenarioKey === 'healthy') {
        // Trigger normal order on demo service or directly ingest
        try {
          await fetch(`${SDK_URL}/trigger-demo-success`);
        } catch {
          // Fallback direct telemetry ingest with rich telemetry attributes
          await api.ingestEvent(project?._id, {
            trace_id: `trace-healthy-${Date.now()}`,
            service: 'demo-payment-app',
            env: 'production',
            severity: 'info',
            tags: {
              message: 'Order ORD-9921 processed normally. Total: $214.99',
              http_method: 'POST',
              http_status: '200',
              http_path: '/api/v1/orders/checkout',
              client_ip: '127.0.0.1'
            },
            metrics: { duration_ms: 42, responseTimeMs: 42, statusCode: 200 }
          });
        }
        showToast('Healthy baseline traffic dispatched (Status 200 OK)', 'success');
      } else if (scenarioKey === 'bug') {
        // Trigger null pointer bug
        try {
          await fetch(`${SDK_URL}/trigger-demo-bug`);
        } catch {
          await api.ingestEvent(project?._id, {
            trace_id: `trace-bug-${Date.now()}`,
            service: 'demo-payment-app',
            env: 'production',
            severity: 'error',
            tags: {
              message: "TypeError: Cannot read properties of undefined (reading 'zipCode')",
              http_method: 'POST',
              http_status: '500',
              http_path: '/api/v1/orders/process',
              client_ip: '127.0.0.1'
            },
            metrics: { duration_ms: 185, statusCode: 500 },
            stack: [
              { file: 'demo-repo/src/order_service.js', line: 23, column: 45, function: 'processOrder' },
              { file: 'demo-repo/src/routes.js', line: 56, column: 12, function: 'handleOrderCheckout' }
            ]
          });
        }
        showToast('Demo incident event emitted! Correlating...', 'warning');
      } else if (scenarioKey === 'storm') {
        // 50-event alert storm
        showToast('Firing 50-event alert storm... Observe 100% deduplication!', 'info');
        const promises = [];
        for (let i = 0; i < 50; i++) {
          promises.push(
            api.ingestEvent(project?._id, {
              trace_id: `trace-storm-${Date.now()}-${i}`,
              service: 'demo-payment-app',
              env: 'production',
              severity: i === 25 ? 'critical' : 'error',
              tags: {
                message: `Database connection pool timeout on replica ${i % 5}`,
                http_method: 'POST',
                http_status: '500',
                http_path: '/api/v1/payments/charge',
                client_ip: '127.0.0.1'
              },
              metrics: { duration_ms: 320 + (i % 20) * 10, statusCode: 500 },
              stack: [
                { file: 'demo-repo/src/checkout.js', line: 104, column: 12, function: 'processPayment' }
              ]
            }).catch(() => ({}))
          );
        }
        await Promise.all(promises);
        showToast('50 noisy events compressed into 1 incident!', 'success');
      }

      setTimeout(() => {
        triggerRefreshCallback();
      }, 800);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRunningScenario(null);
    }
  };

  const scenarios = [
    {
      key: 'healthy',
      title: 'Healthy Baseline Traffic',
      badge: 'Status 200',
      badgeClass: 'bg-status-success/10 text-status-success',
      icon: <CheckCircle2 className="w-5 h-5 text-status-success" />,
      desc: 'Dispatches valid customer orders with complete addresses. Verifies normal non-incident logging.'
    },
    {
      key: 'bug',
      title: 'Demo Fault: Missing Billing Address',
      badge: 'TypeError',
      badgeClass: 'bg-status-warning/10 text-status-warning',
      icon: <AlertTriangle className="w-5 h-5 text-status-warning" />,
      desc: 'Triggers unchecked property access in demo-repo/src/order_service.js:23. Triggers AI investigation.'
    },
    {
      key: 'storm',
      title: '50-Event Alert Storm (Surge Protection)',
      badge: 'High Load',
      badgeClass: 'bg-status-critical/10 text-status-critical',
      icon: <Flame className="w-5 h-5 text-status-critical" />,
      desc: 'Fires 50 rapid-fire database pool errors in parallel. Demonstrates 50:1 alert-to-incident deduplication.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-surface-main rounded-2xl border border-border-subtle shadow-soft-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Traffic & Fault Simulation</h3>
              <p className="text-xs text-text-secondary">
                Generate real-time telemetry into project <span className="font-semibold">{project?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-6 space-y-3">
          {scenarios.map((sc) => (
            <div
              key={sc.key}
              className="p-4 rounded-xl border border-border-subtle hover:border-accent-primary/30 hover:bg-surface-secondary/40 transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5">{sc.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-text-primary">{sc.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.badgeClass}`}>
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{sc.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleRunScenario(sc.key)}
                disabled={runningScenario !== null}
                className="px-3.5 py-1.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft-xs transition-colors flex-shrink-0 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${runningScenario === sc.key ? 'animate-spin' : ''}`} />
                <span>{runningScenario === sc.key ? 'Emitting...' : 'Dispatch'}</span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
