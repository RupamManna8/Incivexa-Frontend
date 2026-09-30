import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({
  children,
  activePath,
  onNavigate,
  breadcrumb = [],
  pageTitle = 'Dashboard',
  // Passthrough props
  environment,
  onSelectEnvironment,
  servicesHealth,
  user,
  onOpenAuth,
  onLogout,
  onNavigateLanding,
  onOpenKeys,
  onOpenRepos,
  onOpenSimulation,
  onCleanDb,
  notifications = [],
  badges = {},
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProject,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        activePath={activePath}
        onNavigate={onNavigate}
        badges={badges}
        user={user}
        environment={environment}
      />

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin-left] duration-200 ease-in-out ${
          sidebarCollapsed ? 'ml-[64px]' : 'ml-[240px]'
        }`}
      >
        {/* Top Bar */}
        <TopBar
          breadcrumb={breadcrumb}
          pageTitle={pageTitle}
          environment={environment}
          onSelectEnvironment={onSelectEnvironment}
          servicesHealth={servicesHealth}
          user={user}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
          onNavigateLanding={onNavigateLanding}
          onOpenKeys={onOpenKeys}
          onOpenRepos={onOpenRepos}
          onOpenSimulation={onOpenSimulation}
          onCleanDb={onCleanDb}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          notifications={notifications}
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          onOpenNewProject={onOpenNewProject}
        />

        {/* Page content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <CommandPalette
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={(path) => {
            onNavigate(path);
            setCommandPaletteOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Minimal command palette
function CommandPalette({ onClose, onNavigate }) {
  const [query, setQuery] = useState('');

  const commands = [
    { label: 'Go to Dashboard', path: '/dashboard', keywords: 'overview home' },
    { label: 'Go to Incidents', path: '/incidents', keywords: 'alerts errors' },
    { label: 'Go to Incident Reports', path: '/reports', keywords: 'history' },
    { label: 'Go to Code Intelligence', path: '/code-intelligence', keywords: 'code search' },
    { label: 'Go to Fixes', path: '/fixes', keywords: 'remediation patches' },
    { label: 'Go to Automations', path: '/automations', keywords: 'workflows' },
    { label: 'Go to Settings', path: '/settings', keywords: 'config' },
    { label: 'Go to API Keys', path: '/api-keys', keywords: 'tokens' },
  ];

  const filtered = commands.filter(c =>
    !query || c.label.toLowerCase().includes(query.toLowerCase()) || c.keywords.includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filtered.length > 0) onNavigate(filtered[0].path);
            }}
            placeholder="Search commands..."
            className="flex-1 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
          />
          <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-mono text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-1">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.path}
              onClick={() => onNavigate(cmd.path)}
              className={`w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 ${
                i === 0 && query ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
            >
              <span className="flex-1">{cmd.label}</span>
              <span className="text-[10px] text-gray-400">↵</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-gray-400">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
