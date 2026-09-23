import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, Hash, RefreshCw, Loader2 } from 'lucide-react';
import { api } from '../api/client';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/students');
      setStudents(res.students || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Registered Students Directory
          </h1>
          <p className="text-sm text-slate-500">
            Audit student profiles and access registered college grievance contacts
          </p>
        </div>
        <button
          onClick={fetchStudents}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, ID, email or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm">Loading student directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-base font-bold text-slate-800">No Students Found</p>
          <p className="text-xs text-slate-500">
            {search ? 'Try adjusting your search criteria.' : 'No students have registered yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">College Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {s.studentId}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {s.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {s.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-slate-400 whitespace-nowrap">
                    {s.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
