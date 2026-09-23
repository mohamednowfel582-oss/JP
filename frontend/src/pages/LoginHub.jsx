import React from 'react';
import { GraduationCap, ShieldAlert, ArrowRight, UserPlus, ArrowLeft } from 'lucide-react';

export default function LoginHub({
  onSelectStudentLogin,
  onSelectAdminLogin,
  onNavigateToRegister,
  onNavigateToHome,
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition shadow-xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Sign In to Complaint Portal
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Please select your portal role to access your dedicated dashboard and tools.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Student Portal Card */}
          <div className="bg-white rounded-3xl border border-blue-200/80 shadow-xl hover:shadow-2xl hover:border-blue-400 transition-all duration-300 p-8 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  For Students
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Student Portal
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                  Lodge new complaints for hostel, electricity, food, or water, track status in real-time, and view administrative responses.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Lodge complaints with photos & priority
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Live step-by-step progress timeline
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Official feedback from maintenance staff
                </p>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                type="button"
                onClick={onSelectStudentLogin}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition flex items-center justify-center gap-2"
              >
                Sign In as Student
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToRegister}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                New Student? Create Account
              </button>
            </div>
          </div>

          {/* 2. Admin Portal Card */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-xl hover:shadow-2xl hover:border-slate-500 transition-all duration-300 p-8 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-teal-300 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-md">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  Staff & Supervisors
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Admin Portal
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                  Authorized access for campus administrators to review queues, update complaint statuses, post remarks, and export reports.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  Central intake queue & status triage
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  Dispatch technicians & post updates
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  Interactive analytics & CSV export
                </p>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                type="button"
                onClick={onSelectAdminLogin}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/25 hover:shadow-slate-900/35 transition flex items-center justify-center gap-2"
              >
                Sign In as Administrator
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="py-2.5 text-center text-xs text-slate-400">
                Authorized Campus Personnel Only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
