import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Key, GitBranch, Play, RotateCcw,
  ChevronDown, LogOut, CheckCircle, AlertCircle, Plus, Github, Globe
} from 'lucide-react';

export function Navbar({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProject,
  environment = 'production',
  onSelectEnvironment,
  onOpenKeys,
  onOpenRepos,
  onOpenSimulation,
  onCleanDb,
  servicesHealth,
  user,
  onOpenAuth,
  onLogout,
  onNavigateLanding
}) {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [envMenuOpen, setEnvMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [healthMenuOpen, setHealthMenuOpen] = useState(false);

  const aiEngineOnline = servicesHealth?.['ai-engine']?.status === 'online';
  const sdkOnline = servicesHealth?.['sdk-service']?.status === 'online';
  const allEnginesHealthy = aiEngineOnline;

  return (
    <header className="sticky top-0 z-30 bg-surface-main border-b border-border-subtle shadow-soft-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Project Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shadow-soft-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-text-primary text-base tracking-tight leading-none flex items-center gap-1.5">
                Control Plane
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                  Autonomous SRE
                </span>
              </div>
              <div className="text-[11px] text-text-secondary mt-0.5 font-medium">Incident Defense Platform</div>
            </div>
          </div>

          <div className="h-5 w-px bg-border-subtle hidden sm:block" />

          {/* Project Switcher */}
          <div className="relative">
            <button
              onClick={() => setProjectMenuOpen(!projectMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle hover:border-text-secondary/30 bg-surface-secondary text-xs font-medium text-text-primary transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-accent-primary" />
              <span className="max-w-[140px] truncate">{activeProject?.name || 'Select Project'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            </button>

            <AnimatePresence>
              {projectMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-surface-main border border-border-subtle shadow-soft-lg py-1 z-40"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Select Project
                  </div>
                  {projects.map(p => (
                    <button
                      key={p._id}
                      onClick={() => {
                        onSelectProject(p);
                        setProjectMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-secondary transition-colors ${
                        activeProject?._id === p._id ? 'text-accent-primary font-semibold bg-accent-primary/5' : 'text-text-primary'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {activeProject?._id === p._id && <CheckCircle className="w-3.5 h-3.5 text-accent-primary" />}
                    </button>
                  ))}
                  <div className="border-t border-border-subtle my-1" />
                  <button
                    onClick={() => {
                      setProjectMenuOpen(false);
                      onOpenNewProject();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-accent-primary font-medium flex items-center gap-2 hover:bg-accent-primary/5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Project</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Environment Selector */}
          <div className="relative">
            <button
              onClick={() => setEnvMenuOpen(!envMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border-subtle hover:border-text-secondary/30 bg-surface-secondary text-xs font-medium text-text-primary transition-colors"
              title="Filter by Environment"
            >
              <span className={`w-2 h-2 rounded-full ${
                environment === 'production' ? 'bg-status-success' :
                environment === 'staging' ? 'bg-status-warning' : 'bg-accent-primary'
              }`} />
              <span className="capitalize">{environment}</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            </button>

            <AnimatePresence>
              {envMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute left-0 mt-2 w-44 rounded-xl bg-surface-main border border-border-subtle shadow-soft-lg py-1 z-40"
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Environment
                  </div>
                  {[
                    { id: 'production', label: 'Production', dot: 'bg-status-success' },
                    { id: 'staging', label: 'Staging', dot: 'bg-status-warning' },
                    { id: 'development', label: 'Development', dot: 'bg-accent-primary' },
                  ].map((env) => (
                    <button
                      key={env.id}
                      onClick={() => {
                        onSelectEnvironment?.(env.id);
                        setEnvMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-secondary transition-colors ${
                        environment === env.id ? 'text-accent-primary font-semibold bg-accent-primary/5' : 'text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${env.dot}`} />
                        <span>{env.label}</span>
                      </div>
                      {environment === env.id && <CheckCircle className="w-3.5 h-3.5 text-accent-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions, Health, User */}
        <div className="flex items-center gap-2.5">
          {/* Health Status Pill */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setHealthMenuOpen(!healthMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface-main hover:bg-surface-secondary text-xs transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${allEnginesHealthy ? 'bg-status-success animate-pulse' : 'bg-status-warning'}`} />
              <span className="text-text-secondary text-[11px] font-medium">
                {allEnginesHealthy ? 'Engines Online' : 'Services Check'}
              </span>
            </button>

            <AnimatePresence>
              {healthMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-main border border-border-subtle shadow-soft-lg p-3 z-40 text-xs"
                >
                  <div className="font-semibold text-text-primary mb-2">Engine Health Matrix</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-secondary">Main Backend (:8080)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-status-success/10 text-status-success">
                        ONLINE
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                      <span className="text-text-secondary">AI Reasoner (:8000)</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        aiEngineOnline ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'
                      }`}>
                        {aiEngineOnline ? 'READY' : 'STANDALONE'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-text-secondary">SDK Service (:3001)</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        sdkOnline ? 'bg-status-success/10 text-status-success' : 'bg-surface-secondary text-text-secondary'
                      }`}>
                        {sdkOnline ? 'EMITTING' : 'IDLE'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Action: API Keys */}
          <button
            onClick={onOpenKeys}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle hover:border-accent-primary/40 hover:bg-accent-primary/5 text-xs font-medium text-text-primary transition-colors"
            title="Manage API Keys"
          >
            <Key className="w-3.5 h-3.5 text-accent-primary" />
            <span className="hidden sm:inline">API Keys</span>
          </button>

          {/* Quick Action: GitHub Repos */}
          <button
            onClick={onOpenRepos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle hover:border-accent-primary/40 hover:bg-accent-primary/5 text-xs font-medium text-text-primary transition-colors"
            title="Repository & Codebase Indexing"
          >
            <GitBranch className="w-3.5 h-3.5 text-accent-primary" />
            <span className="hidden sm:inline">Repo Index</span>
          </button>

          {/* Quick Action: Simulate Traffic */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-soft-xs transition-colors"
            title="Simulate Normal & Fault Traffic"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate</span>
          </button>

          {/* Quick Action: Clean DB */}
          <button
            onClick={onCleanDb}
            className="p-2 rounded-lg border border-border-subtle hover:bg-status-critical/5 hover:border-status-critical/30 hover:text-status-critical text-text-secondary transition-colors"
            title="Reset & Clean Database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-border-subtle" />

          {/* User Auth Profile Badge */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-7 h-7 rounded-full border border-border-subtle object-cover"
                />
                <span className="text-xs font-semibold text-text-primary hidden sm:inline max-w-[100px] truncate">
                  {user.displayName || user.username}
                </span>
                <ChevronDown className="w-3 h-3 text-text-secondary" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-surface-main border border-border-subtle shadow-soft-lg py-1.5 z-40 text-xs"
                  >
                    <div className="px-3 py-2 border-b border-border-subtle">
                      <div className="font-semibold text-text-primary truncate">{user.displayName || user.username}</div>
                      <div className="text-[11px] text-text-secondary truncate">{user.email || `@${user.username}`}</div>
                      {user.role && (
                        <div className="mt-1 text-[10px] font-mono text-accent-primary bg-accent-primary/10 px-1.5 py-0.5 rounded inline-block">
                          {user.role}
                        </div>
                      )}
                    </div>
                    {onNavigateLanding && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigateLanding();
                        }}
                        className="w-full text-left px-3 py-2 text-text-primary hover:bg-surface-secondary flex items-center gap-2 transition-colors border-b border-border-subtle"
                      >
                        <Globe className="w-3.5 h-3.5 text-accent-primary" />
                        <span>Sentinel Overview</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-status-critical hover:bg-status-critical/5 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onNavigateLanding && (
                <button
                  onClick={onNavigateLanding}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-subtle hover:bg-surface-secondary text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Overview</span>
                </button>
              )}
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary text-white text-xs font-semibold shadow-soft-xs hover:bg-accent-hover transition-colors"
              >
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
