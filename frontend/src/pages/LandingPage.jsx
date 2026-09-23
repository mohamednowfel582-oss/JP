import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  Search,
  CheckCircle2,
  Clock,
  Settings,
  ArrowRight,
  HelpCircle,
  Building2,
  Zap,
  Sparkles,
  Users,
} from 'lucide-react';

export default function LandingPage({ onNavigate, onTrackSearch }) {
  const [trackCode, setTrackCode] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackCode.trim()) {
      onTrackSearch(trackCode.trim());
    }
  };

  const featureCards = [
    {
      icon: Send,
      title: "Easy Complaint Registration",
      desc: "Submit hostel, electricity, water, maintenance or mess issues with photos, priority and location in seconds.",
      color: "from-blue-500 to-indigo-600",
      lightColor: "bg-blue-50 text-blue-700",
    },
    {
      icon: Clock,
      title: "Real-Time Status Tracking",
      desc: "Instant live updates as your complaint progresses from Pending to In Progress and Resolved.",
      color: "from-teal-500 to-emerald-600",
      lightColor: "bg-teal-50 text-teal-700",
    },
    {
      icon: Settings,
      title: "Admin Management",
      desc: "Centralized administrative triage, assignment, direct responses, and real-time status updates.",
      color: "from-slate-700 to-slate-900",
      lightColor: "bg-slate-100 text-slate-800",
    },
    {
      icon: CheckCircle2,
      title: "Complaint Resolution",
      desc: "Audit trails, transparent remarks from authorities, and comprehensive satisfaction closure.",
      color: "from-emerald-500 to-teal-600",
      lightColor: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Modern College Grievance Redressal
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Smart <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-teal-600 to-blue-800">Complaint Management</span> System
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                Register, track and manage complaints easily through a single platform. Designed for fast resolution, complete transparency, and seamless student-admin coordination.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('student-login')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  Student Login
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-base shadow-xs hover:-translate-y-0.5 transition"
                >
                  Admin Login
                </button>
              </div>

              {/* Quick Search Widget */}
              <div className="pt-6 max-w-lg mx-auto lg:mx-0">
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
                  <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
                    <div className="pl-3 text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={trackCode}
                      onChange={(e) => setTrackCode(e.target.value)}
                      placeholder="Enter Complaint ID (e.g. CMP1001)..."
                      className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      Track Now
                    </button>
                  </form>
                </div>
                <p className="text-xs text-slate-400 mt-2 pl-2">
                  No login required for quick public complaint status checks.
                </p>
              </div>
            </div>

            {/* Right Illustration / Portal Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-3xl opacity-20 blur-xl"></div>

                {/* Card Illustration */}
                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Campus Helpdesk</p>
                        <p className="text-xs text-slate-400">Live Redressal Portal</p>
                      </div>
                    </div>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>

                  {/* Simulated Complaint Card 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        #CMP1001
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">Water heater malfunctioning</p>
                    <p className="text-xs text-slate-500">Hostel Block B, 2nd Floor</p>
                  </div>

                  {/* Simulated Complaint Card 2 */}
                  <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                        #CMP1002
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        <Zap className="w-3 h-3 text-sky-600" />
                        In Progress
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">Lab 3 AC Repair</p>
                    <p className="text-xs text-teal-700 font-medium">
                      Admin: "Technician on site with replacement parts."
                    </p>
                  </div>

                  {/* Quick Stat Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-100">
                      <p className="text-lg font-black text-slate-900">98%</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Resolved</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100">
                      <p className="text-lg font-black text-blue-700">&lt;24h</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Response</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100">
                      <p className="text-lg font-black text-teal-700">100%</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Audit Trail</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Key Features of the System
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Everything students and college administrators need to keep campus facilities running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.lightColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">About CMS</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Empowering Students, Accelerating Redressal
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                The Complaint Management System bridges students and facility staff through an automated, accountable workflow. By preserving existing core business rules and supercharging them with relational persistence and a reactive frontend, campus grievances are resolved swiftly without administrative bottlenecks.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <button
                onClick={() => onNavigate('student-register')}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition"
              >
                Create Student Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
