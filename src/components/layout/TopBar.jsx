import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Bell, ChevronDown, ChevronRight,
  CheckCircle2, LogOut, Globe, User, Command,
  Settings, Play, RotateCcw, GitBranch, Key, Zap
} from 'lucide-react';

export function TopBar({
  breadcrumb = [],
  pageTitle = 'Dashboard',
  environment = 'production',
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
  onOpenCommandPalette,
  notifications = [],
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProject,
}) {
  const [envOpen, setEnvOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const envRef = useRef(null);
  const userRef = useRef(null);
  const notifRef = useRef(null);
  const projectRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (envRef.current && !envRef.current.contains(e.target)) setEnvOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target)) setProjectOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette?.();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onOpenCommandPalette]);

  const aiEngineOnline = servicesHealth?.['ai-engine']?.status === 'online';
  const allSystemsOk = aiEngineOnline !== false;

  const environments = [
    { id: 'production', label: 'Production', dot: 'bg-green-500' },
    { id: 'staging', label: 'Staging', dot: 'bg-amber-500' },
    { id: 'development', label: 'Development', dot: 'bg-indigo-500' },
  ];

  const notifCount = notifications.length;

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4 flex-shrink-0 z-30">
      {/* Left: Breadcrumb + Page */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Project selector (compact) */}
        <div ref={projectRef} className="relative">
          <button
            onClick={() => setProjectOpen(!projectOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span className="max-w-[120px] truncate">{activeProject?.name || 'Select Project'}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {projectOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Projects
              </div>
              {projects?.map(p => (
                <button
                  key={p._id}
                  onClick={() => { onSelectProject(p); setProjectOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    activeProject?._id === p._id ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  {activeProject?._id === p._id && <CheckCircle2 className="w-3 h-3 text-indigo-600 flex-shrink-0" />}
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => { setProjectOpen(false); onOpenNewProject?.(); }}
                  className="w-full text-left px-3 py-1.5 text-[12px] text-indigo-600 font-medium hover:bg-indigo-50/50 transition-colors"
                >
                  + Create Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Breadcrumb separator */}
        <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />

        {/* Breadcrumb trail */}
        <div className="flex items-center gap-1 text-[12px] text-gray-500 min-w-0">
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
              {i === breadcrumb.length - 1 ? (
                <span className="font-semibold text-gray-900 truncate">{crumb}</span>
              ) : (
                <span className="text-gray-500 truncate">{crumb}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Center: Environment selector */}
      <div className="flex items-center gap-3">
        <div ref={envRef} className="relative">
          <button
            onClick={() => setEnvOpen(!envOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              environment === 'production' ? 'bg-green-500' :
              environment === 'staging' ? 'bg-amber-500' : 'bg-indigo-500'
            }`} />
            <span className="capitalize">{environment}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {envOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              {environments.map(env => (
                <button
                  key={env.id}
                  onClick={() => { onSelectEnvironment?.(env.id); setEnvOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                    environment === env.id ? 'text-indigo-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${env.dot}`} />
                  <span>{env.label}</span>
                  {environment === env.id && <CheckCircle2 className="w-3 h-3 text-indigo-600 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Status + Actions + Notifications + User */}
      <div className="flex items-center gap-2">
        {/* System status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-500 font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${allSystemsOk ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span>{allSystemsOk ? 'All Systems Operational' : 'Degraded'}</span>
        </div>

        <div className="h-4 w-px bg-gray-200 hidden lg:block" />

        {/* Quick actions */}
        <button
          onClick={onOpenRepos}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title="Repository & Codebase Indexing"
        >
          <GitBranch className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSimulation}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title="Simulate Traffic"
        >
          <Zap className="w-4 h-4" />
        </button>

        <button
          onClick={onCleanDb}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title="Reset Database"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-200" />

        {/* Command palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-gray-50 text-[11px] text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Command Palette (⌘K)"
        >
          <Search className="w-3 h-3" />
          <span>Search</span>
          <kbd className="ml-1 px-1 py-0.5 rounded border border-gray-200 bg-white text-[9px] font-mono text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="px-3 py-2 border-b border-gray-100 text-[12px] font-semibold text-gray-900">
                Notifications
              </div>
              {notifCount === 0 ? (
                <div className="px-3 py-6 text-center text-[12px] text-gray-400">
                  No new notifications
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <div className="text-[12px] text-gray-700">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User menu */}
        {user ? (
          <div ref={userRef} className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="flex items-center gap-1.5 p-1 rounded-md hover:bg-gray-50 transition-colors"
            >
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                alt={user.username}
                className="w-6 h-6 rounded-full border border-gray-200 object-cover"
              />
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="text-[12px] font-semibold text-gray-900 truncate">
                    {user.displayName || user.username}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {user.email || `@${user.username}`}
                  </div>
                </div>
                {onNavigateLanding && (
                  <button
                    onClick={() => { setUserOpen(false); onNavigateLanding(); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    Overview
                  </button>
                )}
                <button
                  onClick={() => { setUserOpen(false); onLogout(); }}
                  className="w-full text-left px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-[12px] font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
