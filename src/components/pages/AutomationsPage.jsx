import React, { useState } from 'react';
import {
  Bot, Workflow, CheckCircle2, XCircle, Shield, ArrowDown,
  Play, Pause, Settings, Zap, Eye, Search, AlertTriangle,
  GitPullRequest, FlaskConical, Rocket, UserCheck, Code2
} from 'lucide-react';

const AUTOMATIONS = [
  { id: 'detection', label: 'Incident Detection', desc: 'ML-powered anomaly detection and alert correlation', enabled: true, icon: Search },
  { id: 'rca', label: 'Root Cause Analysis', desc: 'Automated codebase investigation and fault localization', enabled: true, icon: Code2 },
  { id: 'fix-gen', label: 'AI Fix Generation', desc: 'Generate remediation patches using LLM code reasoning', enabled: true, icon: Bot },
  { id: 'testing', label: 'Automated Testing', desc: 'Sandbox patch execution with regression validation', enabled: true, icon: FlaskConical },
  { id: 'pr-create', label: 'Pull Request Creation', desc: 'Auto-create PRs with diff, tests, and context', enabled: true, approvalRequired: true, icon: GitPullRequest },
  { id: 'deploy', label: 'Auto Deployment', desc: 'Deploy verified fixes to staging/production', enabled: false, icon: Rocket },
];

const WORKFLOW_STEPS = [
  { id: 'incident', label: 'Incident', icon: AlertTriangle, color: 'bg-red-500' },
  { id: 'detect', label: 'Detect', icon: Search, color: 'bg-amber-500' },
  { id: 'classify', label: 'Classify', icon: Shield, color: 'bg-amber-500' },
  { id: 'analyze', label: 'Analyze', icon: Code2, color: 'bg-indigo-500' },
  { id: 'generate', label: 'Generate Fix', icon: Bot, color: 'bg-indigo-500' },
  { id: 'test', label: 'Run Tests', icon: FlaskConical, color: 'bg-cyan-500' },
  { id: 'pr', label: 'Create PR', icon: GitPullRequest, color: 'bg-violet-500' },
  { id: 'approve', label: 'Human Approval', icon: UserCheck, color: 'bg-amber-500' },
  { id: 'deploy', label: 'Deploy', icon: Rocket, color: 'bg-green-500' },
];

export function AutomationsPage() {
  const [automations, setAutomations] = useState(AUTOMATIONS);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(null);

  const toggleAutomation = (id) => {
    setAutomations(prev => prev.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const enabledCount = automations.filter(a => a.enabled).length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Automations</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Configure autonomous incident detection, analysis, and remediation workflows
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 font-medium border border-green-200">
            {enabledCount}/{automations.length} Active
          </span>
        </div>
      </div>

      {/* Automation toggles */}
      <div>
        <h2 className="text-[13px] font-semibold text-gray-900 mb-3">Automation Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {automations.map(auto => {
            const Icon = auto.icon;
            return (
              <div
                key={auto.id}
                className={`bg-white border rounded-lg p-4 transition-colors ${
                  auto.enabled ? 'border-gray-200' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      auto.enabled ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <Icon className={`w-4.5 h-4.5 ${auto.enabled ? 'text-indigo-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-gray-900">{auto.label}</span>
                        {auto.approvalRequired && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            APPROVAL REQUIRED
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-500 mt-0.5">{auto.desc}</p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleAutomation(auto.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                      auto.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      auto.enabled ? 'left-[22px]' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Builder */}
      <div>
        <h2 className="text-[13px] font-semibold text-gray-900 mb-3">Workflow Pipeline</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-center flex-wrap gap-0">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === WORKFLOW_STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <div
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => setActiveWorkflowStep(activeWorkflowStep === step.id ? null : step.id)}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                      activeWorkflowStep === step.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white group-hover:border-gray-300 group-hover:bg-gray-50'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        activeWorkflowStep === step.id ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </div>
                    <span className={`mt-1.5 text-[10px] font-medium text-center max-w-[64px] ${
                      activeWorkflowStep === step.id ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {!isLast && (
                    <div className="w-8 h-px bg-gray-200 mt-[-12px] mx-1 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step detail */}
          {activeWorkflowStep && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-[12px] text-gray-700">
                <strong className="text-gray-900">
                  {WORKFLOW_STEPS.find(s => s.id === activeWorkflowStep)?.label}
                </strong>
                {' — '}
                {activeWorkflowStep === 'incident' && 'Telemetry event triggers incident creation via fingerprint-based deduplication.'}
                {activeWorkflowStep === 'detect' && 'ML risk classifier scores the incident and determines investigation priority.'}
                {activeWorkflowStep === 'classify' && 'Severity classification (P0-P3) based on error rate, service criticality, and blast radius.'}
                {activeWorkflowStep === 'analyze' && 'AST-based codebase investigation traces the fault to specific files, functions, and line numbers.'}
                {activeWorkflowStep === 'generate' && 'LLM reasoning agent generates a remediation diff based on root cause analysis.'}
                {activeWorkflowStep === 'test' && 'Isolated Docker sandbox applies the patch and runs targeted unit tests.'}
                {activeWorkflowStep === 'pr' && 'Automated PR creation with diff, test results, and incident context.'}
                {activeWorkflowStep === 'approve' && 'Human operator reviews the proposed fix before deployment.'}
                {activeWorkflowStep === 'deploy' && 'Verified fix is deployed to staging, then production after validation.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
