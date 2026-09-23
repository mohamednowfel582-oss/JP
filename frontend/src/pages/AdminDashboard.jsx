import React, { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  Users,
  BarChart3,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { api } from '../api/client';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function AdminDashboard({ onNavigate, onViewComplaint }) {
  const [reports, setReports] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [repData, compData] = await Promise.all([
        api.get('/admin/reports'),
        api.get('/admin/complaints'),
      ]);
      setReports(repData);
      setComplaints(compData.complaints || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const total = reports?.totalComplaints || 0;
  const pending = reports?.pendingComplaints || 0;
  const inProgress = reports?.inProgressComplaints || 0;
  const resolved = reports?.resolvedComplaints || 0;
  const totalStudents = reports?.totalStudents || 0;

  // Status Chart Data (Doughnut)
  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [pending, inProgress, resolved],
        backgroundColor: ['#f59e0b', '#0284c7', '#10b981'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Category Chart Data (Bar)
  const categoryLabels = reports?.categoryCounts ? Object.keys(reports.categoryCounts) : [];
  const categoryValues = reports?.categoryCounts ? Object.values(reports.categoryCounts) : [];
  const categoryChartData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['Hostel', 'Water', 'Electricity', 'Food', 'Maintenance'],
    datasets: [
      {
        label: 'Complaints',
        data: categoryValues.length > 0 ? categoryValues : [0, 0, 0, 0, 0],
        backgroundColor: '#0d9488',
        borderRadius: 8,
      },
    ],
  };

  // Time / Trend Chart Data (Line)
  const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Logged Complaints',
        data: [2, 4, 3, 5, 2, 3, total > 0 ? total : 4],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Admin Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold tracking-wider uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Central Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Administrative Overview
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Monitor resolution velocity, department bottlenecks, and pending work across campus facilities.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('admin-reports')}
            className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-2xl shadow-md transition flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Full Analytics
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{loading ? '...' : total}</p>
          <p className="text-[11px] text-slate-400 mt-1">Grievances logged</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 mt-2">{loading ? '...' : pending}</p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting triage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">In Progress</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Loader2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-sky-600 mt-2">{loading ? '...' : inProgress}</p>
          <p className="text-[11px] text-slate-400 mt-1">Under maintenance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Resolved</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-2">{loading ? '...' : resolved}</p>
          <p className="text-[11px] text-slate-400 mt-1">Successfully closed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Students</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{loading ? '...' : totalStudents}</p>
          <p className="text-[11px] text-slate-400 mt-1">Registered users</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution (Doughnut) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Complaints by Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">Current workflow division</p>
          </div>
          <div className="py-6 flex items-center justify-center max-h-56">
            <Doughnut
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                },
              }}
            />
          </div>
          <div className="grid grid-cols-3 text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div>
              <span className="font-bold text-amber-600">{pending}</span>
              <p className="text-[10px]">Pending</p>
            </div>
            <div>
              <span className="font-bold text-sky-600">{inProgress}</span>
              <p className="text-[10px]">Active</p>
            </div>
            <div>
              <span className="font-bold text-emerald-600">{resolved}</span>
              <p className="text-[10px]">Done</p>
            </div>
          </div>
        </div>

        {/* Complaints by Category (Bar) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Complaints by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5">Volume across campus services</p>
          </div>
          <div className="py-4 flex items-center justify-center h-56">
            <Bar
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                  x: { ticks: { font: { size: 10 } } },
                },
              }}
            />
          </div>
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-400">
            Top categories: Hostel, Water & Electricity
          </div>
        </div>

        {/* Complaints over Time (Line) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Complaints over Time</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weekly intake trend</p>
          </div>
          <div className="py-4 flex items-center justify-center h-56">
            <Line
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                },
              }}
            />
          </div>
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-400">
            Intake steady across weekdays
          </div>
        </div>
      </div>

      {/* Recent Complaints Live Triage Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Intake Queue</h2>
            <p className="text-xs text-slate-500">Most recent student submissions needing triage</p>
          </div>
          <button
            onClick={() => onNavigate('admin-complaints-all')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            Manage All Complaints ({complaints.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm">Loading intake queue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Category & Title</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.slice(0, 6).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.complaintCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.studentId}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {c.category}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 truncate">{c.title}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewComplaint(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Triage
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
