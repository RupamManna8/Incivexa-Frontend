import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Zap,
  Cpu,
  Layers,
  Terminal,
  Activity,
  GitBranch,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  Database,
  Server,
  Play,
  Flame,
  Radio,
  BarChart3,
  Bot,
  FileCode2,
  Box
} from 'lucide-react';

export function LandingPage({
  user,
  onNavigateAuth,
  onEnterDashboard
}) {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      id: 'ingestion',
      stepNum: '01',
      title: 'Decoupled Kafka Telemetry Ingestion',
      subtitle: 'Stateless Gateway with Token-Bucket Rate Limiting',
      icon: <Radio className="w-5 h-5 text-indigo-400" />,
      metric: '< 5ms p99',
      summary: 'Intercepts up to 15,000 events/sec burst traffic. Performs AJV payload validation, in-memory rate limiting, and dispatches to Kafka broker.',
      codeSnippet: `// Ingestion Gateway: POST /api/v1/projects/:projectId/ingest
[GATEWAY] Event accepted (id: evt_9941a) in 2.8ms
[KAFKA] Dispatched to topic 'telemetry-events' (partition 2)
[RATELIMIT] Project 'core-payments' tokens remaining: 488/500`,
      highlights: ['Stateless <5ms latency', '100% Non-blocking', 'SHA-256 API Key verification']
    },
    {
      id: 'classifier',
      stepNum: '02',
      title: 'ML Log Risk Classification',
      subtitle: 'PyTorch LogBERT & Fingerprint Deduplication',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      metric: '99.98% Noise Cut',
      summary: 'Kafka consumer worker hashes stack traces into SHA-256 trees, collapses thousands of duplicate error bursts, and scores operational risk severity.',
      codeSnippet: `[PROCESSOR] Fingerprinted trace hash: sha256:7f81b9c02...
[DEDUP] Collapsed 1,420 events into Incident #INC-204
[AI CLASSIFIER] Severity: CRITICAL | Confidence: 0.962
[TRIGGER] Triggering Deep AST Codebase Retrieval Engine...`,
      highlights: ['Sub-millisecond deduplication', 'ML anomaly confidence scoring', 'Zero log fatigue']
    },
    {
      id: 'rca',
      stepNum: '03',
      title: 'AST Retrieval & Qwen-3 Coder RCA',
      subtitle: 'Multi-Tier Semantic Code Analysis',
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      metric: 'Exact Commit & Line',
      summary: 'Embeds repository AST chunks with BAAI/BGE-M3, pinpoints the faulty code block, and synthesizes a verified root-cause analysis with git diff.',
      codeSnippet: `[INVESTIGATOR] File: src/services/paymentGateway.js:47
[ROOT CAUSE] Unhandled Promise rejection when stripeApi.charges.create
  encounters 429 rate limit without retry backoff policy.
[SUGGESTED PATCH]
- const charge = await stripeApi.charges.create(params);
+ const charge = await retryWithExponentialBackoff(() => stripeApi.charges.create(params));`,
      highlights: ['Deep AST semantic search', 'Multi-file context retrieval', 'Production-ready git diff']
    },
    {
      id: 'sandbox',
      stepNum: '04',
      title: 'Isolated Sandbox Execution',
      subtitle: 'Zero-Risk Regression & Unit Validation',
      icon: <Box className="w-5 h-5 text-sky-400" />,
      metric: '0 Regression Escapes',
      summary: 'Dispatches the generated patch to an isolated container. Runs the test suite in real-time, verifying the fix before alerting engineering leads.',
      codeSnippet: `[SANDBOX] Spawning isolated runner for job #sbx_4810a
[SANDBOX] Applying patch to src/services/paymentGateway.js
[RUNNER] Running npm test -- tests/payment.test.js
  ✓ should process charges reliably under load (142ms)
  ✓ should gracefully back off during provider 429 (98ms)
[STATUS] 14/14 tests PASSED. Regression check cleared.`,
      highlights: ['Copy-on-write filesystem', 'Automated test suite verification', 'PR creation ready']
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Background Cyber Mesh Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-30 border-b border-slate-800/80 backdrop-blur-xl bg-[#07090E]/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">SENTINEL</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                  v2.4 Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                AUTONOMOUS INCIDENT FIRST-RESPONDER
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#pipeline" className="hover:text-white transition-colors">Incident Pipeline</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Core Architecture</a>
            <a href="#metrics" className="hover:text-white transition-colors">Live Telemetry</a>
            <a href="#architecture" className="hover:text-white transition-colors">3-Tier Topology</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
                  <img
                    src={user.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                  />
                  <span>{user.displayName || user.username}</span>
                </div>
                <button
                  onClick={onEnterDashboard}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Open Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigateAuth('signin')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigateAuth('signup')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Live System Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-mono shadow-inner backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>KAFKA BROKER CLUSTER ACTIVE · 5,000 EVT/SEC SUSTAINED</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]"
          >
            Autonomous First-Responder for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              High-Scale Production
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            Intercepts alerts across 100+ microservices in under 5ms. Uses ML to filter 99.8% of noise, traces bugs directly to the source code line, and executes verified zero-risk patches in isolated sandboxes.
          </motion.p>

          {/* Dual Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <button
              onClick={() => {
                if (user) {
                  onEnterDashboard();
                } else {
                  onNavigateAuth('signup');
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-indigo-200" />
              <span>{user ? 'Enter Incident Dashboard' : 'Deploy Autonomous Sentinel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                // If not authenticated, let user try demo with 1-click
                if (user) {
                  onEnterDashboard();
                } else {
                  onNavigateAuth('demo');
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Instant Lead SRE Demo (No Setup)</span>
            </button>
          </motion.div>

          {/* Trust Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 border-t border-slate-800/80 mt-10"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Stateless Sub-5ms Ingest</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Qwen-3 Coder Reasoning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Isolated Docker Sandbox</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kafka 15k Event Bursts</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE 4-STEP INCIDENT LIFECYCLE SECTION */}
      <section id="pipeline" className="relative z-10 py-16 bg-[#0B0F19]/90 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Autonomous First-Responder Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-3">
              From Alert Spike to Verified Patch in Under 3 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Click any stage below to inspect real-time log payloads, AST reasoning, and sandbox test results.
            </p>
          </div>

          {/* 4 Interactive Step Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {pipelineSteps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                      : 'bg-[#101524] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-indigo-400 font-bold">{step.stepNum}</span>
                      {step.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-200">
                      {step.metric}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {step.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep-Dive Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#080C14] rounded-2xl border border-slate-800 p-6 shadow-2xl">
            {/* Left Column: Details */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                  STAGE {pipelineSteps[activeStep].stepNum} · PIPELINE DEEP-DIVE
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {pipelineSteps[activeStep].title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {pipelineSteps[activeStep].summary}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Engine Architecture Guarantees
                </span>
                <div className="space-y-1.5">
                  {pipelineSteps[activeStep].highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (user) onEnterDashboard();
                    else onNavigateAuth('signin');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Launch Live Trace in Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Code & Console Output Terminal */}
            <div className="lg:col-span-7 bg-[#05070B] rounded-xl border border-slate-800/90 overflow-hidden font-mono flex flex-col">
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 ml-2">telemetry-worker.log</span>
                </div>
                <span className="text-[10px] text-slate-500">LIVE FEED</span>
              </div>
              <div className="p-4 flex-1 text-xs text-slate-300 overflow-x-auto whitespace-pre font-mono leading-relaxed bg-[#05070B]">
                {pipelineSteps[activeStep].codeSnippet}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section id="capabilities" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Enterprise Infrastructure
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-3">
            Engineered for Extreme Reliability & High Concurrency
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built from first principles to survive massive telemetry surges while keeping MTTR near zero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6 text-amber-400" />,
              title: 'Kafka-First Asynchronous Ingestion',
              desc: 'Telemetry payloads validate through AJV JSON schema and token-bucket rate limits before dispatching to Kafka with immediate 202 Accepted response in <5ms.'
            },
            {
              icon: <Cpu className="w-6 h-6 text-indigo-400" />,
              title: 'Qwen3-Coder 30B Investigation Agent',
              desc: 'Reads localized Abstract Syntax Trees (AST) using BGE-M3 vector embeddings to understand caller contexts, identifying the bug down to the exact commit and code line.'
            },
            {
              icon: <Box className="w-6 h-6 text-sky-400" />,
              title: 'Isolated Copy-on-Write Sandbox',
              desc: 'Sandboxed Docker container checks out the target branch, applies the LLM proposed fix, runs regression unit tests, and verifies zero side effects.'
            },
            {
              icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
              title: '100% Trace Deduplication',
              desc: 'Cryptographic SHA-256 fingerprinting of root stack traces collapses thousands of repeating cascade events into a single unified triage incident.'
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
              title: '60-Second Pre-Computed Analytics',
              desc: 'Background workers continuously roll up hourly and daily incident metrics into indexed MongoDB documents, dropping dashboard query latency from 50ms to 2ms.'
            },
            {
              icon: <Lock className="w-6 h-6 text-purple-400" />,
              title: 'Enterprise Multi-Strategy Auth',
              desc: 'Flexible developer authentication via Google OAuth, GitHub OAuth, GitHub Personal Access Tokens (PAT), or secure enterprise email with PBKDF2 cryptography.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800/80 hover:border-indigo-500/40 hover:bg-[#0E1422] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3-TIER ARCHITECTURE TOPOLOGY VISUALIZER */}
      <section id="architecture" className="py-20 bg-[#0B0F19]/80 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              System Blueprint
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3">
              High-Throughput 3-Tier Distributed Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Tuned for 100+ concurrent microservices, 5,000 telemetry events/sec, and sub-5ms p99 ingestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="p-6 rounded-2xl bg-[#0E1321] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  TIER 1: INGESTION
                </span>
                <span className="text-xs font-mono text-slate-400">&lt;5ms p99</span>
              </div>
              <h3 className="text-base font-bold text-white">Stateless Gateway (:8080)</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Bearer SHA-256 API Key Verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Per-Project Token-Bucket Rate Limiter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Kafka Producer (`telemetry-events`)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Immediate HTTP 202 Accepted Response</span>
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="p-6 rounded-2xl bg-[#0E1321] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  TIER 2: PROCESSING & AI
                </span>
                <span className="text-xs font-mono text-slate-400">Decoupled</span>
              </div>
              <h3 className="text-base font-bold text-white">Kafka Consumer Pool & AI (:8000)</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Stack Trace Fingerprinting & Deduplication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>PyTorch Log Risk Classifier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>AST Retrieval + Qwen3-Coder 30B RCA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>60s Pre-computed Stats Rollup Aggregator</span>
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-2xl bg-[#0E1321] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  TIER 3: DASHBOARD & SANDBOX
                </span>
                <span className="text-xs font-mono text-slate-400">Real-Time</span>
              </div>
              <h3 className="text-base font-bold text-white">Operations Console (:5173 / :9500)</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Real-time Correlated Incident Triage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>AST Code Diff Explorer & One-Click Fix</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Isolated Container Patch Verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>GitHub Repository Vector Indexing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE METRICS BANNER */}
      <section id="metrics" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/30">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">14.2M+</div>
            <div className="text-xs text-slate-400 font-medium">Telemetry Events Ingested</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">99.8%</div>
            <div className="text-xs text-slate-400 font-medium">Alert Noise Reduction</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">4.2 min</div>
            <div className="text-xs text-slate-400 font-medium">Mean Time to Remediation</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400 font-mono">0</div>
            <div className="text-xs text-slate-400 font-medium">Sandbox Regression Escapes</div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 border-t border-slate-800/80 bg-[#06080F] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Automate Production First-Response?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Connect your microservices or test our live demo sandbox with pre-configured telemetry pipelines.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateAuth('signup')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Create Free Operator Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateAuth('demo')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Instant Lead SRE Access</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 bg-[#04060A] text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span>Autonomous Incident Response Platform · Enterprise Mission-Critical System</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pipeline" className="hover:text-slate-300 transition-colors">Pipeline</a>
            <a href="#architecture" className="hover:text-slate-300 transition-colors">Topology</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
