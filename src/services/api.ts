import {
  User,
  Program,
  Application,
  Question,
  EntranceTest,
  TestResult,
  AdminSettings,
  NotificationItem,
  AuditLog,
  ManualEvaluation
} from '../types';

function getToken(): string | null {
  return localStorage.getItem('nou_jwt_token');
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected error occurred.');
  }

  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password?: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (payload: any) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getCurrentUser: () => request<{ user: User }>('/api/auth/me'),

  switchPersona: (role: string, userId?: string) =>
    request<{ token: string; user: User }>('/api/auth/switch-persona', {
      method: 'POST',
      body: JSON.stringify({ role, userId })
    }),

  // Settings & Programs
  getSettings: () => request<AdminSettings>('/api/settings'),
  updateSettings: (payload: Partial<AdminSettings>) =>
    request<AdminSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  getPrograms: () => request<Program[]>('/api/programs'),
  createProgram: (program: Partial<Program>) =>
    request<Program>('/api/programs', {
      method: 'POST',
      body: JSON.stringify(program)
    }),
  updateProgram: (id: string, program: Partial<Program>) =>
    request<Program>(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(program)
    }),

  // Applications
  getMyApplications: () => request<Application[]>('/api/applications/my'),
  getAllApplications: () => request<Application[]>('/api/applications'),
  getApplication: (id: string) => request<Application>(`/api/applications/${id}`),
  saveApplicationDraft: (data: Partial<Application>) =>
    request<Application>('/api/applications/save', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  submitApplication: (id: string) =>
    request<Application>(`/api/applications/${id}/submit`, {
      method: 'POST'
    }),
  verifyDocument: (appId: string, docId: string, status: string, rejectionReason?: string) =>
    request<Application>(`/api/applications/${appId}/documents/${docId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status, rejectionReason })
    }),
  updateApplicationStatus: (id: string, status: string, remarks?: string, assignedTestId?: string) =>
    request<Application>(`/api/applications/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, remarks, assignedTestId })
    }),
  payApplicationFee: (id: string) =>
    request<{ success: boolean; application: Application }>(`/api/applications/${id}/pay-fee`, {
      method: 'POST'
    }),

  // Questions & Tests
  getQuestions: () => request<Question[]>('/api/questions'),
  createQuestion: (q: Partial<Question>) =>
    request<Question>('/api/questions', {
      method: 'POST',
      body: JSON.stringify(q)
    }),
  updateQuestion: (id: string, q: Partial<Question>) =>
    request<Question>(`/api/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(q)
    }),
  deleteQuestion: (id: string) =>
    request<{ success: boolean }>(`/api/questions/${id}`, {
      method: 'DELETE'
    }),
  bulkImportQuestions: (questions: any[]) =>
    request<{ success: boolean; count: number }>('/api/questions/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ questions })
    }),

  getTests: () => request<EntranceTest[]>('/api/tests'),
  createTest: (test: Partial<EntranceTest>) =>
    request<EntranceTest>('/api/tests', {
      method: 'POST',
      body: JSON.stringify(test)
    }),
  updateTest: (id: string, test: Partial<EntranceTest>) =>
    request<EntranceTest>(`/api/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(test)
    }),

  startTestAttempt: (testId: string, applicationId: string) =>
    request<{ attempt: any; test: EntranceTest; questions: Question[] }>(`/api/tests/${testId}/start`, {
      method: 'POST',
      body: JSON.stringify({ applicationId })
    }),
  saveTestProgress: (attemptId: string, answers: any, timeRemainingSeconds: number) =>
    request<{ success: boolean; savedAt: string }>(`/api/tests/attempts/${attemptId}/save`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeRemainingSeconds })
    }),
  submitTestAttempt: (attemptId: string, answers?: any) =>
    request<{ success: boolean; result: TestResult }>(`/api/tests/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),
  getTestResult: (id: string) => request<TestResult>(`/api/tests/results/${id}`),

  // Faculty & Evaluations
  getPendingEvaluations: () => request<ManualEvaluation[]>('/api/evaluations'),
  submitEvaluation: (id: string, marksAwarded: number, comments?: string) =>
    request<{ success: boolean; item: ManualEvaluation; result?: TestResult }>(`/api/evaluations/${id}/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ marksAwarded, comments })
    }),

  // Admin Stats & Logs
  getAdminStats: () =>
    request<{
      totalStudents: number;
      totalApps: number;
      newApps: number;
      pendingApps: number;
      verifiedApps: number;
      selectedStudents: number;
      totalTestsCompleted: number;
      totalTestsPassed: number;
      totalTestsFailed: number;
      appsByProgram: { name: string; count: number }[];
    }>('/api/admin/stats'),
  getAuditLogs: () => request<AuditLog[]>('/api/admin/audit-logs'),

  // Notifications
  getNotifications: () => request<NotificationItem[]>('/api/notifications'),
  markNotificationsRead: () => request<{ success: boolean }>('/api/notifications/mark-read', { method: 'POST' })
};
