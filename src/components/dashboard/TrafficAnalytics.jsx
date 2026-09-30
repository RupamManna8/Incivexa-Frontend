import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  AlertCircle, 
  Filter,
  BarChart2
} from 'lucide-react';
import { formatCompactNumber, formatLatency } from '../../utils/chartUtils';

export function TrafficAnalytics({ data, timeRange, onTimeRangeChange, isLoading }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeMetric, setActiveMetric] = useState('both'); // 'traffic', 'latency', 'both'

  const points = data?.points || [];
  const summary = data?.summary || {
    totalRequests: 0,
    avgP95: 0,
    avgP99: 0,
    totalErrors: 0,
    errorRatePercent: '0.00',
  };

  // Compute SVG scale coordinates
  const { maxReq, maxLat, pathData, areaData, latencyPathData } = useMemo(() => {
    if (!points.length) return { maxReq: 1, maxLat: 1, pathData: '', areaData: '', latencyPathData: '' };

    const maxR = Math.max(...points.map(p => p.requests), 100);
    const maxL = Math.max(...points.map(p => p.p95Latency), 50);

    const width = 800;
    const height = 220;
    const paddingBottom = 20;
    const paddingTop = 15;
    const plotHeight = height - paddingTop - paddingBottom;

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1 || 1)) * width;
      const yReq = height - paddingBottom - (p.requests / maxR) * plotHeight;
      const yLat = height - paddingBottom - (p.p95Latency / maxL) * plotHeight;
      return { x, yReq, yLat, ...p };
    });

    // Generate smooth curve for requests
    let path = `M ${coords[0].x} ${coords[0].yReq}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cx = (prev.x + curr.x) / 2;
      path += ` C ${cx} ${prev.yReq}, ${cx} ${curr.yReq}, ${curr.x} ${curr.yReq}`;
    }

    const area = `${path} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

    // Generate curve for latency
    let latPath = `M ${coords[0].x} ${coords[0].yLat}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cx = (prev.x + curr.x) / 2;
      latPath += ` C ${cx} ${prev.yLat}, ${cx} ${curr.yLat}, ${curr.x} ${curr.yLat}`;
    }

    return { maxReq: maxR, maxLat: maxL, pathData: path, areaData: area, latencyPathData: latPath };
  }, [points]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              Traffic Volume & Latency Dynamics
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
              Live Edge Telemetry
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time throughput, P95 tail latency, and correlated 5xx error anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Metric Filter */}
          <div className="flex rounded-lg border border-border-subtle p-0.5 bg-surface-secondary text-xs">
            <button
              onClick={() => setActiveMetric('both')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'both' ? 'bg-surface-main text-text-primary shadow-soft-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveMetric('traffic')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'traffic' ? 'bg-surface-main text-accent-primary shadow-soft-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              RPS
            </button>
            <button
              onClick={() => setActiveMetric('latency')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'latency' ? 'bg-surface-main text-status-warning shadow-soft-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Latency
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex rounded-lg border border-border-subtle p-0.5 bg-surface-secondary text-xs">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange?.(range)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  timeRange === range
                    ? 'bg-accent-primary text-white shadow-soft-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Quick Stats Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-subtle">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent-primary" />
            Total Requests
          </div>
          <div className="text-lg font-bold text-text-primary mt-1">
            {formatCompactNumber(summary.totalRequests)}
          </div>
          <div className="text-[11px] text-text-secondary">Across edge PoPs</div>
        </div>

        <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-subtle">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-status-warning" />
            P95 Latency (Avg)
          </div>
          <div className="text-lg font-bold text-text-primary mt-1">
            {formatLatency(summary.avgP95)}
          </div>
          <div className="text-[11px] text-text-secondary">Peak: {formatLatency(summary.avgP99)} (P99)</div>
        </div>

        <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-subtle">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-status-critical" />
            5xx Server Errors
          </div>
          <div className="text-lg font-bold text-text-primary mt-1">
            {formatCompactNumber(summary.totalErrors)}
          </div>
          <div className="text-[11px] text-text-secondary">Error Rate: {summary.errorRatePercent}%</div>
        </div>

        <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-subtle">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-status-success" />
            Current Throughput
          </div>
          <div className="text-lg font-bold text-text-primary mt-1">
            {points.length > 0 ? `${formatCompactNumber(points[points.length - 1].requests)} req/s` : '0 req/s'}
          </div>
          <div className="text-[11px] text-status-success font-medium">
            {summary.totalRequests > 0 ? `${(100 - parseFloat(summary.errorRatePercent || 0)).toFixed(1)}% Success Rate` : '100.0% Success Rate'}
          </div>
        </div>
      </div>

      {/* SVG Interactive Time Series Chart */}
      <div className="relative w-full h-64 mt-2 select-none">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-main/80 z-10">
            <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : null}

        <svg
          viewBox="0 0 800 220"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1="0" y1="35" x2="800" y2="35" stroke="#E2E6EA" strokeDasharray="3 3" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="#E2E6EA" strokeDasharray="3 3" />
          <line x1="0" y1="165" x2="800" y2="165" stroke="#E2E6EA" strokeDasharray="3 3" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#E2E6EA" />

          {/* Request Volume Area & Line */}
          {(activeMetric === 'both' || activeMetric === 'traffic') && areaData && (
            <motion.path
              d={areaData}
              fill="url(#trafficGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {(activeMetric === 'both' || activeMetric === 'traffic') && pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Latency Curve */}
          {(activeMetric === 'both' || activeMetric === 'latency') && latencyPathData && (
            <path
              d={latencyPathData}
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Error Spike Markers */}
          {points.map((p, idx) => {
            if (p.errors > 20) {
              const x = (idx / (points.length - 1 || 1)) * 800;
              return (
                <g key={`err-${idx}`}>
                  <circle cx={x} cy={195} r="3.5" fill="#DC2626" />
                  <line x1={x} y1={190} x2={x} y2={165} stroke="#DC2626" strokeWidth="1" strokeDasharray="2 2" />
                </g>
              );
            }
            return null;
          })}

          {/* Hover Crosshair & Detection Zones */}
          {points.map((p, idx) => {
            const x = (idx / (points.length - 1 || 1)) * 800;
            return (
              <rect
                key={`hit-${idx}`}
                x={x - 800 / (points.length * 2)}
                y="0"
                width={800 / points.length}
                height="220"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Active Hover Point Marker */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              <line
                x1={(hoveredIndex / (points.length - 1 || 1)) * 800}
                y1="0"
                x2={(hoveredIndex / (points.length - 1 || 1)) * 800}
                y2="200"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={(hoveredIndex / (points.length - 1 || 1)) * 800}
                cy={200 - (points[hoveredIndex].requests / maxReq) * 185}
                r="5"
                fill="#4F46E5"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none bg-text-primary text-white text-xs rounded-xl py-2 px-3 shadow-soft-xl transition-all -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(hoveredIndex / (points.length - 1 || 1)) * 100}%`,
              top: '50px',
            }}
          >
            <div className="font-semibold text-gray-300 pb-1 border-b border-gray-700 mb-1 flex items-center justify-between gap-4">
              <span>{activePoint.time}</span>
              <span className="text-[10px] text-gray-400">Timestamp</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-light" />
                  Throughput:
                </span>
                <span className="font-bold">{activePoint.requests.toLocaleString()} req/s</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  P95 Latency:
                </span>
                <span className="font-bold text-amber-300">{activePoint.p95Latency}ms</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Errors:
                </span>
                <span className={`font-bold ${activePoint.errors > 10 ? 'text-red-400' : 'text-gray-300'}`}>
                  {activePoint.errors} err/s
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend and Axis Labels */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border-subtle text-xs text-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded bg-accent-primary" />
            <span className="font-medium text-text-primary">Request Rate (RPS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-status-warning" />
            <span className="font-medium text-text-primary">P95 Tail Latency (ms)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-critical" />
            <span className="font-medium text-text-primary">5xx Spikes</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span>Sampling Interval: <strong>5s auto-poll</strong></span>
          <span>·</span>
          <span>Timezone: <strong>IST / UTC+05:30</strong></span>
        </div>
      </div>
    </div>
  );
}
