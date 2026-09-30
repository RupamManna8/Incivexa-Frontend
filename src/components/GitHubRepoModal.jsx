import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, GitBranch, Search, Lock, Globe, Star, CheckCircle2,
  RefreshCw, Cpu, ExternalLink, HardDrive
} from 'lucide-react';
import { api } from '../api/client';

export function GitHubRepoModal({
  isOpen,
  onClose,
  project,
  user,
  activeRepo,
  onSelectRepo,
  showToast
}) {
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadRepos();
    }
  }, [isOpen, user]);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const res = await api.getGitHubRepos();
      setRepos(res.repositories || []);
    } catch (err) {
      console.warn('Could not fetch repos from GitHub API:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepo = async (repo) => {
    setIndexing(true);
    try {
      const payload = {
        repoUrl: repo.cloneUrl || repo.htmlUrl || repo.repoUrl,
        name: repo.name,
        fullName: repo.fullName || repo.name,
        defaultBranch: repo.defaultBranch || 'main',
        projectId: project?._id,
        commitSha: 'HEAD'
      };

      const res = await api.selectRepository(payload);
      onSelectRepo(res.repository || payload);
      showToast(`Repository ${repo.name} selected. Codebase indexing queued!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setTimeout(() => setIndexing(false), 2000);
    }
  };

  const handleSelectLocalDemo = () => {
    const demoRepo = {
      name: 'demo-payment-app',
      fullName: 'demo/demo-payment-app',
      repoUrl: './demo-repo',
      defaultBranch: 'main',
      status: 'READY',
      indexedCommit: 'HEAD'
    };
    handleSelectRepo(demoRepo);
  };

  if (!isOpen) return null;

  const filtered = repos.filter(r =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-surface-main rounded-2xl border border-border-subtle shadow-soft-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Repository & AST Indexing</h3>
              <p className="text-xs text-text-secondary">
                Select a repository to index for autonomous root-cause investigation
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

        {/* Active Monitored Repo Card */}
        {activeRepo && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-surface-secondary/70 border border-border-subtle flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent-primary" />
                Active Monitored Repository
              </div>
              <div className="font-semibold text-sm text-text-primary truncate">
                {activeRepo.name}
                <span className="ml-2 font-mono text-xs text-text-secondary font-normal">
                  ({activeRepo.defaultBranch || 'main'})
                </span>
              </div>
              <div className="text-xs text-text-secondary font-mono truncate mt-0.5">
                {activeRepo.repoUrl}
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                activeRepo.status === 'READY'
                  ? 'bg-status-success/10 text-status-success'
                  : 'bg-status-warning/10 text-status-warning animate-pulse'
              }`}>
                {activeRepo.status || 'READY'}
              </span>
            </div>
          </div>
        )}

        {/* Search & Actions Bar */}
        <div className="p-6 pb-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your GitHub repositories..."
                className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50"
              />
            </div>
            <button
              onClick={handleSelectLocalDemo}
              className="px-3.5 py-2 rounded-xl border border-border-subtle hover:bg-surface-secondary text-xs font-semibold text-text-primary flex items-center gap-1.5 transition-colors flex-shrink-0"
              title="Use local demo-repo"
            >
              <HardDrive className="w-3.5 h-3.5 text-accent-primary" />
              <span>Use Demo Repo</span>
            </button>
          </div>
        </div>

        {/* Repositories List */}
        <div className="p-6 pt-2 overflow-y-auto space-y-2 flex-1">
          {loading ? (
            <div className="p-12 text-center text-xs text-text-secondary flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-accent-primary" />
              <span>Loading repositories from GitHub...</span>
            </div>
          ) : !user ? (
            <div className="p-8 text-center bg-surface-secondary/40 border border-border-subtle rounded-xl text-xs text-text-secondary space-y-2">
              <div>Connect your GitHub account from the top navbar to browse all your repositories.</div>
              <div>Or click <strong>"Use Demo Repo"</strong> above to test with the built-in demo order service.</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center bg-surface-secondary/40 border border-border-subtle rounded-xl text-xs text-text-secondary">
              No repositories found matching "{search}".
            </div>
          ) : (
            <div className="divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden bg-surface-main">
              {filtered.map((repo) => {
                const isSelected = activeRepo?.repoUrl === (repo.cloneUrl || repo.htmlUrl);
                return (
                  <div
                    key={repo.id || repo.fullName}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-secondary/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-text-primary truncate">
                          {repo.fullName || repo.name}
                        </span>
                        {repo.isPrivate ? (
                          <span className="text-text-secondary" title="Private"><Lock className="w-3 h-3" /></span>
                        ) : (
                          <span className="text-text-secondary" title="Public"><Globe className="w-3 h-3" /></span>
                        )}
                        <span className="text-[11px] text-text-secondary font-mono">
                          branch: {repo.defaultBranch || 'main'}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="text-[11px] text-text-secondary truncate">{repo.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleSelectRepo(repo)}
                      disabled={isSelected || indexing}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-status-success/10 text-status-success cursor-default'
                          : 'bg-accent-primary hover:bg-accent-hover text-white shadow-soft-xs'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Select & Index</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
