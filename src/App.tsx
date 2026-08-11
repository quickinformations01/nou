import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Program, EntranceTest, Question, TestResult, Application } from './types';

// Common UI
import { DemoBanner } from './components/common/DemoBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Public Views
import { HomeView } from './components/public/HomeView';
import { ProgramsView } from './components/public/ProgramsView';
import { AdmissionsView } from './components/public/AdmissionsView';
import { EntranceTestInfoView } from './components/public/EntranceTestInfoView';
import { FacultyView } from './components/public/FacultyView';
import { AboutView, ContactView, FAQsView, ImportantDatesView } from './components/public/InfoPages';

// Student Auth & Dashboard
import { AuthViews } from './components/student/AuthViews';
import { StudentDashboard } from './components/student/StudentDashboard';
import { MultiStepApplication } from './components/student/MultiStepApplication';
import { EntranceTestPortal } from './components/student/EntranceTestPortal';
import { TestResultView } from './components/student/TestResultView';

// Admin / Faculty Modules
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ApplicationManagement } from './components/admin/ApplicationManagement';
import { QuestionBankAdmin } from './components/admin/QuestionBankAdmin';

function MainAppContent() {
  const { user, isAuthenticated, activeRole } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();

  // Application & Test Active State
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeTest, setActiveTest] = useState<EntranceTest | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [testAttemptId, setTestAttemptId] = useState<string>('');
  const [testAppId, setTestAppId] = useState<string>('');
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);

  // Load public program data
  useEffect(() => {
    async function loadProgramsData() {
      try {
        const progs = await api.getPrograms();
        setPrograms(progs);
      } catch (err) {
        console.error('Failed to load programs:', err);
      }
    }
    loadProgramsData();
  }, []);

  // Handle Entrance Test Launch
  const handleOpenEntranceTest = async (testId: string, applicationId: string) => {
    try {
      const { attempt, test, questions } = await api.startTestAttempt(testId, applicationId);
      setActiveTest(test);
      setActiveQuestions(questions);
      setTestAttemptId(attempt.id);
      setTestAppId(applicationId);
      setCurrentPage('test-portal');
    } catch (err: any) {
      alert(err.message || 'Could not start test session.');
    }
  };

  // Handle Viewing Test Scorecard
  const handleViewScorecard = async (resultId: string) => {
    try {
      const res = await api.getTestResult(resultId);
      if (res) {
        setActiveResult(res);
        setCurrentPage('test-result');
      }
    } catch (err: any) {
      alert(err.message || 'Could not load test result.');
    }
  };

  // Render Test Portal full screen (no header/footer)
  if (currentPage === 'test-portal' && activeTest) {
    return (
      <EntranceTestPortal
        test={activeTest}
        questions={activeQuestions}
        attemptId={testAttemptId}
        applicationId={testAppId}
        studentName={user?.name || 'Candidate'}
        onTestSubmitted={(result) => {
          setActiveResult(result);
          setCurrentPage('test-result');
        }}
        onExit={() => setCurrentPage('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1D1D1B] font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <div>
        {/* Role Selector Demo Banner */}
        <DemoBanner onNavigate={setCurrentPage} />

        {/* Global Navigation Header */}
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Dynamic Page Views */}
        <main className="pb-16">
          {currentPage === 'home' && (
            <HomeView
              programs={programs}
              onNavigate={setCurrentPage}
              onSelectProgram={(pId) => {
                setSelectedProgramId(pId);
                setCurrentPage('apply');
              }}
            />
          )}

          {currentPage === 'programs' && (
            <ProgramsView
              programs={programs}
              onNavigate={setCurrentPage}
              onSelectProgram={(pId) => {
                setSelectedProgramId(pId);
                setCurrentPage('apply');
              }}
            />
          )}

          {currentPage === 'admissions' && <AdmissionsView onNavigate={setCurrentPage} />}
          {currentPage === 'test-info' && <EntranceTestInfoView onNavigate={setCurrentPage} />}
          {currentPage === 'faculty' && <FacultyView />}
          {currentPage === 'about' && <AboutView />}
          {currentPage === 'contact' && <ContactView />}
          {currentPage === 'faqs' && <FAQsView />}
          {currentPage === 'dates' && <ImportantDatesView />}

          {/* Student Auth */}
          {(currentPage === 'login' || currentPage === 'register') && (
            <AuthViews initialMode={currentPage as any} onNavigate={setCurrentPage} />
          )}

          {/* Student Dashboard & Portal */}
          {currentPage === 'dashboard' && (
            <StudentDashboard
              programs={programs}
              onStartApplication={(pId) => {
                if (pId) setSelectedProgramId(pId);
                setCurrentPage('apply');
              }}
              onOpenTest={handleOpenEntranceTest}
              onViewResult={handleViewScorecard}
              onNavigatePublic={setCurrentPage}
            />
          )}

          {/* Multi-step Application */}
          {currentPage === 'apply' && (
            <MultiStepApplication
              programs={programs}
              selectedProgramId={selectedProgramId}
              onSubmitted={(app) => {
                alert(`Application submitted successfully! Ref ID: ${app.id}`);
                setCurrentPage('dashboard');
              }}
              onCancel={() => setCurrentPage('dashboard')}
            />
          )}

          {/* Test Result View */}
          {currentPage === 'test-result' && activeResult && (
            <TestResultView result={activeResult} onNavigateDashboard={() => setCurrentPage('dashboard')} />
          )}

          {/* Admin / Faculty Dashboard & Tools */}
          {(currentPage === 'admin' || currentPage === 'admin-dashboard') && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="bg-[#1D1D1B] text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4 border border-[#E5E5E1]">
                <div>
                  <span className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-bold">Admin Control Portal</span>
                  <h1 className="text-2xl font-serif italic mt-1">NOU Admission & Academic Administration</h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('admin-applications')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Applications
                  </button>
                  <button
                    onClick={() => setCurrentPage('admin-questions')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Question Bank
                  </button>
                </div>
              </div>

              <AdminDashboard onNavigateSection={(sec) => setCurrentPage(`admin-${sec}`)} />
            </div>
          )}

          {currentPage === 'admin-applications' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ApplicationManagement programs={programs} />
            </div>
          )}

          {currentPage === 'admin-questions' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <QuestionBankAdmin />
            </div>
          )}
        </main>
      </div>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
