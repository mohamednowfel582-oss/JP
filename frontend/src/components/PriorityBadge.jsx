import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority = 'Medium' }) {
  const p = (priority || 'Medium').toLowerCase();

  switch (p) {
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <AlertCircle className="w-3 h-3 text-red-600" />
          Urgent
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
          <ArrowUp className="w-3 h-3 text-orange-600" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <AlertTriangle className="w-3 h-3 text-blue-500" />
          Medium
        </span>
      );
    case 'low':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <ArrowDown className="w-3 h-3 text-slate-500" />
          Low
        </span>
      );
  }
}
