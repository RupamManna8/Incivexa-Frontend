import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Layout
import { AppShell } from './components/layout/AppShell';

// Pages
import { DashboardPage } from './components/pages/DashboardPage';
import { IncidentsPage } from './components/pages/IncidentsPage';
import { IncidentReportsPage } from './components/pages/IncidentReportsPage';
import { CodeIntelligencePage } from './components/pages/CodeIntelligencePage';
import { FixesPage } from './components/pages/FixesPage';
import { AutomationsPage } from './components/pages/AutomationsPage';
import { PlaceholderPage } from './components/pages/PlaceholderPage';

// Existing modals & drawers
import { IncidentDrawer } from './components/IncidentDrawer';
import { ApiKeyManagerModal } from './components/ApiKeyManagerModal';
import { GitHubRepoModal } from './components/GitHubRepoModal';
import { ProjectModal } from './components/ProjectModal';
import { SimulationModal } from './components/SimulationModal';
import { Toast } from './components/Toast';

// Auth pages
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';

// Services & API
import {
  getKpiSummary,
  getTrafficAnalytics,
  getGeoDistribution,
  getHttpStatusAnalytics,
  getRequestMethodAnalytics,
  getTopEndpoints
} from './services/analyticsService';

import { api, setAuthToken, getStoredUser, getAuthToken, saveSession, clearAuthToken } from './api/client';

// Icons for placeholders
import { Network, GitBranch, Workflow, Settings, Key, Plug } from 'lucide-react';

// Breadcrumb mapping
const BREADCRUMBS = {
  '/dashboard': ['Control Plane', 'Dashboard'],
  '/incidents': ['Control Plane', 'Operations', 'Incidents'],
  '/reports': ['Control Plane', 'Operations', 'Incident Reports'],
  '/code-intelligence': ['Control Plane', 'Intelligence', 'Code Intelligence'],
  '/service-map': ['Control Plane', 'Intelligence', 'Service Map'],
  '/dependency-graph': ['Control Plane', 'Intelligence', 'Dependency Graph'],
  '/fixes': ['Control Plane', 'Remediation', 'Fixes'],
  '/pull-requests': ['Control Plane', 'Remediation', 'Pull Requests'],
  '/automations': ['Control Plane', 'Automation', 'Automations'],
  '/workflows': ['Control Plane', 'Automation', 'Workflows'],
  '/settings': ['System', 'Settings'],
  '/api-keys': ['System', 'API Keys'],
  '/integrations': ['System', 'Integrations'],
};

export default function App() {
  // View Router State: 'landing' | 'auth' | 'dashboard'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.includes('token=')) return 'dashboard';
    if (hash.includes('auth') || hash.includes('login') || hash.includes('signin') || hash.includes('signup') || hash.includes('demo')) return 'auth';
    if (hash.includes('landing')) return 'landing';
    if (hash.includes('dashboard')) return 'dashboard';
    const savedUser = getStoredUser();
    const token = getAuthToken();
    if (savedUser && token) return 'dashboard';
    return 'landing';
  });

  const [authInitialMode, setAuthInitialMode] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.includes('signup')) return 'signup';
    if (hash.includes('demo')) return 'demo';
    return 'signin';
  });

  // Current page path for routing
  const [activePath, setActivePath] = useState('/dashboard');

  // Core Entities
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [stats, setStats] = useState(null);
  const [servicesHealth, setServicesHealth] = useState(null);
  const [user, setUser] = useState(() => getStoredUser());
  const [activeRepo, setActiveRepo] = useState(null);

  // Environment State
  const [environment, setEnvironment] = useState('production');
  const [timeRange, setTimeRange] = useState('24h');
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  // Observability State
  const [kpiData, setKpiData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [httpStatusData, setHttpStatusData] = useState(null);
  const [methodData, setMethodData] = useState(null);
  const [endpoints, setEndpoints] = useState([]);

  // Modals & UI Controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [keysModalOpen, setKeysModalOpen] = useState(false);
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [isInvestigating, setIsInvestigating] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Navigation handler
  const handleNavigate = useCallback((path) => {
    setActivePath(path);
    // If navigating to API Keys, open the modal instead
    if (path === '/api-keys') {
      setKeysModalOpen(true);
      return;
    }
  }, []);

  // Compute badges for sidebar
  const badges = useMemo(() => {
    const openIncidents = incidents.filter(i => (i.status || 'DETECTED').toUpperCase() !== 'RESOLVED').length;
    return {
      incidents: openIncidents > 0 ? openIncidents : 0,
      fixes: 2,
      pullRequests: 1,
    };
  }, [incidents]);

  // 1. Check OAuth URL Hash or existing session on mount & hashchange listener
  useEffect(() => {
    const hash = window.location.hash;
    let urlToken = null;
    if (hash && hash.includes('token=')) {
      urlToken = new URLSearchParams(hash.replace(/^#/, '')).get('token');
    } else {
      urlToken = new URLSearchParams(window.location.search).get('token');
    }

    if (urlToken) {
      setAuthToken(urlToken);
      window.history.replaceState(null, '', window.location.pathname || '/');
      setCurrentView('dashboard');
    }

    const handleHashChange = () => {
      const h = window.location.hash || '';
      if (h.includes('token=')) return;
      if (h === '#landing') setCurrentView('landing');
      else if (h === '#signin') { setAuthInitialMode('signin'); setCurrentView('auth'); }
      else if (h === '#signup') { setAuthInitialMode('signup'); setCurrentView('auth'); }
      else if (h === '#demo') { setAuthInitialMode('demo'); setCurrentView('auth'); }
      else if (h === '#auth') setCurrentView('auth');
      else if (h === '#dashboard') setCurrentView('dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);

    api.getCurrentUser()
      .then(res => {
        if (res.user) {
          setUser(res.user);
          saveSession(res.user, urlToken || getAuthToken());
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          clearAuthToken();
          setUser(null);
        }
      });

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. Load Projects
  const loadProjects = useCallback(async () => {
    try {
      const res = await api.getProjects();
      const list = res.projects || [];
      setProjects(list);
      if (list.length > 0 && !activeProject) {
        setActiveProject(list[0]);
      }
    } catch (err) {
      console.warn('Could not load projects:', err.message);
    }
  }, [activeProject]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 3. Load Active Repo for Project
  useEffect(() => {
    if (activeProject?._id) {
      api.getActiveRepo(activeProject._id)
        .then(res => {
          if (res.repository) setActiveRepo(res.repository);
        })
        .catch(() => {});
    }
  }, [activeProject]);

  // 4. Load Analytics and Observability telemetry
  const loadAnalytics = useCallback(async () => {
    try {
      const [kpi, traffic, geo, httpStatus, method, eps] = await Promise.all([
        getKpiSummary(activeProject?._id, environment),
        getTrafficAnalytics(activeProject?._id, timeRange, environment),
        getGeoDistribution(activeProject?._id, environment),
        getHttpStatusAnalytics(activeProject?._id, environment),
        getRequestMethodAnalytics(activeProject?._id, environment),
        getTopEndpoints(activeProject?._id, environment)
      ]);

      setKpiData(kpi);
      setTrafficData(traffic);
      setGeoData(geo);
      setHttpStatusData(httpStatus);
      setMethodData(method);
      setEndpoints(eps);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  }, [activeProject?._id, environment, timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // 5. Poll Incidents, Stats, and Real-Time Observability Analytics
  const loadIncidentsAndStats = useCallback(async () => {
    if (!activeProject?._id) return;
    setLoadingIncidents(true);

    try {
      const [incRes, statsRes] = await Promise.all([
        api.getIncidents(activeProject._id, { limit: 50 }).catch(() => ({ incidents: [] })),
        api.getProjectStats(activeProject._id).catch(() => ({ stats: null }))
      ]);

      setIncidents(incRes.incidents || []);
      if (statsRes.stats) setStats(statsRes.stats);
    } catch (err) {
      console.warn('Poll error:', err.message);
    } finally {
      setLoadingIncidents(false);
    }
  }, [activeProject]);

  useEffect(() => {
    loadIncidentsAndStats();
    loadAnalytics();
    const interval = setInterval(() => {
      loadIncidentsAndStats();
      loadAnalytics();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadIncidentsAndStats, loadAnalytics]);

  // 6. Select Incident & Load Investigation
  const handleSelectIncident = async (inc) => {
    setSelectedIncident(inc);
    setInvestigation(null);
    try {
      const invRes = await api.getInvestigation(activeProject?._id, inc._id);
      setInvestigation(invRes);
    } catch (_) {}
  };

  // 7. Update Incident Status
  const handleUpdateStatus = async (incidentId, newStatus) => {
    try {
      await api.updateIncidentStatus(activeProject?._id, incidentId, newStatus);
      showToast(`Incident marked as ${newStatus}`, 'success');
      loadIncidentsAndStats();
      if (selectedIncident?._id === incidentId) {
        setSelectedIncident(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // 8. Trigger Autonomous Investigation
  const handleTriggerInvestigation = async (incidentId) => {
    setIsInvestigating(true);
    showToast('Autonomous investigation started...', 'info');

    try {
      const targetInc = selectedIncident || incidents.find(i => i._id === incidentId);
      const HOST = window.location.hostname || 'localhost';
      const AI_URL = `http://${HOST}:8000`;

      await fetch(`${AI_URL}/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incidentId,
          project_id: activeProject?._id,
          repo_url: activeRepo?.repoUrl || 'demo-repo',
          commit_sha: targetInc?.releaseSha || 'HEAD',
          title: targetInc?.title || 'Unhandled Error',
          severity: targetInc?.severity || 'error',
          stack: targetInc?.evidence?.[0]?.stack || []
        })
      });

      setTimeout(async () => {
        try {
          const inv = await api.getInvestigation(activeProject?._id, incidentId);
          setInvestigation(inv);
          showToast('Investigation completed: Root cause identified!', 'success');
        } catch (_) {}
        setIsInvestigating(false);
        loadIncidentsAndStats();
      }, 2000);
    } catch (_) {
      setTimeout(() => {
        setIsInvestigating(false);
        showToast('Investigation complete (mock diagnostic ready)', 'success');
      }, 1500);
    }
  };

  // 9. Clean Database Action
  const handleCleanDb = async () => {
    if (!window.confirm('Reset database? This will clear test incidents, investigations, and seed fresh records.')) return;

    try {
      await api.cleanDatabase(false);
      showToast('Database reset and cleanly seeded', 'success');
      loadIncidentsAndStats();
      loadAnalytics();
      setSelectedIncident(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // 10. Logout
  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentView('landing');
    window.location.hash = '#landing';
    showToast('Signed out successfully', 'info');
  };

  // View 1: Landing Page
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          user={user}
          onNavigateAuth={(mode) => {
            setAuthInitialMode(mode);
            setCurrentView('auth');
            window.location.hash = '#' + mode;
          }}
          onEnterDashboard={() => {
            setCurrentView('dashboard');
            window.location.hash = '#dashboard';
          }}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // View 2: Authentication
  if (currentView === 'auth') {
    return (
      <>
        <AuthPage
          initialMode={authInitialMode}
          onAuthSuccess={(authenticatedUser, token) => {
            setUser(authenticatedUser);
            saveSession(authenticatedUser, token);
            setCurrentView('dashboard');
            window.location.hash = '#dashboard';
          }}
          onNavigateLanding={() => {
            setCurrentView('landing');
            window.location.hash = '#landing';
          }}
          showToast={showToast}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Render current page based on activePath
  const renderPage = () => {
    switch (activePath) {
      case '/dashboard':
      case '/':
        return (
          <DashboardPage
            stats={stats}
            kpiData={kpiData}
            trafficData={trafficData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            loadingTraffic={loadingTraffic}
            geoData={geoData}
            httpStatusData={httpStatusData}
            methodData={methodData}
            endpoints={endpoints}
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            onUpdateStatus={handleUpdateStatus}
            loadingIncidents={loadingIncidents}
            onRefresh={() => { loadIncidentsAndStats(); loadAnalytics(); }}
            environment={environment}
          />
        );

      case '/incidents':
        return (
          <IncidentsPage
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            onUpdateStatus={handleUpdateStatus}
            isLoading={loadingIncidents}
            onRefresh={() => { loadIncidentsAndStats(); loadAnalytics(); }}
          />
        );

      case '/reports':
        return <IncidentReportsPage />;

      case '/code-intelligence':
        return <CodeIntelligencePage activeRepo={activeRepo} incidents={incidents} />;

      case '/fixes':
        return <FixesPage />;

      case '/automations':
        return <AutomationsPage />;

      case '/service-map':
        return <PlaceholderPage title="Service Map" description="Visual service dependency and communication topology" icon={Network} />;

      case '/dependency-graph':
        return <PlaceholderPage title="Dependency Graph" description="Package and module dependency visualization" icon={GitBranch} />;

      case '/pull-requests':
        return <PlaceholderPage title="Pull Requests" description="AI-generated pull requests with automated review" icon={GitBranch} />;

      case '/workflows':
        return <PlaceholderPage title="Workflows" description="Custom automation workflow builder" icon={Workflow} />;

      case '/settings':
        return <PlaceholderPage title="Settings" description="Platform configuration and preferences" icon={Settings} />;

      case '/integrations':
        return <PlaceholderPage title="Integrations" description="Third-party service integrations and webhooks" icon={Plug} />;

      default:
        return (
          <DashboardPage
            stats={stats}
            kpiData={kpiData}
            trafficData={trafficData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            loadingTraffic={loadingTraffic}
            geoData={geoData}
            httpStatusData={httpStatusData}
            methodData={methodData}
            endpoints={endpoints}
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            onUpdateStatus={handleUpdateStatus}
            loadingIncidents={loadingIncidents}
            onRefresh={() => { loadIncidentsAndStats(); loadAnalytics(); }}
            environment={environment}
          />
        );
    }
  };

  // View 3: Dashboard Shell
  return (
    <>
      <AppShell
        activePath={activePath}
        onNavigate={handleNavigate}
        breadcrumb={BREADCRUMBS[activePath] || ['Control Plane', 'Dashboard']}
        pageTitle={BREADCRUMBS[activePath]?.[BREADCRUMBS[activePath].length - 1] || 'Dashboard'}
        environment={environment}
        onSelectEnvironment={(env) => setEnvironment(env)}
        servicesHealth={servicesHealth}
        user={user}
        onOpenAuth={() => {
          setAuthInitialMode('signin');
          setCurrentView('auth');
          window.location.hash = '#auth';
        }}
        onLogout={handleLogout}
        onNavigateLanding={() => {
          setCurrentView('landing');
          window.location.hash = '#landing';
        }}
        onOpenKeys={() => setKeysModalOpen(true)}
        onOpenRepos={() => setRepoModalOpen(true)}
        onOpenSimulation={() => setSimulationModalOpen(true)}
        onCleanDb={handleCleanDb}
        badges={badges}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        onOpenNewProject={() => setProjectModalOpen(true)}
      >
        {renderPage()}
      </AppShell>

      {/* Incident Detail Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        investigation={investigation}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateStatus}
        onTriggerInvestigation={handleTriggerInvestigation}
        isInvestigating={isInvestigating}
        showToast={showToast}
      />

      {/* API Key Manager Modal */}
      <ApiKeyManagerModal
        isOpen={keysModalOpen}
        onClose={() => setKeysModalOpen(false)}
        project={activeProject}
        showToast={showToast}
      />

      {/* GitHub Repo Selector Modal */}
      <GitHubRepoModal
        isOpen={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        project={activeProject}
        activeRepo={activeRepo}
        onRepoSelected={(repo) => setActiveRepo(repo)}
        showToast={showToast}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onProjectCreated={(newProj) => {
          setProjects(prev => [...prev, newProj]);
          setActiveProject(newProj);
        }}
        showToast={showToast}
      />

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={simulationModalOpen}
        onClose={() => setSimulationModalOpen(false)}
        project={activeProject}
        showToast={showToast}
        onTriggerRefresh={() => { loadIncidentsAndStats(); loadAnalytics(); }}
        onTriggered={() => { loadIncidentsAndStats(); loadAnalytics(); }}
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
