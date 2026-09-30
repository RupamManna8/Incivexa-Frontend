const GATEWAY_PORT = '8080';
const HOST = window.location.hostname || 'localhost';
export const API_BASE = import.meta.env.VITE_GATEWAY_URL || `http://${HOST}:${GATEWAY_PORT}`;

// Keys for permanent session storage in browser
const TOKEN_KEY = 'aim_auth_token';
const LEGACY_TOKEN_KEY = 'aim_gh_token';
const USER_KEY = 'aim_auth_user';

// Token helper with backwards compatibility
export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(LEGACY_TOKEN_KEY, token);
    }
  } catch {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user, token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(LEGACY_TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.warn('Failed to save session to localStorage:', err);
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

/**
 * Universal JSON Fetcher with Auth Header Injection
 */
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errMessage = `HTTP error ${res.status}`;
    try {
      const errData = await res.json();
      errMessage = errData.message || errData.error || errMessage;
    } catch {
      errMessage = await res.text() || errMessage;
    }
    const error = new Error(errMessage);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export const api = {
  // --- Auth APIs ---
  login: async (email, password) => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token && res.user) {
      saveSession(res.user, res.token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token && res.user) {
      saveSession(res.user, res.token);
    }
    return res;
  },

  demoLogin: async () => {
    const res = await request('/api/v1/auth/demo', { method: 'POST' });
    if (res.token && res.user) {
      saveSession(res.user, res.token);
    }
    return res;
  },

  verifyToken: async (token) => {
    const res = await request('/api/v1/auth/token', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    if (res.token && res.user) {
      saveSession(res.user, res.token);
    }
    return res;
  },

  getCurrentUser: () => request('/api/v1/auth/me'),
  getOAuthConfig: () => request('/api/v1/auth/config'),

  logout: () => {
    clearAuthToken();
    return request('/api/v1/auth/logout', { method: 'POST' }).catch(() => ({}));
  },

  // --- Project & API Key APIs ---
  getProjects: () => request('/api/v1/projects'),
  createProject: (data) => request('/api/v1/projects', { method: 'POST', body: JSON.stringify(data) }),
  getProjectKeys: (projectId) => request(`/api/v1/projects/${projectId}/keys`),
  createProjectKey: (projectId, name) => request(`/api/v1/projects/${projectId}/keys`, { method: 'POST', body: JSON.stringify({ name }) }),
  revokeProjectKey: (projectId, keyId) => request(`/api/v1/projects/${projectId}/keys/${keyId}`, { method: 'DELETE' }),

  // --- GitHub & Repositories APIs ---
  getGitHubRepos: () => request('/api/v1/github/repos'),
  selectRepository: (data) => request('/api/v1/repositories/select', { method: 'POST', body: JSON.stringify(data) }),
  triggerIndexing: (data) => request('/api/v1/repositories/index', { method: 'POST', body: JSON.stringify(data) }),
  getActiveRepo: (projectId) => request(`/api/v1/repositories/active?projectId=${projectId}`),
  getRepoStatus: (repoUrl, projectId) => request(`/api/v1/repositories/status?repoUrl=${encodeURIComponent(repoUrl)}&projectId=${projectId}`),

  // --- Incident APIs ---
  getIncidents: (projectId, query = {}) => {
    const params = new URLSearchParams();
    if (query.status) params.set('status', query.status);
    if (query.severity) params.set('severity', query.severity);
    if (query.service) params.set('service', query.service);
    if (query.limit) params.set('limit', query.limit);
    if (query.page) params.set('page', query.page);
    return request(`/api/v1/projects/${projectId}/incidents?${params.toString()}`);
  },
  getIncidentDetails: (projectId, incidentId) => request(`/api/v1/projects/${projectId}/incidents/${incidentId}`),
  updateIncidentStatus: (projectId, incidentId, status, note = '') =>
    request(`/api/v1/projects/${projectId}/incidents/${incidentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, actor: 'OPERATOR' })
    }),
  getInvestigation: (projectId, incidentId) => request(`/api/v1/projects/${projectId}/incidents/${incidentId}/investigation`),

  // --- Stats & System Health ---
  getProjectStats: (projectId) => request(`/api/v1/projects/${projectId}/stats`),
  getKpiSummary: (projectId, env = 'production') => {
    const ep = projectId
      ? `/api/v1/projects/${projectId}/stats/kpi?env=${env}`
      : `/api/v1/stats/kpi?env=${env}`;
    return request(ep);
  },
  getTrafficTimeSeries: (projectId, range = '24h', env = 'production') => {
    const ep = projectId
      ? `/api/v1/projects/${projectId}/stats/traffic?range=${range}&env=${env}`
      : `/api/v1/stats/traffic?range=${range}&env=${env}`;
    return request(ep);
  },
  getHttpStatusDistribution: (projectId, env = 'production') => {
    const ep = projectId
      ? `/api/v1/projects/${projectId}/stats/http-status?env=${env}`
      : `/api/v1/stats/http-status?env=${env}`;
    return request(ep);
  },
  getHttpMethodDistribution: (projectId, env = 'production') => {
    const ep = projectId
      ? `/api/v1/projects/${projectId}/stats/http-methods?env=${env}`
      : `/api/v1/stats/http-methods?env=${env}`;
    return request(ep);
  },
  getTopEndpoints: (projectId, env = 'production') => {
    const ep = projectId
      ? `/api/v1/projects/${projectId}/stats/top-endpoints?env=${env}`
      : `/api/v1/stats/top-endpoints?env=${env}`;
    return request(ep);
  },
  getGeoDistribution: (projectId, env = 'production') => {
    const ep = projectId 
      ? `/api/v1/projects/${projectId}/stats/geography?env=${env || 'production'}`
      : `/api/v1/stats/geography?env=${env || 'production'}`;
    return request(ep);
  },
  getServicesHealth: () => request('/api/v1/services/health'),
  cleanDatabase: (preserveProjects = true) => request('/api/v1/db/clean', { method: 'POST', body: JSON.stringify({ preserveProjects }) }),

  // --- Sandbox APIs ---
  runSandboxJob: (data) => request('/api/sandbox/jobs', { method: 'POST', body: JSON.stringify(data) }),
  getSandboxJob: (jobId) => request(`/api/sandbox/jobs/${jobId}`),

  // --- Manual Telemetry Event Ingest ---
  ingestEvent: (projectId, event, apiKey) =>
    request(`/api/v1/projects/${projectId}/ingest`, {
      method: 'POST',
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      body: JSON.stringify(event)
    })
};
