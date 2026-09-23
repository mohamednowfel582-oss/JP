import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Building,
  MapPin,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import { api } from '../api/client';

export default function TrackComplaint({ initialCode = '', onTrackAgain }) {
  const [query, setQuery] = useState(initialCode);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const performSearch = async (codeToSearch) => {
    if (!codeToSearch || !codeToSearch.trim()) return;
    setLoading(true);
    setError('');
    setComplaint(null);
    setSearched(true);

    try {
      const res = await api.get(`/complaints/track/${encodeURIComponent(codeToSearch.trim())}`);
      if (res.found && res.complaint) {
        setComplaint(res.complaint);
      } else {
        setError(`No complaint found with ID "${codeToSearch}". Please check the ID and try again.`);
      }
    } catch (err) {
      setError(err.message || `No complaint found with ID "${codeToSearch}".`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      setQuery(initialCode);
      performSearch(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Complaint Status
        </h1>
        <p className="text-sm text-slate-500">
          Enter your unique Complaint ID (e.g. <strong>CMP1001</strong>) to view real-time resolution progress
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="pt-2">
          <div className="flex gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Complaint ID (e.g. CMP1001)..."
              className="w-full px-4 py-2.5 text-sm bg-transparent focus:outline-none font-mono font-medium text-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  Track Status
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
          <span>Try sample:</span>
          {['CMP1001', 'CMP1002', 'CMP1003'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => { setQuery(code); performSearch(code); }}
              className="font-mono text-blue-600 hover:underline font-semibold"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {error && searched && (
        <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3 animate-shake">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-800">{error}</p>
          <p className="text-xs text-red-600">
            Ensure you copied the correct Complaint ID generated during submission.
          </p>
        </div>
      )}

      {complaint && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                  {complaint.complaintCode}
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                  {complaint.category}
                </span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {complaint.title}
              </h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          {/* Visual Timeline */}
          <Timeline
            status={complaint.status}
            createdAt={complaint.createdAt}
            updatedAt={complaint.updatedAt}
          />

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Location</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{complaint.location}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Submitted</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{complaint.createdAt}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Last Updated</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{complaint.updatedAt}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Description
            </h3>
            <p className="p-4 rounded-2xl bg-slate-50 text-sm text-slate-800 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Admin Remarks */}
          {complaint.responses && complaint.responses.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                Official Admin Update
              </h3>
              {complaint.responses.map((r, i) => (
                <div key={i} className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-1">
                  <div className="flex justify-between text-xs text-teal-800 font-bold">
                    <span>{r.adminUsername || 'Administrator'}</span>
                    <span className="text-teal-600 font-normal">{r.createdAt}</span>
                  </div>
                  <p className="text-sm text-slate-800 pt-1">{r.response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
