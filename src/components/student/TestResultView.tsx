import React, { useEffect } from 'react';
import { TestResult } from '../../types';
import confetti from 'canvas-confetti';
import { Award, Download, Printer, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ResultProps {
  result: TestResult;
  onNavigateDashboard: () => void;
}

export const TestResultView: React.FC<ResultProps> = ({ result, onNavigateDashboard }) => {
  useEffect(() => {
    if (result.passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.passed]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-8">
      {/* Printable Scorecard Container */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Scorecard Official Header */}
        <div className="border-b-2 border-blue-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
              NOU
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif">
                Nexus Online Institute
              </h1>
              <div className="text-xs font-semibold text-blue-900">
                Official Online Entrance Examination Scorecard 2026
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-xs font-mono font-bold text-slate-500">Result Verification Ref:</div>
            <div className="text-sm font-mono font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 inline-block mt-0.5">
              {result.id}
            </div>
          </div>
        </div>

        {/* Candidate Details & Status Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
          <div className="md:col-span-2 space-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-semibold">Candidate Name:</span>{' '}
              <strong className="text-slate-900 text-sm">{result.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Application Reference ID:</span>{' '}
              <strong className="font-mono text-slate-900">{result.applicationId}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Program Applied:</span>{' '}
              <strong className="text-slate-900">{result.programTitle}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Test Name:</span>{' '}
              <span className="text-slate-800">{result.testTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Test Date & Time:</span>{' '}
              <span className="text-slate-800">{new Date(result.testDate).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Result Status</div>
            {result.passed ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>PASSED</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-rose-700 font-extrabold text-xl">
                <XCircle className="w-6 h-6 text-rose-600" />
                <span>NOT PASSED</span>
              </div>
            )}
            <div className="text-[11px] text-slate-500">Passing Cutoff: {result.passingPercentage}%</div>
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Marks Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Total Score</div>
              <div className="text-2xl font-extrabold text-blue-900 font-mono mt-1">
                {result.finalScore} / {result.maxScore}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Percentage</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                {result.percentage}%
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Correct Answers</div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                {result.correctQuestions} / {result.totalQuestions}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Incorrect Answers</div>
              <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">
                {result.incorrectQuestions}
              </div>
            </div>
          </div>
        </div>

        {/* Official Footer Note */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0" />
            <span>Digitally verified scorecard generated by NOU Admission Engine.</span>
          </div>
          <div>Issue Date: {new Date(result.calculatedAt).toLocaleDateString('en-IN')}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onNavigateDashboard}
          className="px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-xs hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-semibold text-xs hover:bg-blue-950 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Scorecard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
