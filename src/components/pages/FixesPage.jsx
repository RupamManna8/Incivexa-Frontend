import React, { useState } from 'react';
import {
  Wrench, CheckCircle2, Clock, AlertTriangle, GitPullRequest,
  Shield, FlaskConical, Eye, ChevronRight, Bot, Code2, ExternalLink
} from 'lucide-react';

const MOCK_FIXES = [
  {
    id: 'FIX-1024',
    incidentId: 'INC-2048',
    rootCause: 'Database connection pool exhaustion',
    proposedFix: 'Increase pool max to 50, add connection acquisition timeout (5s), implement connection cleanup on idle.',
    confidence: 91,
    tests: { passed: 18, failed: 0 },
    security: 'Passed',
    pr: '#482',
    status: 'AWAITING_REVIEW',
    service: 'checkout-service',
    createdAt: '2026-09-28T14:45:00Z',
  },
  {
    id: 'FIX-1021',
    incidentId: 'INC-2041',
    rootCause: 'Null pointer on missing billing address field',
    proposedFix: 'Add optional chaining for billing address access, fallback to default zip code.',
    confidence: 96,
    tests: { passed: 12, failed: 0 },
    security: 'Passed',
    pr: '#479',
    status: 'MERGED',
    service: 'payment-service',
    createdAt: '2026-09-27T09:30:00Z',
  },
  {
    id: 'FIX-1018',
    incidentId: 'INC-2036',
    rootCause: 'Rate limit exceeded on email provider API',
    proposedFix: 'Implement exponential backoff with jitter, add circuit breaker for email provider.',
    confidence: 84,
    tests: { passed: 8, failed: 0 },
    security: 'Passed',
    pr: null,
    status: 'TESTING',
    service: 'notification-service',
    createdAt: '2026-09-26T17:00:00Z',
  },
  {
    id: 'FIX-1015',
    incidentId: 'INC-2029',
    rootCause: 'JWT token validation regression after dependency update',
    proposedFix: 'Pin jsonwebtoken to v9.0.0, add regression test for token verification.',
    confidence: 88,
    tests: { passed: 24, failed: 2 },
    security: 'Warning',
    pr: '#471',
    status: 'GENERATED',
    service: 'auth-service',
    createdAt: '2026-09-25T02:30:00Z',
  },
];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'GENERATED', label: 'Generated' },
  { id: 'TESTING', label: 'Testing' },
  { id: 'AWAITING_REVIEW', label: 'Awaiting Review' },
  { id: 'MERGED', label: 'Merged' },
  { id: 'REJECTED', label: 'Rejected' },
];

export function FixesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? MOCK_FIXES
    : MOCK_FIXES.filter(f => f.status === activeTab);

  const statusConfig = {
    GENERATED: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Generated' },
    TESTING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Testing' },
    AWAITING_REVIEW: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Awaiting Review' },
    MERGED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Merged' },
    REJECTED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' },
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Autonomous Fixes</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          AI-generated remediation patches with automated testing and security validation
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-0">
        {TABS.map(tab => {
          const count = tab.id === 'all' ? MOCK_FIXES.length : MOCK_FIXES.filter(f => f.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-[12px] font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fix cards */}
      <div className="space-y-3">
        {filtered.map(fix => {
          const sc = statusConfig[fix.status] || statusConfig.GENERATED;
          return (
            <div key={fix.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <Bot className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-gray-900">{fix.id}</span>
                      <span className="text-[11px] text-gray-400">·</span>
                      <span className="text-[12px] font-mono text-indigo-600">{fix.incidentId}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      <span className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-gray-200">{fix.service}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
                  {sc.label}
                </span>
              </div>

              {/* Root cause + proposed fix */}
              <div className="mb-3 space-y-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Root Cause</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{fix.rootCause}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">AI Proposed Fix</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{fix.proposedFix}</p>
                </div>
              </div>

              {/* Metrics row */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                {/* Confidence */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-gray-500">Confidence:</span>
                  <span className={`font-semibold ${fix.confidence >= 90 ? 'text-green-600' : fix.confidence >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                    {fix.confidence}%
                  </span>
                </div>

                {/* Tests */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <FlaskConical className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-gray-500">Tests:</span>
                  <span className="font-semibold text-green-600">{fix.tests.passed} passed</span>
                  {fix.tests.failed > 0 && (
                    <span className="font-semibold text-red-600">{fix.tests.failed} failed</span>
                  )}
                </div>

                {/* Security */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-gray-500">Security:</span>
                  <span className={`font-semibold ${fix.security === 'Passed' ? 'text-green-600' : 'text-amber-600'}`}>
                    {fix.security}
                  </span>
                </div>

                {/* PR */}
                {fix.pr && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <GitPullRequest className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-gray-500">PR:</span>
                    <span className="font-semibold text-indigo-600">{fix.pr}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="ml-auto flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded-md text-[11px] font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    View Diff
                  </button>
                  {fix.status === 'AWAITING_REVIEW' && (
                    <button className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                      Review Fix
                    </button>
                  )}
                  {fix.pr && (
                    <button className="px-2.5 py-1 rounded-md text-[11px] font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors">
                      View PR
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Wrench className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-[13px] text-gray-500">No fixes match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
