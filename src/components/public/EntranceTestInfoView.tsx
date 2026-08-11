import React from 'react';
import { Laptop, Clock, ShieldAlert, Award, FileText, ArrowRight, CheckCircle } from 'lucide-react';

export const EntranceTestInfoView: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
          <Laptop className="w-4 h-4 text-blue-400" />
          <span>Computer Based Entrance Examination Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">NOU Online Entrance Test Pattern</h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          The entrance exam assesses core aptitude, logical reasoning, program-specific subjects, and foundational knowledge. All tests feature browser-level controls, real-time auto-saving, and server-side score validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <Clock className="w-8 h-8 text-blue-800" />
          <h3 className="text-lg font-bold text-slate-900">Duration & Timer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            45 to 60 minutes countdown timer. When the timer reaches 00:00, your test is automatically saved, submitted, and calculated on the server.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <FileText className="w-8 h-8 text-blue-800" />
          <h3 className="text-lg font-bold text-slate-900">Marking Scheme</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Each correct answer earns +5 marks. Wrong MCQ answers carry negative marking (-1 or -1.25 marks). Unanswered questions score 0 marks.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <Award className="w-8 h-8 text-blue-800" />
          <h3 className="text-lg font-bold text-slate-900">Auto Evaluation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            MCQ, True/False, and Multiple Select questions are graded immediately upon submission with a downloadable scorecard and verification number.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 space-y-2">
        <div className="font-bold text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Browser Security & Anti-Abuse Instructions</span>
        </div>
        <p className="leading-relaxed">
          Ensure a reliable internet connection before beginning. Your answers auto-save in real-time. Do not open multiple browser tabs or attempt navigation during the examination attempt.
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={() => onNavigate('login')}
          className="px-8 py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Login to Student Portal to Take Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
