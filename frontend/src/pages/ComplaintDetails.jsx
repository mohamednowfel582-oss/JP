import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  MessageSquare,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Building,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import { api } from '../api/client';

export default function ComplaintDetails({ complaintId, onBack }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/complaints/${complaintId}`);
        setComplaint(data);
      } catch (err) {
        setError(err.message || 'Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      fetchDetails();
    }
  }, [complaintId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-medium">Loading complaint details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4">
        <p className="text-base font-bold text-red-600">{error || 'Complaint not found.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Current Status:</span>
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {complaint.complaintCode}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {complaint.category}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {complaint.title}
            </h1>
          </div>
        </div>

        {/* Visual Status Timeline Tracker */}
        <Timeline
          status={complaint.status}
          createdAt={complaint.createdAt}
          updatedAt={complaint.updatedAt}
        />

        {/* Metadata Grid */}
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Submitted On</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{complaint.createdAt}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Last Activity</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{complaint.updatedAt}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Problem Description
          </h2>
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {complaint.description}
          </div>
        </div>

        {/* Attachment Image if present */}
        {complaint.imageUrl && (
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Attached Evidence / Image
            </h2>
            <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={complaint.imageUrl}
                alt="Complaint attachment"
                className="w-full h-auto object-cover max-h-64"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="p-3 bg-slate-50 text-xs flex justify-between items-center text-slate-600">
                <span className="truncate">{complaint.imageUrl}</span>
                <a
                  href={complaint.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Remarks & Responses Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Administration Remarks & Responses
            </h2>
            <p className="text-xs text-slate-500">
              Official updates from maintenance staff and department heads
            </p>
          </div>
        </div>

        {(!complaint.responses || complaint.responses.length === 0) ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold">No administrative comments posted yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Campus supervisors will post updates as technicians inspect the location.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaint.responses.map((r, i) => (
              <div
                key={r.id || i}
                className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/30 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      {r.adminUsername || 'Administrator'}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">{r.createdAt}</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed pl-1 pt-1">
                  {r.response}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
