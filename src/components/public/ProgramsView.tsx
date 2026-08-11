import React, { useState } from 'react';
import { Program } from '../../types';
import { GraduationCap, Search, CheckCircle, ArrowRight, BookOpen, Clock, FileText } from 'lucide-react';

interface ProgramsViewProps {
  programs: Program[];
  onNavigate: (page: string) => void;
  onSelectProgram: (programId: string) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({ programs, onNavigate, onSelectProgram }) => {
  const [filterLevel, setFilterLevel] = useState<'All' | 'Undergraduate' | 'Postgraduate'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = programs.filter((p) => {
    const matchesLevel = filterLevel === 'All' || p.level === filterLevel;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">Academic Degree Programs</h1>
        <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
          Explore NOU’s range of 11 industry-aligned Undergraduate and Postgraduate degree programs. All programs feature online learning, expert faculty mentoring, and automated entrance evaluation.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Undergraduate', 'Postgraduate'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                filterLevel === lvl
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search B.Tech, MCA, MBA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-900 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                  {prog.code}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {prog.duration}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{prog.title}</h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {prog.level}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{prog.description}</p>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Eligibility:</span>{' '}
                  <span className="text-slate-600">{prog.eligibility}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Specializations:</span>{' '}
                  <span className="text-blue-800">{prog.specializations.join(', ')}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Required Documents for Admission:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {prog.requiredDocumentTypes.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Semester Fee</div>
                <div className="text-base font-bold text-slate-900">
                  ₹{prog.tuitionFeePerSemester.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectProgram(prog.id);
                  onNavigate('apply');
                }}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Apply for {prog.code}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
