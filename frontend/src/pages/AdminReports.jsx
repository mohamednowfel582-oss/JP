import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  PieChart,
  RefreshCw,
  AlertTriangle,
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
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { api, getAuthToken } from '../api/client';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AdminReports({ showToast }) {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/reports');
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCsv = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/admin/reports/export-csv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to export CSV');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complaints_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      if (showToast) {
        showToast({ type: 'success', message: 'CSV Report exported successfully.' });
      }
    } catch (err) {
      if (showToast) {
        showToast({ type: 'error', message: err.message || 'CSV Export failed' });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Category Chart Data
  const catLabels = reports?.categoryCounts ? Object.keys(reports.categoryCounts) : [];
  const catValues = reports?.categoryCounts ? Object.values(reports.categoryCounts) : [];
  const categoryChartData = {
    labels: catLabels.length > 0 ? catLabels : ['None'],
    datasets: [
      {
        label: 'Total Complaints',
        data: catValues.length > 0 ? catValues : [0],
        backgroundColor: ['#2563eb', '#0d9488', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6', '#64748b'],
        borderRadius: 8,
      },
    ],
  };

  // Priority Chart Data (Pie)
  const priLabels = reports?.priorityCounts ? Object.keys(reports.priorityCounts) : [];
  const priValues = reports?.priorityCounts ? Object.values(reports.priorityCounts) : [];
  const priorityChartData = {
    labels: priLabels.length > 0 ? priLabels : ['Medium'],
    datasets: [
      {
        data: priValues.length > 0 ? priValues : [1],
        backgroundColor: ['#ef4444', '#f97316', '#3b82f6', '#94a3b8'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header with Export and Print buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analytics & Administrative Reports
          </h1>
          <p className="text-sm text-slate-500">
            System performance summary, resolution statistics, and CSV export
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto no-print">
          <button
            onClick={fetchReports}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Registered</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{reports?.totalComplaints || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Across all categories</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-amber-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending Triage</span>
          <p className="text-3xl font-black text-amber-600 mt-2">{reports?.pendingComplaints || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Requiring review</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sky-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">In Progress</span>
          <p className="text-3xl font-black text-sky-600 mt-2">{reports?.inProgressComplaints || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Under maintenance</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Resolved Complaints</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{reports?.resolvedComplaints || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Completed closures</p>
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complaints by Category</h3>
              <p className="text-xs text-slate-400">Distribution across facility areas</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Bar
              data={categoryChartData}
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
        </div>

        {/* Priority Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complaints by Priority</h3>
              <p className="text-xs text-slate-400">Urgency classification</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={priorityChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Data Summary Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Category Volume Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {reports?.categoryCounts &&
            Object.entries(reports.categoryCounts).map(([cat, count]) => (
              <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-500">{cat}</p>
                <p className="text-xl font-black text-slate-900 mt-1">{count}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
