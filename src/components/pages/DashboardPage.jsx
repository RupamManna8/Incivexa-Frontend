import React from 'react';
import { StatsOverview } from '../StatsOverview';
import { TrafficAnalytics } from '../dashboard/TrafficAnalytics';
import { RequestGeography } from '../dashboard/RequestGeography';
import { HttpStatusAnalytics } from '../dashboard/HttpStatusAnalytics';
import { RequestMethodAnalytics } from '../dashboard/RequestMethodAnalytics';
import { TopEndpoints } from '../dashboard/TopEndpoints';
import { IncidentTable } from '../IncidentTable';
import { Activity } from 'lucide-react';

export function DashboardPage({
  stats,
  kpiData,
  trafficData,
  timeRange,
  onTimeRangeChange,
  loadingTraffic,
  geoData,
  httpStatusData,
  methodData,
  endpoints,
  incidents,
  onSelectIncident,
  onUpdateStatus,
  loadingIncidents,
  onRefresh,
  environment,
}) {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Real-time observability and operational overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live · Auto-refreshing · {(environment || 'production').toUpperCase()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsOverview stats={stats} kpiData={kpiData} />

      {/* Traffic Telemetry */}
      <TrafficAnalytics
        data={trafficData}
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        isLoading={loadingTraffic}
      />

      {/* Geography + HTTP Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7">
          <RequestGeography data={geoData} />
        </div>
        <div className="lg:col-span-5">
          <HttpStatusAnalytics data={httpStatusData} />
        </div>
      </div>

      {/* HTTP Methods + Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5">
          <RequestMethodAnalytics data={methodData} />
        </div>
        <div className="lg:col-span-7">
          <TopEndpoints endpoints={endpoints} />
        </div>
      </div>

      {/* Live Incidents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-gray-900">
              Live Incident Telemetry & Triage
            </h2>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
              Correlated Stream
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            Auto-refreshing every 5s
          </span>
        </div>

        <IncidentTable
          incidents={incidents}
          onSelectIncident={onSelectIncident}
          onUpdateStatus={onUpdateStatus}
          isLoading={loadingIncidents}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}
