import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Key,
  ChevronDown,
  Building,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { api, API_BASE, saveSession } from '../../api/client';

export function AuthPage({
  initialMode = 'signin', // 'signin' | 'signup' | 'demo'
  onAuthSuccess,
  onNavigateLanding,
  showToast
}) {
  const [mode, setMode] = useState(initialMode === 'signup' ? 'signup' : 'signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPatAccordion, setShowPatAccordion] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Incident Commander');
  const [company, setCompany] = useState('');
  const [patToken, setPatToken] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-indigo-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  // 1. Google OAuth Click
  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${API_BASE}/api/v1/auth/google`;
  };

  // 2. GitHub OAuth Click
  const handleGitHubLogin = () => {
    setLoading(true);
    window.location.href = `${API_BASE}/api/v1/auth/github`;
  };

  // 3. Instant Lead SRE Demo Login
  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.demoLogin();
      if (res.user && res.token) {
        saveSession(res.user, res.token);
        onAuthSuccess(res.user, res.token);
        showToast('Logged in as Alex Vance (Lead SRE)', 'success');
      } else {
        setError('Demo session initiation failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize demo operator session.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Normal Email / Password Submit (Sign In or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const res = await api.login(email.trim(), password);
        if (res.user && res.token) {
          saveSession(res.user, res.token);
          onAuthSuccess(res.user, res.token);
          showToast(`Welcome back, ${res.user.displayName || res.user.username}!`, 'success');
        } else {
          setError(res.error || 'Invalid email or password.');
        }
      } else {
        // Sign up
        const res = await api.register({
          email: email.trim(),
          password,
          name: name.trim(),
          role,
          company: company.trim()
        });
        if (res.user && res.token) {
          saveSession(res.user, res.token);
          onAuthSuccess(res.user, res.token);
          showToast('Account created successfully! Welcome to Sentinel.', 'success');
        } else {
          setError(res.error || 'Failed to create account.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Personal Access Token (PAT) submit
  const handlePatSubmit = async (e) => {
    e.preventDefault();
    if (!patToken.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyToken(patToken.trim());
      if (res.user && res.token) {
        saveSession(res.user, res.token);
        onAuthSuccess(res.user, res.token);
        showToast(`Authenticated as @${res.user.username}`, 'success');
      } else {
        setError('Failed to verify GitHub Personal Access Token.');
      }
    } catch (err) {
      setError(err.message || 'Invalid GitHub token. Check your scopes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Background Lighting Meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Top Bar / Back to Home Link */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <button
          onClick={onNavigateLanding}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sentinel Overview</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GATEWAY SECURED</span>
        </div>
      </div>

      {/* Central Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-[#0D121F]/90 backdrop-blur-2xl rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-600/30 mb-3">
            <div className="w-full h-full bg-[#0A0E18] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Sign in to Sentinel' : 'Create Operator Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin'
              ? 'Access real-time incident triage and autonomous RCA'
              : 'Deploy autonomous incident investigation for your fleet'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300 font-medium"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </motion.div>
        )}

        {/* 1-Click Fast SRE Demo Button */}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 mb-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 hover:from-emerald-500/20 hover:to-indigo-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>⚡ Instant 1-Click Lead SRE Access (Demo)</span>
        </button>

        {/* Social OAuth Providers (Google & GitHub) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl bg-[#131929] hover:bg-[#182137] border border-slate-700/80 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-slate-600 disabled:opacity-50"
          >
            {/* Google Multicolor SVG Icon */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* GitHub OAuth Button */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl bg-[#131929] hover:bg-[#182137] border border-slate-700/80 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-slate-600 disabled:opacity-50"
          >
            {/* GitHub Octocat Icon */}
            <svg className="w-4 h-4 flex-shrink-0 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            or continue with email
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Tab Toggle: Sign In / Create Account */}
        <div className="grid grid-cols-2 p-1 bg-[#090D16] rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Main Normal Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full pl-9 pr-3 py-2 bg-[#090D16] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Role / Team Selector */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Operational Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#090D16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Incident Commander">Incident Commander</option>
                    <option value="Site Reliability Engineer">Site Reliability Engineer</option>
                    <option value="Platform Engineer">Platform Engineer</option>
                    <option value="DevOps Lead">DevOps Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Cloud"
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                className="w-full pl-9 pr-3 py-2 bg-[#090D16] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 bg-[#090D16] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter for registration */}
            {mode === 'signup' && password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Password Strength</span>
                  <span className="font-semibold text-slate-300">{strength.label}</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-all ${
                        strength.score >= step ? strength.color : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Remember Session Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Console' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* GitHub PAT Accordion */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowPatAccordion(!showPatAccordion)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Have a GitHub Personal Access Token (PAT)?</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPatAccordion ? 'rotate-180' : ''}`} />
          </button>

          {showPatAccordion && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePatSubmit}
              className="mt-3 space-y-2 pt-2"
            >
              <input
                type="password"
                value={patToken}
                onChange={(e) => setPatToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !patToken.trim()}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <span>Authenticate Token</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>

      {/* Security Tagline */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500 z-10">
        <Lock className="w-3.5 h-3.5 text-slate-500" />
        <span>PBKDF2 SHA-512 End-to-End Cryptographic Security</span>
      </div>
    </div>
  );
}
