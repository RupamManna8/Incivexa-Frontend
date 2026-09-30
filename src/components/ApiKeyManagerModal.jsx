import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Key, Plus, Trash2, Copy, Check, ShieldAlert,
  Code2, Clock, CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';

export function ApiKeyManagerModal({
  isOpen,
  onClose,
  project,
  showToast
}) {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [newKeyData, setNewKeyData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' | 'snippet'

  useEffect(() => {
    if (isOpen && project?._id) {
      loadKeys();
    }
  }, [isOpen, project?._id]);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const res = await api.getProjectKeys(project._id);
      setKeys(res.keys || []);
    } catch (err) {
      console.error('Failed to load keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!project?._id) return;

    try {
      const res = await api.createProjectKey(project._id, keyName || 'Production Ingestion Key');
      setNewKeyData(res.apiKey);
      setKeyName('');
      loadKeys();
      showToast('API Key generated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key? Apps using it will be rejected.')) return;

    try {
      await api.revokeProjectKey(project._id, keyId);
      loadKeys();
      showToast('API key revoked', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast('Copied to clipboard', 'info');
  };

  if (!isOpen) return null;

  const integrationSnippet = `import { initTelemetry, captureException } from '@platform/sdk';

// Initialize the telemetry agent
initTelemetry({
  endpoint: '${window.location.origin.replace(':5173', ':8080')}/api/v1/projects/${project?._id || 'PROJECT_ID'}/ingest',
  apiKey: '${newKeyData?.rawKey || 'aim_live_your_api_key_here'}',
  service: '${project?.name?.toLowerCase().replace(/\\s+/g, '-') || 'my-service'}',
  environment: 'production'
});`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-surface-main rounded-2xl border border-border-subtle shadow-soft-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">API Key Management</h3>
              <p className="text-xs text-text-secondary">
                Project: <span className="font-semibold text-text-primary">{project?.name}</span>
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

        {/* Tab Toggle */}
        <div className="flex border-b border-border-subtle px-6 bg-surface-secondary/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'keys' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Active Keys ({keys.length})
          </button>
          <button
            onClick={() => setActiveTab('snippet')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'snippet' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            SDK Integration Guide
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'keys' && (
            <>
              {/* Secret Key Reveal Banner (Shown Once after generation) */}
              <AnimatePresence>
                {newKeyData && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/30 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-accent-primary">
                      <ShieldAlert className="w-4 h-4" />
                      Save Your Secret Ingestion Key
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      This key will only be shown once. Copy and store it securely in your client service environment.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={newKeyData.rawKey}
                        className="w-full bg-surface-main px-3 py-2 border border-accent-primary/40 rounded-lg font-mono text-xs text-text-primary font-semibold select-all"
                      />
                      <button
                        onClick={() => copyToClipboard(newKeyData.rawKey)}
                        className="px-3 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1 flex-shrink-0 shadow-soft-xs"
                      >
                        {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate New Key Form */}
              <form onSubmit={handleCreateKey} className="flex items-center gap-3">
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Key label (e.g., Payment Microservice Prod)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-secondary text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/10"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft-xs flex-shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Key</span>
                </button>
              </form>

              {/* Key List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Provisioned Keys
                </div>

                {keys.length === 0 ? (
                  <div className="p-8 text-center bg-surface-secondary/40 border border-border-subtle rounded-xl text-xs text-text-secondary">
                    No active API keys found for this project. Generate one above.
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden bg-surface-main">
                    {keys.map((k) => (
                      <div key={k._id || k.prefix} className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-secondary/50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-text-primary">
                              {k.prefix}...
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-status-success/10 text-status-success">
                              {k.status || 'ACTIVE'}
                            </span>
                          </div>
                          <div className="text-[11px] text-text-secondary flex items-center gap-3">
                            <span>{k.label || 'Ingestion API Key'}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-text-secondary" />
                              Last used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRevokeKey(k._id)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-status-critical hover:bg-status-critical/10 transition-colors"
                          title="Revoke API Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'snippet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  SDK Telemetry Agent Snippet
                </span>
                <button
                  onClick={() => copyToClipboard(integrationSnippet)}
                  className="text-xs text-accent-primary font-semibold flex items-center gap-1 hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <div className="bg-surface-secondary border border-border-subtle rounded-xl p-4 font-mono text-xs text-text-primary overflow-x-auto leading-relaxed">
                <pre>{integrationSnippet}</pre>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/60 border border-border-subtle text-xs text-text-secondary space-y-1">
                <div className="font-semibold text-text-primary">High-Throughput Guarantee:</div>
                <div>
                  The client SDK emits telemetry events asynchronously in small batches. It will never block your application's request processing loop.
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
