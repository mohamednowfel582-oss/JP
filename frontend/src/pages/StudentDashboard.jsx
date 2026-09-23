import React, { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { api } from '../api/client';

export default function StudentDashboard({ user, onNavigate, onViewComplaint }) {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/complaints/my');
      setRecentComplaints(res.complaints || []);
      setStats(res.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
    { label: 'Resolved Issues', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
            Student Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Track your open grievances, inspect updates from the administrative team, or submit new service requests.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('register-complaint')}
            className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm rounded-2xl shadow-md transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Lodge Complaint
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${c.bg} bg-white shadow-xs transition hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {c.label}
                </p>
                <div className={`p-2.5 rounded-xl ${c.bg}`}>
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-3">
                {loading ? '...' : c.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">Your latest registered requests and resolutions</p>
          </div>
          <button
            onClick={() => onNavigate('my-complaints')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            View All ({recentComplaints.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm">Fetching complaints...</p>
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-slate-800">No Complaints Registered</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't filed any complaints yet. Need assistance with hostel, electricity, or campus facilities?
            </p>
            <button
              onClick={() => onNavigate('register-complaint')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
            >
              Submit Your First Complaint
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Complaint ID</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentComplaints.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.complaintCode || `#CMP${c.id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 truncate max-w-xs">{c.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-sm">{c.description}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.createdAt ? c.createdAt.split(' ')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewComplaint(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
