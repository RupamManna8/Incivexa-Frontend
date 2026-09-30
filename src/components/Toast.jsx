import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-status-success flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-status-critical flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-accent-primary flex-shrink-0" />
  };

  const borders = {
    success: 'border-status-success/30 bg-white',
    warning: 'border-status-warning/30 bg-white',
    error: 'border-status-critical/30 bg-white',
    info: 'border-accent-primary/30 bg-white'
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-soft-lg ${borders[toast.type || 'info']} min-w-[320px] max-w-md`}
        >
          {icons[toast.type || 'info']}
          <div className="flex-1 text-sm text-text-primary font-medium">
            {toast.message}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
