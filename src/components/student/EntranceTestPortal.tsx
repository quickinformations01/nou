import React, { useState, useEffect, useRef } from 'react';
import { EntranceTest, Question, StudentAnswer, TestResult } from '../../types';
import { api } from '../../services/api';
import {
  Clock,
  CheckCircle2,
  Bookmark,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Send,
  HelpCircle,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface TestPortalProps {
  test: EntranceTest;
  questions: Question[];
  attemptId: string;
  applicationId: string;
  studentName: string;
  initialTimeRemainingSeconds?: number;
  initialAnswers?: Record<string, StudentAnswer>;
  onTestSubmitted: (result: TestResult) => void;
  onExit: () => void;
}

export const EntranceTestPortal: React.FC<TestPortalProps> = ({
  test,
  questions,
  attemptId,
  applicationId,
  studentName,
  initialTimeRemainingSeconds = test.durationMinutes * 60,
  initialAnswers = {},
  onTestSubmitted,
  onExit
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>(initialAnswers);
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemainingSeconds);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const currentQ = questions[currentIdx] || questions[0];

  // Real-time Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitOnTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Periodic Auto-Save to Server every 15 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      try {
        setSyncing(true);
        await api.saveTestProgress(attemptId, answers, timeRemaining);
        setNetworkError(false);
      } catch (e) {
        console.warn('Auto-save network error, storing locally:', e);
        setNetworkError(true);
      } finally {
        setSyncing(false);
      }
    }, 15000);

    return () => clearInterval(autoSaveInterval);
  }, [answers, timeRemaining, attemptId]);

  const handleAutoSubmitOnTimer = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitTestAttempt(attemptId, answers);
      onTestSubmitted(res.result);
    } catch (e) {
      console.error(e);
      alert('Time expired. Submitting test...');
    }
  };

  const currentAns: StudentAnswer = answers[currentQ?.id] || {
    questionId: currentQ?.id,
    status: 'Not Answered'
  };

  const handleSelectOption = (optId: string) => {
    if (!currentQ) return;
    let selected: string | string[];

    if (currentQ.type === 'Multiple Select') {
      const existing = Array.isArray(currentAns.selectedOption)
        ? currentAns.selectedOption
        : currentAns.selectedOption
        ? [currentAns.selectedOption]
        : [];
      if (existing.includes(optId)) {
        selected = existing.filter((o) => o !== optId);
      } else {
        selected = [...existing, optId];
      }
    } else {
      selected = optId;
    }

    setAnswers({
      ...answers,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: selected,
        status: 'Answered'
      }
    });
  };

  const handleShortAnswerChange = (text: string) => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        questionId: currentQ.id,
        shortAnswerText: text,
        status: text.trim().length > 0 ? 'Answered' : 'Not Answered'
      }
    });
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        ...currentAns,
        status: 'Marked for Review'
      }
    });
  };

  const handleClearAnswer = () => {
    if (!currentQ) return;
    const newAns = { ...answers };
    delete newAns[currentQ.id];
    setAnswers(newAns);
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await api.submitTestAttempt(attemptId, answers);
      setShowSubmitModal(false);
      onTestSubmitted(res.result);
    } catch (err: any) {
      alert(err.message || 'Submission error');
      setSubmitting(false);
    }
  };

  // Metrics for question palette
  const totalQCount = questions.length;
  const answeredCount = Object.values(answers).filter((a) => (a as StudentAnswer).status === 'Answered').length;
  const markedCount = Object.values(answers).filter((a) => (a as StudentAnswer).status === 'Marked for Review').length;
  const unansweredCount = totalQCount - answeredCount - markedCount;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Test Portal Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white font-serif font-bold text-base flex items-center justify-center">
            NOU
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">{test.title}</h2>
            <div className="text-[11px] text-slate-400">
              Student: <span className="font-semibold text-slate-200">{studentName}</span> | App Ref:{' '}
              <span className="font-mono text-blue-300">{applicationId}</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border font-mono font-bold text-base ${
              timeRemaining < 300
                ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                : 'bg-slate-900 text-emerald-400 border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formattedTime}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Examination View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Question Screen */}
        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto bg-slate-900">
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Question Info Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <div className="font-bold text-slate-300 flex items-center gap-2">
                <span className="bg-blue-900/80 text-blue-300 px-2.5 py-1 rounded font-mono">
                  Question {currentIdx + 1} of {totalQCount}
                </span>
                <span className="text-slate-400">Subject: {currentQ?.subject || 'General'}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <span>Marks: +{currentQ?.marks || 5}</span>
                <span>Negative: -{currentQ?.negativeMarks || 1}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-white leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              {currentQ?.questionText}
            </div>

            {/* Answer Controls based on type */}
            {currentQ?.type === 'Short Answer' ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400">Write your answer below:</label>
                <textarea
                  rows={5}
                  value={currentAns.shortAnswerText || ''}
                  onChange={(e) => handleShortAnswerChange(e.target.value)}
                  placeholder="Type your explanation or response here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {currentQ?.options?.map((opt) => {
                  let isSelected = false;
                  if (currentQ.type === 'Multiple Select') {
                    isSelected =
                      Array.isArray(currentAns.selectedOption) && currentAns.selectedOption.includes(opt.id);
                  } else {
                    isSelected = currentAns.selectedOption === opt.id;
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-2xl border text-sm font-medium cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-950/90 border-blue-500 text-white shadow-md'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-600 text-slate-400'
                        }`}
                      >
                        {opt.id.split('-')[1]?.toUpperCase() || '•'}
                      </div>
                      <span>{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Action Control Bar */}
          <div className="pt-6 border-t border-slate-800 max-w-4xl mx-auto w-full flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReview}
                className="px-3.5 py-2 rounded-xl bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                <span>Mark for Review</span>
              </button>

              <button
                onClick={handleClearAnswer}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear Answer</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  if (currentIdx < totalQCount - 1) {
                    setCurrentIdx(currentIdx + 1);
                  } else {
                    setShowSubmitModal(true);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center gap-1"
              >
                <span>Save & Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Question Palette & Overview */}
        <div className="w-80 bg-slate-950 border-l border-slate-800 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Question Palette
            </h3>

            {/* Question Buttons Palette */}
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                let bgClass = 'bg-slate-900 text-slate-400 border border-slate-800';
                if (ans?.status === 'Answered') bgClass = 'bg-emerald-600 text-white font-bold';
                else if (ans?.status === 'Marked for Review') bgClass = 'bg-amber-500 text-white font-bold';

                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-xl text-xs font-mono transition-all flex items-center justify-center ${bgClass} ${
                      isCurrent ? 'ring-2 ring-white scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend Stats */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Answered:</span>
                </span>
                <span className="font-bold">{answeredCount}</span>
              </div>

              <div className="flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Marked for Review:</span>
                </span>
                <span className="font-bold">{markedCount}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span>Unanswered:</span>
                </span>
                <span className="font-bold">{unansweredCount}</span>
              </div>
            </div>
          </div>

          {/* Sync Status Footer */}
          <div className="text-[11px] text-slate-500 text-center border-t border-slate-800 pt-3">
            {syncing ? 'Auto-saving to server...' : 'Progress synced'}
          </div>
        </div>
      </div>

      {/* Final Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif">Confirm Final Submission</h3>
              <p className="text-xs text-slate-300">
                You are about to complete and lock your entrance test.
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span>{totalQCount}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Answered:</span>
                <span>{answeredCount}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Marked for Review:</span>
                <span>{markedCount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Unanswered:</span>
                <span>{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs transition-colors"
              >
                Return to Test
              </button>

              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs transition-colors"
              >
                {submitting ? 'Calculating...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
