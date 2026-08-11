import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, FileCheck, Award, ArrowRight } from 'lucide-react';

export const AdmissionsView: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">NOU Admission Process & Rules</h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Nexus Online Institute maintains an automated, transparent, and merit-driven admission system. Follow our step-by-step process below to submit your application and complete your entrance assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-5 h-5 text-blue-800" />
            <span>Document Verification Guidelines</span>
          </h2>
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Passport Photograph & Signature:</strong> Clear, high-contrast digital scan in JPG/PNG format.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>10th & 12th Marksheets:</strong> Official board issued statement of marks.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Degree Certificate (for PG):</strong> Provisional or final degree certificate with all semester marksheets.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Government ID:</strong> Aadhaar Card, Passport, or Voter ID for identity verification.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-blue-800" />
            <span>Admission Decision Criteria</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="font-semibold text-blue-900 mb-1">Entrance Test Qualification:</div>
              <span>Candidate must score at least the required passing percentage (typically 50%) in the program-specific online entrance test.</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="font-semibold text-amber-900 mb-1">Document Clearance:</div>
              <span>All submitted academic and category certificates must be verified by NOU document verification officers.</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="font-semibold text-emerald-900 mb-1">Final Approval:</div>
              <span>Upon meeting test & document criteria, the admin committee marks the application as "Selected" or "Admission Confirmed".</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('apply')}
          className="px-8 py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Begin Application Form</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
