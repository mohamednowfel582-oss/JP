import React from 'react';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const norm = (status || 'Pending').toLowerCase();

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs font-medium'
    : 'px-3 py-1 text-xs font-semibold uppercase tracking-wide';

  if (norm === 'resolved') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        Resolved
      </span>
    );
  }

  if (norm === 'in progress') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
        <Loader2 className="w-3.5 h-3.5 text-sky-500 animate-spin" />
        In Progress
      </span>
    );
  }

  // Pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
      <Clock className="w-3.5 h-3.5 text-amber-500" />
      Pending
    </span>
  );
}
