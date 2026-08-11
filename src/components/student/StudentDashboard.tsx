import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Application, EntranceTest, TestResult, Program } from '../../types';
import { api } from '../../services/api';
import { ApplicationStatusTimeline } from './ApplicationStatusTimeline';
import {
  FileText,
  Laptop,
  Award,
  CreditCard,
  Bell,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  User,
  Plus,
  ShieldCheck,
  Download,
  Clock
} from 'lucide-react';

interface StudentDashboardProps {
  programs: Program[];
  onStartApplication: (progId?: string) => void;
  onOpenTest: (testId: string, appId: string) => void;
  onViewResult: (resultId: string) => void;
  onNavigatePublic: (page: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  programs,
  onStartApplication,
  onOpenTest,
  onViewResult,
  onNavigatePublic
}) => {
  const { user, notifications, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [tests, setTests] = useState<EntranceTest[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'applications' | 'documents' | 'test' | 'results' | 'notifications'
  >('overview');

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const myApps = await api.getMyApplications();
      setApplications(myApps);
      const allTests = await api.getTests();
      setTests(allTests);

      if (myApps[0]?.id) {
        try {
          const res = await api.getTestResult(myApps[0].id);
          if (res) setResults([res]);
        } catch {
          // No test result yet
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const currentApp = applications[0]; // Primary application
  const assignedTest = tests.find((t) => t.id === currentApp?.assignedTestId || t.programId === currentApp?.programId);
  const testResult = results[0];

  const handlePayFee = async (appId: string) => {
    try {
      const res = await api.payApplicationFee(appId);
      alert(`Payment successful! Reference Number: ${res.application.paymentReference}`);
      fetchStudentData();
    } catch (e: any) {
      alert(e.message || 'Payment error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header */}
      <div className="bg-[#1D1D1B] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E5E5E1] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white text-[#1D1D1B] flex items-center justify-center font-bold text-2xl font-serif shadow-sm">
            {user?.name?.[0] || 'S'}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-300">
              Student Portal | Academic Year 2026-27
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-bold mt-0.5">{user?.name}</h1>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-4 flex-wrap">
              <span>ID: NOU-2026-00412</span>
              <span>Email: {user?.email}</span>
              <span>Mobile: {user?.mobile}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartApplication()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Program Application</span>
          </button>
        </div>
      </div>

      {/* Primary Action Banner / Clear Next Steps */}
      {currentApp && (
        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-[0.2em]">Recommended Next Step</div>
              <div className="text-base font-bold text-[#1D1D1B] mt-0.5">
                {currentApp.status === 'Application Created'
                  ? 'Complete and submit your application form.'
                  : currentApp.status === 'Entrance Test Required' || currentApp.status === 'Entrance Test Scheduled'
                  ? 'Your documents are verified! Complete your entrance test before August 30.'
                  : currentApp.status === 'Entrance Test Completed' || currentApp.status === 'Result Generated'
                  ? 'Entrance test completed. View your official scorecard.'
                  : currentApp.status === 'Selected' || currentApp.status === 'Admission Confirmed'
                  ? 'Congratulations! Your application has been selected for admission.'
                  : 'Your application is under review by NOU admissions office.'}
              </div>
            </div>
          </div>

          <div>
            {currentApp.status === 'Application Created' ? (
              <button
                onClick={() => onStartApplication(currentApp.programId)}
                className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-indigo-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Resume Form
              </button>
            ) : currentApp.status === 'Entrance Test Required' || currentApp.status === 'Entrance Test Scheduled' ? (
              <button
                onClick={() => assignedTest && onOpenTest(assignedTest.id, currentApp.id)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-md shadow-indigo-100"
              >
                Start Examination
              </button>
            ) : testResult ? (
              <button
                onClick={() => onViewResult(testResult.id)}
                className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-indigo-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
              >
                View Scorecard
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E5E1] pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'applications', label: 'My Application' },
          { id: 'documents', label: 'Documents' },
          { id: 'test', label: 'Entrance Test' },
          { id: 'results', label: 'Test Results' },
          { id: 'notifications', label: `Notifications (${notifications.filter((n) => !n.read).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'bg-[#1D1D1B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Visual Lifecycle Timeline */}
            {currentApp && <ApplicationStatusTimeline currentStatus={currentApp.status} />}

            {/* Grid of Program & Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applied Program Card */}
              <div className="bg-white p-6 border border-[#E5E5E1] rounded-2xl flex flex-col shadow-2xs">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Applied Program</span>
                <h3 className="text-xl font-bold text-[#1D1D1B]">{currentApp?.programTitle || 'Bachelor of Computer Applications (BCA)'}</h3>
                <p className="text-xs text-slate-500 mt-2 flex-1 leading-relaxed">
                  {currentApp?.specialization ? `Specialization in ${currentApp.specialization}` : 'Full-time Online Hybrid Degree Program'}
                </p>
                <div className="mt-6 pt-4 border-t border-[#E5E5E1] flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-600">Duration: 3 Years</span>
                  <button onClick={() => onNavigatePublic('programs')} className="text-indigo-600 font-bold hover:underline uppercase text-[11px] tracking-wider">
                    View Details
                  </button>
                </div>
              </div>

              {/* Document Checklist Card */}
              <div className="bg-white p-6 border border-[#E5E5E1] rounded-2xl flex flex-col shadow-2xs">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Document Checklist</span>
                <ul className="space-y-3 mt-3 flex-1 text-xs">
                  {currentApp?.documents && currentApp.documents.length > 0 ? (
                    currentApp.documents.map((doc) => (
                      <li key={doc.id} className="flex items-center gap-2 text-slate-700">
                        <span className={doc.status === 'Verified' ? 'text-emerald-600 font-bold' : doc.status === 'Rejected' ? 'text-rose-600 font-bold' : 'text-amber-500 font-bold'}>
                          {doc.status === 'Verified' ? '✓' : doc.status === 'Rejected' ? '✕' : '●'}
                        </span>
                        <span className="font-medium">{doc.documentType}</span>
                        <span className="ml-auto text-[10px] text-slate-400 font-mono">({doc.status})</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold">✓</span> 10th & 12th Certificate
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold">✓</span> Identity Proof (Aadhar/Passport)
                      </li>
                      <li className="flex items-center gap-2 text-slate-700">
                        <span className="text-amber-500 font-bold">●</span> Passport Photograph
                      </li>
                    </>
                  )}
                </ul>
                <div className="mt-4 pt-4 border-t border-[#E5E5E1]">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="w-full py-2 bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-200 transition-colors"
                  >
                    MANAGE DOCUMENTS
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E5E1] shadow-2xs space-y-1">
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Application Ref ID</div>
                <div className="text-base font-bold font-mono text-[#1D1D1B]">
                  {currentApp ? currentApp.id : 'NOU-2026-00412'}
                </div>
                <div className="text-[11px] text-slate-500">{currentApp?.programTitle || 'BCA'}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5E1] shadow-2xs space-y-1">
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Entrance Test Score</div>
                <div className="text-base font-bold text-[#1D1D1B]">
                  {testResult ? `${testResult.finalScore} / ${testResult.maxScore} (${testResult.percentage}%)` : 'Pending Exam'}
                </div>
                <div className="text-[11px] font-bold text-indigo-700">
                  {testResult ? (testResult.passed ? 'PASSED' : 'RETAKE REQUIRED') : 'Scheduled'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5E1] shadow-2xs space-y-1">
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Application Fee</div>
                <div className="text-base font-bold text-[#1D1D1B]">
                  {currentApp?.feePaid ? 'Paid' : '₹500 Pending'}
                </div>
                {!currentApp?.feePaid && currentApp && (
                  <button
                    onClick={() => handlePayFee(currentApp.id)}
                    className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider"
                  >
                    Pay Online Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dark Ink Entrance Examination Card */}
            <div className="bg-[#1D1D1B] text-white p-6 rounded-2xl shadow-xl border border-[#E5E5E1] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                    UPSCALE READY
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Due by 30 Aug</span>
                </div>
                <h3 className="text-xl font-serif italic mb-2">NOU Entrance Examination</h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Your application has been verified by the registrar office. You are eligible to attempt the online entrance examination.
                </p>
              </div>

              <div>
                {assignedTest && currentApp ? (
                  <button
                    onClick={() => onOpenTest(assignedTest.id, currentApp.id)}
                    className="w-full py-3 bg-white text-[#1D1D1B] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    Start Examination
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigatePublic('test-info')}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors"
                  >
                    View Examination Syllabus
                  </button>
                )}
                <p className="text-center text-[10px] text-slate-400 mt-4 italic">
                  * Ensure a stable internet connection and webcam access.
                </p>
              </div>
            </div>

            {/* Notification Sidebar Widget */}
            <div className="bg-white border border-[#E5E5E1] rounded-2xl flex flex-col overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E5E5E1] flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1D1D1B]">Notifications</h4>
                <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center rounded-full font-bold">
                  {notifications.length}
                </span>
              </div>
              <div className="divide-y divide-[#E5E5E1] max-h-[280px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-4 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                      <p className="text-xs font-bold text-[#1D1D1B]">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-slate-400 text-center">No new notifications.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY APPLICATION */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Submitted Applications</h3>
            <button
              onClick={() => onStartApplication()}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
            >
              Start New Application
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-slate-500">No applications created yet.</p>
              <button
                onClick={() => onStartApplication()}
                className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold"
              >
                Create Application Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-blue-900">{app.id}</span>
                    <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded text-[10px] font-bold">
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                    <div><strong>Program:</strong> {app.programTitle}</div>
                    <div><strong>Specialization:</strong> {app.specialization}</div>
                    <div><strong>Submitted Date:</strong> {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : 'Draft'}</div>
                    <div><strong>Fee Status:</strong> {app.feePaid ? 'Paid' : 'Unpaid'}</div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {!app.submittedAt && (
                      <button
                        onClick={() => onStartApplication(app.programId)}
                        className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold"
                      >
                        Edit Application
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTS */}
      {activeTab === 'documents' && currentApp && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Application Documents Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentApp.documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{doc.documentType}</div>
                  <div className="text-[11px] text-slate-500">{doc.fileName}</div>
                  {doc.rejectionReason && (
                    <div className="text-rose-600 font-medium text-[11px] mt-1">Reason: {doc.rejectionReason}</div>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                  doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ENTRANCE TEST */}
      {activeTab === 'test' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Assigned Entrance Examination</h3>
          {assignedTest ? (
            <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-3">
              <div className="font-bold text-blue-950 text-sm">{assignedTest.title}</div>
              <div>Duration: {assignedTest.durationMinutes} Minutes | Total Marks: {assignedTest.totalMarks}</div>
              <div>Subjects: {assignedTest.subjectsIncluded.join(', ')}</div>
              <button
                onClick={() => onOpenTest(assignedTest.id, currentApp?.id || 'NOU-2026-000001')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
              >
                Launch Test Portal
              </button>
            </div>
          ) : (
            <p className="text-slate-500">No active test assigned for current status.</p>
          )}
        </div>
      )}

      {/* TAB CONTENT: TEST RESULTS */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Entrance Test Scorecards</h3>
          {testResult ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{testResult.testTitle}</div>
                <div>Score: {testResult.finalScore} / {testResult.maxScore} ({testResult.percentage}%)</div>
              </div>
              <button
                onClick={() => onViewResult(testResult.id)}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold"
              >
                View Full Scorecard
              </button>
            </div>
          ) : (
            <p className="text-slate-500">No test result available yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
