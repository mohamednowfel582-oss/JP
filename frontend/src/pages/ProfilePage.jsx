import React from 'react';
import { User, ShieldCheck, Mail, Phone, Hash, Calendar, KeyRound } from 'lucide-react';

export default function ProfilePage({ user }) {
  const isStudent = user?.role === 'STUDENT';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500">Your registered user information and active credentials</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name || user?.username}</h2>
            <p className="text-xs font-semibold text-teal-600 bg-teal-50 inline-block px-2.5 py-0.5 rounded-full mt-1">
              {isStudent ? 'Registered Student' : 'System Administrator'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Hash className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {isStudent ? 'Student ID' : 'Admin Username'}
              </span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-900">
              {user?.studentId || user?.username}
            </p>
          </div>

          {user?.email && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Mail className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">College Email</span>
              </div>
              <p className="text-sm font-medium text-slate-900">{user.email}</p>
            </div>
          )}

          {user?.phone && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Phone Contact</span>
              </div>
              <p className="text-sm font-medium text-slate-900">{user.phone}</p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Access Role</span>
            </div>
            <p className="text-sm font-medium text-slate-900">
              {isStudent ? 'Student Portal (Read / File Grievances)' : 'Full Administrative Access'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs font-bold text-slate-800">Password Security</p>
              <p className="text-[11px] text-slate-500">Stored via SHA-256 salted hash</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
            Protected
          </span>
        </div>
      </div>
    </div>
  );
}
