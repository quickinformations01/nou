import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Clock,
  Sparkles,
  FileText,
  Laptop
} from 'lucide-react';
import { Program } from '../../types';

interface HomeViewProps {
  programs: Program[];
  onNavigate: (page: string, extra?: any) => void;
  onSelectProgram: (programId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ programs, onNavigate, onSelectProgram }) => {
  const ugPrograms = programs.filter((p) => p.level === 'Undergraduate');
  const pgPrograms = programs.filter((p) => p.level === 'Postgraduate');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#1D1D1B] text-white pt-20 pb-24 overflow-hidden border-b border-[#E5E5E1]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/10 text-indigo-300 border border-white/15 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Admissions Open • Academic Session 2026-27</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight font-serif">
                Learn Online. <br />
                <span className="font-serif italic text-indigo-300">
                  Build Your Future.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
                Nexus Online Institute (NOU) offers career-focused Undergraduate and Postgraduate degree programs with an integrated computer-based entrance examination portal and automated admission evaluation system.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('apply')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('entrance-test-info')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-widest border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Laptop className="w-4 h-4 text-indigo-300" />
                  <span>Entrance Examination Info</span>
                </button>
              </div>

              {/* Key Quick Metrics */}
              <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-white font-serif italic">11+</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Degree Programs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-serif italic">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Online & Hybrid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-serif italic">Instant</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Test Scorecards</div>
                </div>
              </div>
            </div>

            {/* Hero Quick Admission Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-[#1D1D1B] rounded-2xl p-6 sm:p-8 border border-[#E5E5E1] shadow-2xl space-y-6">
                <div className="border-b border-[#E5E5E1] pb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Instant Program Search</span>
                  <h3 className="text-2xl font-serif italic text-[#1D1D1B] mt-1 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                    <span>Degree Admissions</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Select Academic Level
                    </label>
                    <select
                      id="hero-level-select"
                      className="w-full bg-[#F8F7F4] border border-[#E5E5E1] text-[#1D1D1B] rounded-lg px-3.5 py-3 text-xs font-medium focus:outline-hidden focus:border-indigo-600"
                      onChange={(e) => {
                        const prog = programs.find((p) => p.level === e.target.value);
                        if (prog) onSelectProgram(prog.id);
                      }}
                    >
                      <option value="">-- Choose Degree Level --</option>
                      <option value="Undergraduate">Undergraduate (B.Tech, BCA, BBA, B.Com, B.Sc, BA)</option>
                      <option value="Postgraduate">Postgraduate (MBA, MCA, M.Com, M.Sc, MA)</option>
                    </select>
                  </div>

                  <div className="bg-[#F8F7F4] rounded-xl p-4 border border-[#E5E5E1] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Admission Session:</span>
                      <span className="font-bold text-[#1D1D1B]">2026 - 2027</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Mode of Exam:</span>
                      <span className="font-bold text-indigo-700">Online Proctored</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Evaluation:</span>
                      <span className="font-bold text-[#1D1D1B]">Automated Scorecard</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('programs')}
                    className="w-full py-3 bg-[#1D1D1B] hover:bg-indigo-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors text-center block"
                  >
                    View All 11 Programs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Step Admission Process Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Step-By-Step Journey</span>
          <h2 className="text-3xl font-serif italic text-[#1D1D1B] mt-1">
            Simplified Online Admission Workflow
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            From registration to entrance test and final admission confirmation — complete everything online seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Student Registration',
              desc: 'Create your secure account to receive your unique student reference ID (e.g. NOU-2026-000001).',
              icon: Users
            },
            {
              step: '02',
              title: 'Fill Application Form',
              desc: 'Complete Personal, Address, Academic, Program Selection, and Declaration details.',
              icon: FileText
            },
            {
              step: '03',
              title: 'Upload Documents',
              desc: 'Upload 10th, 12th, Degree certificates, photograph, and signature for online verification.',
              icon: ShieldCheck
            },
            {
              step: '04',
              title: 'Online Entrance Test',
              desc: 'Take your computer-based entrance examination with real-time countdown timer & auto-save.',
              icon: Laptop
            },
            {
              step: '05',
              title: 'Auto Score Generation',
              desc: 'Server automatically calculates test score, percentage, and generates official scorecard.',
              icon: Sparkles
            },
            {
              step: '06',
              title: 'Eligibility Evaluation',
              desc: 'Application status automatically updates to Eligible for Review based on verified rules.',
              icon: CheckCircle2
            },
            {
              step: '07',
              title: 'Admin Decision',
              desc: 'Faculty & Admin committee reviews application and issues Selection / Confirmation.',
              icon: Award
            },
            {
              step: '08',
              title: 'Admission Confirmed',
              desc: 'Download your official admission letter and access your student learning portal.',
              icon: GraduationCap
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E5E5E1] shadow-2xs hover:border-indigo-300 transition-all relative overflow-hidden group"
              >
                <div className="text-[10px] font-bold tracking-[0.2em] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-3 border border-indigo-100">
                  STEP {item.step}
                </div>
                <h3 className="text-base font-bold text-[#1D1D1B] mb-2 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-indigo-700" />
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Programs Showcase */}
      <section className="bg-white py-16 border-y border-[#E5E5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E5E1] pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Academic Curriculum
              </span>
              <h2 className="text-3xl font-serif italic text-[#1D1D1B] mt-1">
                Degree Programs Offered
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore 6 Undergraduate and 5 Postgraduate online degree programs.
              </p>
            </div>
            <button
              onClick={() => onNavigate('programs')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 hover:text-indigo-900"
            >
              <span>View All 11 Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Undergraduate Programs */}
          <div>
            <h3 className="text-lg font-serif italic text-[#1D1D1B] mb-6 flex items-center gap-2 border-b border-[#E5E5E1] pb-3">
              <GraduationCap className="w-5 h-5 text-indigo-700" />
              <span>Undergraduate Degrees (UG)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ugPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-[#FDFCFB] rounded-2xl p-6 border border-[#E5E5E1] shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded">
                        {prog.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{prog.duration}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#1D1D1B]">{prog.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prog.description}</p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-[#E5E5E1]">
                      <span className="font-bold text-[#1D1D1B]">Eligibility:</span> {prog.eligibility}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#E5E5E1] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Semester</div>
                      <div className="text-base font-bold text-[#1D1D1B]">₹{prog.tuitionFeePerSemester.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectProgram(prog.id);
                        onNavigate('apply');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#1D1D1B] hover:bg-indigo-900 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Postgraduate Programs */}
          <div>
            <h3 className="text-lg font-serif italic text-[#1D1D1B] mb-6 flex items-center gap-2 border-b border-[#E5E5E1] pb-3">
              <Award className="w-5 h-5 text-indigo-700" />
              <span>Postgraduate Degrees (PG)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pgPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-[#FDFCFB] rounded-2xl p-6 border border-[#E5E5E1] shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded">
                        {prog.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{prog.duration}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#1D1D1B]">{prog.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prog.description}</p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-[#E5E5E1]">
                      <span className="font-bold text-[#1D1D1B]">Eligibility:</span> {prog.eligibility}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#E5E5E1] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Semester</div>
                      <div className="text-base font-bold text-[#1D1D1B]">₹{prog.tuitionFeePerSemester.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectProgram(prog.id);
                        onNavigate('apply');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#1D1D1B] hover:bg-indigo-900 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Online Test Engine Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1D1D1B] text-white rounded-2xl p-8 sm:p-12 border border-[#E5E5E1] shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Laptop className="w-3.5 h-3.5 text-indigo-300" />
                <span>Computer-Based Examination System</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif italic">
                Secure Online Entrance Examination Portal
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                NOU features an interactive online entrance exam interface complete with real-time countdown timer, question palette status, automated score calculation, negative marking formulas, and downloadable scorecards.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Auto-saves student responses in real time</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Randomized question bank & options shuffling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant scorecard generation upon final submission</span>
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('entrance-test-info')}
                  className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Entrance Exam Rules & Pattern
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Exam Palette Preview</span>
                  <span className="text-xs font-mono text-indigo-300 font-bold">Timer: 44:52</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                    <div
                      key={q}
                      className={`h-9 rounded flex items-center justify-center font-mono font-bold text-xs ${
                        q <= 4
                          ? 'bg-emerald-600 text-white'
                          : q === 5
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      {q}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-wider pt-2 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
                    <span>Answered (4)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" />
                    <span>Review (1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
