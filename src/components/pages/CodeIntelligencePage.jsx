import React, { useState } from 'react';
import {
  Code2, Search, GitBranch, File, FolderOpen, ChevronRight,
  ChevronDown, AlertTriangle, Database, Cpu, Bug, Hash,
  ArrowRight, ExternalLink, BookOpen
} from 'lucide-react';

export function CodeIntelligencePage({ activeRepo, incidents = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeTab, setActiveTab] = useState('explorer');

  const stats = {
    repositories: 12,
    services: 27,
    dependencies: 184,
    codeRisks: incidents.filter(i => (i.severity || '').toUpperCase() === 'CRITICAL' || (i.severity || '').toUpperCase() === 'HIGH').length || 4,
  };

  const repoName = activeRepo?.name || 'urbanvoltt-backend';
  const branch = activeRepo?.defaultBranch || 'production';

  // Mock file tree
  const fileTree = [
    { name: 'src', type: 'dir', children: [
      { name: 'controllers', type: 'dir', children: [
        { name: 'payment.controller.ts', type: 'file', issues: 2, lines: 245 },
        { name: 'order.controller.ts', type: 'file', issues: 0, lines: 189 },
        { name: 'auth.controller.ts', type: 'file', issues: 0, lines: 156 },
      ]},
      { name: 'services', type: 'dir', children: [
        { name: 'PaymentService.ts', type: 'file', issues: 1, lines: 312 },
        { name: 'DatabaseClient.ts', type: 'file', issues: 3, lines: 198 },
        { name: 'OrderService.ts', type: 'file', issues: 0, lines: 267 },
      ]},
      { name: 'middleware', type: 'dir', children: [
        { name: 'auth.middleware.ts', type: 'file', issues: 0, lines: 87 },
        { name: 'rateLimit.middleware.ts', type: 'file', issues: 0, lines: 54 },
      ]},
      { name: 'server.ts', type: 'file', issues: 0, lines: 45 },
    ]},
    { name: 'tests', type: 'dir', children: [
      { name: 'payment.test.ts', type: 'file', issues: 0, lines: 134 },
      { name: 'order.test.ts', type: 'file', issues: 0, lines: 98 },
    ]},
    { name: 'package.json', type: 'file', issues: 0, lines: 42 },
  ];

  // Mock incident trace
  const incidentTrace = {
    id: 'INC-2048',
    endpoint: '/api/payment',
    chain: [
      { file: 'payment.controller.ts', fn: 'handlePayment()', line: 42, type: 'entry' },
      { file: 'PaymentService.ts', fn: 'PaymentService.process()', line: 87, type: 'call' },
      { file: 'DatabaseClient.ts', fn: 'DatabaseClient.query()', line: 134, type: 'call' },
      { file: 'DatabaseClient.ts', fn: 'ConnectionPool.acquire()', line: 156, type: 'fault', error: 'Connection Pool Exhausted' },
    ]
  };

  const FileTreeNode = ({ node, depth = 0 }) => {
    const [open, setOpen] = useState(depth < 2);
    const isDir = node.type === 'dir';

    return (
      <div>
        <button
          onClick={() => isDir && setOpen(!open)}
          className={`w-full text-left flex items-center gap-1.5 py-1 px-2 hover:bg-gray-50 rounded-md transition-colors text-[12px] group ${
            node.issues > 0 ? 'text-amber-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isDir ? (
            open ? <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          ) : (
            <span className="w-3" />
          )}
          {isDir ? (
            <FolderOpen className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          ) : (
            <File className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          )}
          <span className={`truncate ${isDir ? 'font-medium' : ''}`}>{node.name}</span>
          {node.issues > 0 && (
            <span className="ml-auto flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold">
              {node.issues}
            </span>
          )}
          {!isDir && node.lines && (
            <span className="ml-auto text-[10px] text-gray-400 group-hover:text-gray-500 flex-shrink-0">
              {node.lines}L
            </span>
          )}
        </button>
        {isDir && open && node.children?.map((child, i) => (
          <FileTreeNode key={child.name + i} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Code Intelligence</h1>
          <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-500">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" />
              {repoName}
            </span>
            <span className="text-gray-300">·</span>
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 border border-gray-200">
              {branch}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Repositories', value: stats.repositories, icon: Database },
          { label: 'Services', value: stats.services, icon: Cpu },
          { label: 'Dependencies', value: stats.dependencies, icon: Hash },
          { label: 'Recent Code Risks', value: stats.codeRisks, icon: Bug, warning: stats.codeRisks > 0 },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.warning ? 'text-amber-500' : 'text-gray-400'}`} />
            </div>
            <div className={`text-xl font-semibold mt-1 ${s.warning ? 'text-amber-600' : 'text-gray-900'}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: File explorer */}
        <div className="col-span-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-gray-900">Repository Explorer</span>
            <div className="relative">
              <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="pl-6 pr-2 py-1 w-36 bg-gray-50 border border-gray-200 rounded-md text-[11px] text-gray-700 focus:outline-none focus:border-indigo-300 transition-colors"
              />
            </div>
          </div>
          <div className="p-2 max-h-[500px] overflow-y-auto">
            {fileTree.map((node, i) => (
              <FileTreeNode key={node.name + i} node={node} />
            ))}
          </div>
        </div>

        {/* Right: Incident trace + AI analysis */}
        <div className="col-span-8 space-y-4">
          {/* Incident code trace */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-gray-900">Incident Code Trace</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                  {incidentTrace.id}
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">{incidentTrace.endpoint}</span>
            </div>

            <div className="p-4">
              {/* Execution chain */}
              <div className="space-y-0">
                {incidentTrace.chain.map((step, i) => (
                  <div key={i} className="relative">
                    {/* Connector line */}
                    {i < incidentTrace.chain.length - 1 && (
                      <div className="absolute left-[15px] top-[28px] bottom-0 w-px bg-gray-200" />
                    )}

                    <div className={`flex items-start gap-3 py-2 px-2 rounded-md ${
                      step.type === 'fault' ? 'bg-red-50 border border-red-200' : ''
                    }`}>
                      {/* Step indicator */}
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border-2 ${
                        step.type === 'fault'
                          ? 'bg-red-100 border-red-300 text-red-700'
                          : step.type === 'entry'
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono font-semibold text-gray-900">{step.fn}</span>
                          {step.type === 'fault' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">
                              FAULT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                          <File className="w-3 h-3" />
                          <span className="font-mono">{step.file}:{step.line}</span>
                        </div>
                        {step.error && (
                          <div className="mt-1 text-[11px] font-medium text-red-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {step.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI analysis placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="text-[12px] font-semibold text-gray-900">AI Code Analysis</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-[12px] text-gray-700 leading-relaxed">
              <p className="mb-2">
                <strong>Root Cause:</strong> The <code className="px-1 py-0.5 bg-gray-100 rounded text-[11px] font-mono">DatabaseClient.query()</code> method
                at line 134 attempts to acquire a connection from the pool without proper timeout handling.
              </p>
              <p className="mb-2">
                <strong>Mechanism:</strong> Under sustained write load ({'>'}200 concurrent connections), the pool
                reaches its max capacity (default: 10) and blocks indefinitely, cascading timeouts up the call chain.
              </p>
              <p>
                <strong>Recommendation:</strong> Increase pool size to 50, add connection acquisition timeout (5s),
                and implement circuit breaker pattern in <code className="px-1 py-0.5 bg-gray-100 rounded text-[11px] font-mono">PaymentService.process()</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
