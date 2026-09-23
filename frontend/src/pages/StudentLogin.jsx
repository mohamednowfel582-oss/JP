import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Building,
  ArrowLeft,
} from 'lucide-react';
import { api, setAuthSession } from '../api/client';

export default function StudentLogin({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToAdminLogin,
  onNavigateToHome,
}) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!studentId.trim() || !password.trim()) {
      setError('Please enter both your Student ID and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/students/login', {
        studentId: studentId.trim(),
        password: password.trim(),
      });

      if (res.success && res.token) {
        setAuthSession(res.token, res.student, 'STUDENT');
        onLoginSuccess(res.student, 'STUDENT');
      } else {
        setError(res.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  const handleAutofill = () => {
    setStudentId('STU1001');
    setPassword('student123');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-fade-in">
        {/* Top Student Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-teal-700 p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onNavigateToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 px-3 py-1 rounded-full border border-teal-300/30">
              Student Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Student Login</h1>
              <p className="text-xs text-blue-100 mt-0.5">
                Sign in to register grievances, track updates & view resolutions
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
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/70 rounded-2xl flex items-center justify-between">
            <div className="text-xs text-blue-900">
              <p className="font-bold">Test Student Account:</p>
              <p className="text-[11px] text-blue-700">ID: <span className="font-mono font-bold">STU1001</span> | Pass: <span className="font-mono font-bold">student123</span></p>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Auto Fill
            </button>
          </div>

          {/* Student Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Student ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU1001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
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
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In as Student'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Registration Link */}
          <div className="pt-2 text-center text-sm text-slate-600 border-t border-slate-100">
            Don't have a student account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Create Account Now
            </button>
          </div>

          {/* Switch to Admin Login */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Are you campus staff or admin?</span>
            <button
              type="button"
              onClick={onNavigateToAdminLogin}
              className="font-bold text-slate-900 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              Admin Login Portal →
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your registered college email address and we'll dispatch password recovery instructions.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  Password reset link has been dispatched to <strong>{forgotEmail}</strong>. Please check your college inbox.
                </p>
                <button
                  onClick={() => { setForgotModalOpen(false); setForgotSuccess(false); }}
                  className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
