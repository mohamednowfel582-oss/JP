import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  RefreshCw,
  X,
  MessageSquare,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ConfirmModal from '../components/ConfirmModal';
import { api } from '../api/client';

export default function AdminComplaints({ defaultFilter = 'All', onViewComplaint, showToast }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(defaultFilter);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Status Update Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Response Modal State
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseSubmitting, setResponseSubmitting] = useState(false);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);

  const categories = ['All', 'Hostel', 'Water', 'Electricity', 'Food', 'Cleaning', 'Maintenance', 'Transport', 'Other'];
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedStatus !== 'All') queryParams.append('status', selectedStatus);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (search.trim()) queryParams.append('search', search.trim());

      const res = await api.get(`/admin/complaints?${queryParams.toString()}`);
      setComplaints(res.complaints || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
      showToast({ type: 'error', message: 'Failed to load complaints from server' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  // Open Status Update Modal
  const openStatusModal = (c) => {
    setTargetComplaint(c);
    setNewStatus(c.status);
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!targetComplaint) return;
    setStatusUpdating(true);
    try {
      const res = await api.put(`/admin/complaints/${targetComplaint.id}/status`, {
        status: newStatus,
      });

      if (res.success) {
        showToast({
          type: 'success',
          message: `Complaint #${targetComplaint.complaintCode} status updated to ${newStatus}.`,
        });
        setStatusModalOpen(false);
        fetchComplaints();
      } else {
        showToast({ type: 'error', message: res.error || 'Failed to update status' });
      }
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Status update failed' });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Open Add Response Modal
  const openResponseModal = (c) => {
    setTargetComplaint(c);
    setResponseText('');
    setResponseModalOpen(true);
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim() || !targetComplaint) return;
    setResponseSubmitting(true);
    try {
      const res = await api.post(`/admin/complaints/${targetComplaint.id}/response`, {
        response: responseText.trim(),
      });

      if (res.success) {
        showToast({
          type: 'success',
          message: `Response added to #${targetComplaint.complaintCode}.`,
        });
        setResponseModalOpen(false);
        fetchComplaints();
      } else {
        showToast({ type: 'error', message: res.error || 'Failed to add response' });
      }
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Error adding response' });
    } finally {
      setResponseSubmitting(false);
    }
  };

  // Delete Handlers
  const confirmDelete = (c) => {
    setComplaintToDelete(c);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!complaintToDelete) return;
    try {
      const res = await api.delete(`/admin/complaints/${complaintToDelete.id}`);
      if (res.success) {
        showToast({
          type: 'success',
          message: `Complaint #${complaintToDelete.complaintCode} deleted successfully.`,
        });
        setDeleteModalOpen(false);
        fetchComplaints();
      } else {
        showToast({ type: 'error', message: res.error || 'Delete failed' });
      }
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Error deleting complaint' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Complaint Management
          </h1>
          <p className="text-sm text-slate-500">
            Audit, update status, add official remarks, and triage student grievances
          </p>
        </div>
        <button
          onClick={fetchComplaints}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, student, keyword, location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </form>

          {/* Status Tab Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Display */}
      {loading ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm">Loading complaints queue...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <p className="text-base font-bold text-slate-800">No Complaints Found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No complaints match the current filter criteria. Try resetting status or category filters.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedStatus('All'); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Complaint ID</th>
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Title & Description</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.complaintCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{c.studentId}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                      <p className="text-xs text-slate-500 truncate">{c.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.createdAt ? c.createdAt.split(' ')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewComplaint(c.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openResponseModal(c)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Add Response / Remarks"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openStatusModal(c)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Change Status"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(c)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Complaint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModalOpen && targetComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Update Complaint Status
              </h3>
              <button
                onClick={() => setStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-blue-700 font-mono">#{targetComplaint.complaintCode}</p>
              <p className="text-slate-800 font-semibold">{targetComplaint.title}</p>
              <p className="text-slate-500">Student: {targetComplaint.name} ({targetComplaint.studentId})</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Select New Status
              </label>
              <div className="space-y-2">
                {['Pending', 'In Progress', 'Resolved'].map((st) => (
                  <label
                    key={st}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      newStatus === st
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="complaintStatus"
                        value={st}
                        checked={newStatus === st}
                        onChange={() => setNewStatus(st)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs">{st}</span>
                    </div>
                    <StatusBadge status={st} size="sm" />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={handleStatusUpdate}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {statusUpdating ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response / Comment Modal */}
      {responseModalOpen && targetComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Add Official Admin Response
              </h3>
              <button
                onClick={() => setResponseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Posting official updates to #{targetComplaint.complaintCode} ({targetComplaint.title}). The student will see this remark in their portal immediately.
            </p>

            <form onSubmit={handleResponseSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type resolution remarks, technician dispatch notes, or instructions for the student..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResponseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={responseSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {responseSubmitting ? 'Posting...' : 'Post Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Complaint"
        message={`Are you sure you want to permanently delete complaint #${complaintToDelete?.complaintCode} ("${complaintToDelete?.title}")? This action cannot be undone.`}
        confirmText="Delete Complaint"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
