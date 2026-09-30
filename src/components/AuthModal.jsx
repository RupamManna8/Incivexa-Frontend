import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Github, Key, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api, API_BASE } from '../api/client';

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  showToast
}) {
  const [patToken, setPatToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleOAuthLogin = () => {
    window.location.href = `${API_BASE}/api/v1/auth/github`;
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    if (!patToken.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.verifyToken(patToken.trim());
      if (res.user) {
        onAuthSuccess(res.user, patToken.trim());
        onClose();
        showToast(`Connected as @${res.user.username}`, 'success');
      } else {
        setError(res.error || 'Failed to authenticate token');
      }
    } catch (err) {
      setError(err.message || 'Invalid GitHub token. Please check permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-surface-main rounded-2xl border border-border-subtle shadow-soft-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-text-primary/5 border border-border-subtle flex items-center justify-center text-text-primary">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Connect GitHub</h3>
              <p className="text-xs text-text-secondary">
                Enables repository AST indexing and PR dispatch
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

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-status-critical/10 border border-status-critical/20 flex items-start gap-2.5 text-xs text-status-critical font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Option 1: 1-Click OAuth */}
          <div>
            <button
              onClick={handleOAuthLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-text-primary hover:bg-text-primary/90 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-soft-xs transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Sign in with GitHub (OAuth)</span>
            </button>
            <p className="text-[11px] text-text-secondary text-center mt-1.5">
              1-click authorization with your active GitHub browser session.
            </p>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-border-subtle flex-1" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">or</span>
            <div className="h-px bg-border-subtle flex-1" />
          </div>

          {/* Option 2: PAT Input */}
          <form onSubmit={handleTokenSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Personal Access Token (PAT)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={patToken}
                  onChange={(e) => setPatToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !patToken.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-soft-xs transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Token...' : 'Authenticate Token'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3 bg-surface-secondary rounded-xl border border-border-subtle text-[11px] text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">Required scopes:</span> <code>repo</code>, <code>read:user</code>. Generated from GitHub Settings → Developer Settings → Personal Access Tokens.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
