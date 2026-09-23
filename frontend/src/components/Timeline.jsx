import React from 'react';
import { Check, Clock, Loader2, Send } from 'lucide-react';

export default function Timeline({ status = 'Pending', createdAt, updatedAt }) {
  const steps = [
    { key: 'submitted', label: 'Submitted', desc: 'Complaint registered in portal', time: createdAt },
    { key: 'pending', label: 'Pending', desc: 'Awaiting admin review & assignment', time: createdAt },
    { key: 'in progress', label: 'In Progress', desc: 'Action initiated by maintenance team', time: status !== 'Pending' ? updatedAt : null },
    { key: 'resolved', label: 'Resolved', desc: 'Issue inspected and resolved', time: status === 'Resolved' ? updatedAt : null },
  ];

  const getStepState = (stepKey) => {
    const s = (status || '').toLowerCase();
    if (stepKey === 'submitted') return 'completed';

    if (s === 'resolved') {
      return 'completed';
    }
    if (s === 'in progress') {
      if (stepKey === 'pending') return 'completed';
      if (stepKey === 'in progress') return 'current';
      return 'upcoming';
    }
    // Pending
    if (stepKey === 'pending') return 'current';
    return 'upcoming';
  };

  return (
    <div className="py-6 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-6">
        Complaint Progress Timeline
      </h3>

      {/* Desktop & Tablet Horizontal Steps */}
      <div className="hidden sm:grid sm:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          const isCompleted = state === 'completed';
          const isCurrent = state === 'current';

          return (
            <div key={step.key} className="flex flex-col items-center text-center relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-200 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  step.key === 'in progress' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Text Info */}
              <div className="mt-3">
                <p className={`text-sm font-bold ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 max-w-[140px] leading-tight">
                  {step.desc}
                </p>
                {step.time && (
                  <span className="inline-block mt-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    {step.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Steps */}
      <div className="sm:hidden space-y-6 relative border-l-2 border-slate-200 ml-4 pl-6">
        {steps.map((step) => {
          const state = getStepState(step.key);
          const isCompleted = state === 'completed';
          const isCurrent = state === 'current';

          return (
            <div key={step.key} className="relative">
              {/* Vertical node circle */}
              <div
                className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>

              <div>
                <p className={`text-sm font-semibold ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                {step.time && <p className="text-[10px] text-slate-400 mt-1">{step.time}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
