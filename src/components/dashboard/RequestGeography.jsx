import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Layers, List, PieChart } from 'lucide-react';
import { GeoTable } from './GeoTable';
import { GeoDetailDrawer } from './GeoDetailDrawer';
import { GEO_PALETTE, formatCompactNumber } from '../../utils/chartUtils';

export function RequestGeography({ data, isLoading }) {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const regions = data?.regions || [];
  const totalRequests = data?.totalRequests || 0;
  const domesticShare = data?.domesticShare ?? 100;
  const outsideIndiaShare = data?.outsideIndiaShare ?? 0;

  // Calculate SVG Donut arcs
  const donutArcs = useMemo(() => {
    if (!regions.length) return [];
    let accumulatedAngle = 0;
    const radius = 64;
    const circumference = 2 * Math.PI * radius;

    return regions.map((reg, idx) => {
      const share = reg.share / 100;
      const strokeDasharray = `${share * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle * circumference;
      accumulatedAngle += share;
      const color = GEO_PALETTE[idx % GEO_PALETTE.length];

      return {
        ...reg,
        color,
        strokeDasharray,
        strokeDashoffset,
        radius,
      };
    });
  }, [regions]);

  const handleOpenRegion = (reg) => {
    setSelectedRegion(reg);
    setDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 transition-all flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Request Geography & Ingress
            </h3>
            <p className="text-[11px] text-text-secondary">
              State-level India breakdown · International aggregated
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-lg border border-border-subtle p-0.5 bg-surface-secondary text-xs">
          <button
            onClick={() => setViewMode('chart')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'chart' ? 'bg-surface-main text-accent-primary shadow-soft-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Chart view"
          >
            <PieChart className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-surface-main text-accent-primary shadow-soft-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Table view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-3">
        {viewMode === 'chart' ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center min-h-[190px]">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="transparent"
                  stroke="#E2E6EA"
                  strokeWidth="18"
                />
                {donutArcs.map((arc, idx) => (
                  <circle
                    key={arc.state}
                    cx="80"
                    cy="80"
                    r="64"
                    fill="transparent"
                    stroke={arc.color}
                    strokeWidth={hoveredSlice === idx ? '22' : '18'}
                    strokeDasharray={arc.strokeDasharray}
                    strokeDashoffset={arc.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => handleOpenRegion(arc)}
                  />
                ))}
              </svg>

              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                  Total Traffic
                </span>
                <span className="text-base font-bold text-text-primary">
                  {formatCompactNumber(totalRequests)}
                </span>
                <span className="text-[9px] text-accent-primary font-semibold">
                  {totalRequests > 0 ? `${domesticShare}% Domestic` : 'Baseline Ready'}
                </span>
              </div>
            </div>

            {/* Legend / Slices */}
            <div className="flex-1 w-full space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {donutArcs.length > 0 ? (
                donutArcs.map((arc, idx) => (
                  <div
                    key={arc.state}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => handleOpenRegion(arc)}
                    className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      hoveredSlice === idx ? 'bg-surface-secondary font-semibold' : 'hover:bg-surface-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: arc.color }}
                      />
                      <span className="truncate text-text-primary text-xs">
                        {arc.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-right flex-shrink-0">
                      <span className="font-semibold text-text-primary">
                        {arc.share}%
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {formatCompactNumber(arc.requests)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-text-secondary text-center py-8">
                  No ingress traffic detected yet. Emitted telemetry will appear here in real time.
                </div>
              )}
            </div>
          </div>
        ) : (
          <GeoTable regions={regions} onSelectRegion={handleOpenRegion} />
        )}
      </div>

      {/* Footer Banner */}
      <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
          Domestic India Ingress: <strong>{domesticShare}%</strong>
        </span>
        <span className="text-neutral-500 font-medium">
          Non-India Aggregated: <strong>{outsideIndiaShare}%</strong>
        </span>
      </div>

      {/* Drilldown Slide-over Drawer */}
      <GeoDetailDrawer
        region={selectedRegion}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
