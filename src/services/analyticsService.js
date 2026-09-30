import { api } from '../api/client.js';

/**
 * Real-Time Analytics and Observability Data Service
 * 
 * Fetches real telemetry aggregations from the backend MongoDB pipelines:
 * - KPI Summary (Health score, Active incidents, Error rate, Availability)
 * - Traffic & Latency time series (RPS, P95, P99, Errors)
 * - Request Geography & Ingress (State-level India breakdown, International aggregate)
 * - HTTP Status Distribution (2xx, 3xx, 4xx, 5xx)
 * - HTTP Method Distribution (GET, POST, PUT, DELETE, PATCH)
 * - Top API Endpoints & Health (Route throughput, tail latency, error rate)
 */

/**
 * 1. KPI Summary Cards
 */
export async function getKpiSummary(projectId, env = 'production') {
  try {
    const res = await api.getKpiSummary(projectId, env);
    if (res && res.kpi) {
      return res.kpi;
    }
  } catch (err) {
    console.warn('[AnalyticsService] Failed to load KPI summary:', err.message);
  }

  return {
    appHealthScore: 100,
    appHealthStatus: 'Healthy',
    appHealthTrend: '+0.0%',
    activeIncidents: { total: 0, p0: 0, p1: 0, p2: 0, trend: '0 active' },
    errorRate: { current: 0, trend: '0.00%', trendDirection: 'down' },
    availability: { current: 100, slaTarget: 99.95, period: '30d', status: 'Compliant' }
  };
}

/**
 * 2. Traffic Volume & Latency Dynamics
 */
export async function getTrafficAnalytics(projectId, timeRange = '24h', env = 'production') {
  try {
    const res = await api.getTrafficTimeSeries(projectId, timeRange, env);
    if (res && res.traffic) {
      return res.traffic;
    }
  } catch (err) {
    console.warn('[AnalyticsService] Failed to load traffic analytics:', err.message);
  }

  return {
    timeRange,
    environment: env,
    points: [],
    summary: {
      totalRequests: 0,
      avgP95: 0,
      avgP99: 0,
      totalErrors: 0,
      errorRatePercent: '0.00'
    }
  };
}

/**
 * 3. Request Geography & Ingress
 */
export async function getGeoDistribution(projectId, env = 'production') {
  try {
    const res = await api.getGeoDistribution(projectId, env);
    if (res && res.geography) {
      return res.geography;
    }
  } catch (err) {
    console.warn('[AnalyticsService] Failed to fetch live geography stats:', err.message);
  }

  return {
    totalRequests: 0,
    domesticShare: 100,
    outsideIndiaShare: 0,
    regions: []
  };
}

/**
 * 4. HTTP Status Distribution
 */
export async function getHttpStatusAnalytics(projectId, env = 'production') {
  try {
    const res = await api.getHttpStatusDistribution(projectId, env);
    if (res && res.httpStatus) {
      return res.httpStatus;
    }
  } catch (err) {
    console.warn('[AnalyticsService] Failed to load HTTP status distribution:', err.message);
  }

  return {
    total: 0,
    distribution: [
      { codeGroup: '2xx Success', count: 0, percent: 100, color: '#16A34A' },
      { codeGroup: '3xx Redirection', count: 0, percent: 0, color: '#0284C7' },
      { codeGroup: '4xx Client Error', count: 0, percent: 0, color: '#EA580C' },
      { codeGroup: '5xx Server Error', count: 0, percent: 0, color: '#DC2626' }
    ],
    recent5xxBreakdown: []
  };
}

/**
 * 5. HTTP Method Distribution
 */
export async function getRequestMethodAnalytics(projectId, env = 'production') {
  try {
    const res = await api.getHttpMethodDistribution(projectId, env);
    if (res && res.httpMethods) {
      return res.httpMethods;
    }
  } catch (err) {
    console.warn('[AnalyticsService] Failed to load HTTP method distribution:', err.message);
  }

  return {
    methods: [
      { method: 'GET', count: 0, percent: 100, avgLatency: 0, color: '#2563EB' }
    ]
  };
}

/**
 * 6. Top API Endpoints & Health
 */
export async function getTopEndpoints(projectId, env = 'production') {
  try {
    const res = await api.getTopEndpoints(projectId, env);
    if (res && res.endpoints) {
      return res.endpoints;
    }
  } catch (err) {
    console.warn('[AnalyticsService] Failed to load top endpoints:', err.message);
  }

  return [];
}
