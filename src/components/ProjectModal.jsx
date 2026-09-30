import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FolderPlus, ArrowRight } from 'lucide-react';
import { api } from '../api/client';

export function ProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
  showToast
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await api.createProject({
        name: name.trim(),
        description: description.trim(),
        repoUrl: repoUrl.trim() || './demo-repo'
      });

      if (res.project) {
        onProjectCreated(res.project, res.apiKey);
        onClose();
        setName('');
        setDescription('');
        setRepoUrl('');
        showToast(`Project "${res.project.name}" created with default API key!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create project', 'error');
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
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Create New Project</h3>
              <p className="text-xs text-text-secondary">Group telemetry and separate incident environments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Checkout & Payments Service"
              className="w-full px-3.5 py-2 bg-surface-secondary border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Core billing and payment processor cluster"
              className="w-full px-3.5 py-2 bg-surface-secondary border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Target Repository URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g. https://github.com/my-org/payment-service or ./demo-repo"
              className="w-full px-3.5 py-2 bg-surface-secondary border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-soft-xs transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Creating Project...' : 'Create Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
