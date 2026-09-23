import React, { useState } from 'react';
import {
  Send,
  Building,
  Tag,
  AlignLeft,
  MapPin,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  FileCheck,
} from 'lucide-react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function RegisterComplaint({ user, onComplaintRegistered, onViewComplaint }) {
  const categories = [
    'Hostel',
    'Water',
    'Electricity',
    'Food',
    'Cleaning',
    'Maintenance',
    'Transport',
    'Other',
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const [formData, setFormData] = useState({
    category: 'Hostel',
    title: '',
    description: '',
    location: '',
    priority: 'Medium',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please provide title, description, and location.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/complaints', {
        studentId: user?.studentId,
        studentName: user?.name,
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        priority: formData.priority,
        imageUrl: formData.imageUrl.trim() || null,
      });

      if (res.success && res.complaint) {
        setSubmittedData(res.complaint);
        if (onComplaintRegistered) {
          onComplaintRegistered(res.complaint);
        }
      } else {
        setError(res.error || 'Failed to submit complaint.');
      }
    } catch (err) {
      setError(err.message || 'Error submitting complaint.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
    setFormData({
      category: 'Hostel',
      title: '',
      description: '',
      location: '',
      priority: 'Medium',
      imageUrl: '',
    });
  };

  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Submission Confirmed
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              Complaint Registered Successfully
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your grievance has been logged into the system and dispatched to campus supervisors.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Complaint ID</span>
              <span className="font-mono text-base font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                {submittedData.complaintCode}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</span>
              <span className="text-sm font-semibold text-slate-800">{submittedData.category}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</span>
              <span className="text-sm font-semibold text-slate-800">{submittedData.title}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Date Logged</span>
              <span className="text-sm font-medium text-slate-600">{submittedData.createdAt}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
              <StatusBadge status={submittedData.status} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onViewComplaint(submittedData.id)}
              className="w-full sm:w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              View Complaint Details
            </button>
            <button
              onClick={resetForm}
              className="w-full sm:w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Lodge Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold tracking-wider uppercase mb-2">
            <Send className="w-3.5 h-3.5" />
            Lodge Grievance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Register New Complaint
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify the department, location and details of the issue for expedited action.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Complaint Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Priority Level *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center ${
                      formData.priority === p
                        ? p === 'Urgent'
                          ? 'bg-red-600 text-white shadow-sm'
                          : p === 'High'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : p === 'Medium'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Complaint Title / Summary *
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Water heater in Room 204 not turning on"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Exact Location / Room / Block *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Hostel Block B, 2nd Floor, Room 204"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide complete details regarding the problem, since when it occurred, and any safety hazards..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition leading-relaxed"
            />
          </div>

          {/* Optional Attachment/Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Optional Image / Attachment Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Upload className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg or attachment URL"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Paste an image URL or cloud storage reference to help maintenance identify the issue.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Registering Complaint...' : 'Submit Complaint'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
