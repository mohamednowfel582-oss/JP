import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Key,
  CheckCircle,
} from 'lucide-react';
import { api, setAuthSession } from '../api/client';

export default function AdminLogin({
  onLoginSuccess,
  onNavigateToStudentLogin,
  onNavigateToHome,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide your administrative username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (res.success && res.token) {
        setAuthSession(res.token, res.admin, 'ADMIN');
        onLoginSuccess(res.admin, 'ADMIN');
      } else {
        setError(res.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please verify administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-300/80 shadow-2xl overflow-hidden animate-fade-in">
        {/* Top Dark Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onNavigateToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-300/30">
              Restricted Access
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-lg flex-shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Admin Portal</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Authorized staff sign-in for complaint triage, assignment & reporting
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          {/* Error Notification */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="text-xs text-slate-800">
              <p className="font-bold">Test Admin Account:</p>
              <p className="text-[11px] text-slate-600">User: <span className="font-mono font-bold">admin</span> | Pass: <span className="font-mono font-bold">admin123</span></p>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Auto Fill
            </button>
          </div>

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/25 hover:shadow-slate-900/35 hover:-translate-y-0.5 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Access Admin Console'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Switch to Student Login */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium">Are you a student registering an issue?</span>
            <button
              type="button"
              onClick={onNavigateToStudentLogin}
              className="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
            >
              Student Login Portal →
            </button>
          </div>

          {/* Security Disclaimer */}
          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
            Campus Helpdesk & Maintenance Department • All actions are audited
          </div>
        </div>
      </div>
    </div>
  );
}
