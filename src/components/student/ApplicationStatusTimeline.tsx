import React from 'react';
import { ApplicationStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TimelineProps {
  currentStatus: ApplicationStatus;
}

const TIMELINE_STEPS: ApplicationStatus[] = [
  'Application Created',
  'Application Submitted',
  'Documents Under Review',
  'Documents Verified',
  'Entrance Test Required',
  'Entrance Test Completed',
  'Result Generated',
  'Eligible for Review',
  'Admission Confirmed'
];

export const ApplicationStatusTimeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const getStepIndex = (status: ApplicationStatus) => {
    if (status === 'Selected') return 7; // Eligible / Selected
    if (status === 'Admission Confirmed') return 8;
    if (status === 'Documents Rejected' || status === 'Re-upload Required') return 2;
    if (status === 'Rejected') return 7;
    const idx = TIMELINE_STEPS.indexOf(status);
    return idx >= 0 ? idx : 1;
  };

  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E5E1] shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Lifecycle Progress</span>
          <h3 className="text-xl font-serif italic text-[#1D1D1B]">Application Timeline</h3>
        </div>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-md border border-indigo-100 uppercase tracking-widest">
          {currentStatus}
        </span>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="flex items-center min-w-[700px] justify-between relative px-4">
          {/* Background Bar */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-indigo-600 transition-all duration-300 z-0"
            style={{ width: `${(currentIdx / (TIMELINE_STEPS.length - 1)) * 95}%` }}
          />

          {TIMELINE_STEPS.map((stepLabel, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-center max-w-[75px] leading-tight text-slate-600">
                  {stepLabel.replace('Application ', '').replace('Entrance Test ', 'Test ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
