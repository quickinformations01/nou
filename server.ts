import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { loadDatabase, saveDatabase } from './server/db.js';
import {
  User,
  Application,
  ApplicationStatus,
  ApplicationDocument,
  EntranceTest,
  Question,
  TestAttempt,
  StudentAnswer,
  TestResult,
  ManualEvaluation,
  NotificationItem,
  AuditLog
} from './src/types.js';

const JWT_SECRET = 'NOU_NEXUS_ONLINE_INSTITUTE_SECRET_KEY_2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const db = loadDatabase();

  // Helper middleware for auth
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      // Fallback guest/dev mode user if query param or header missing
      req.user = db.users[0];
      return next();
    }
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        req.user = db.users[0];
        return next();
      }
      req.user = user;
      next();
    });
  };

  const addAuditLog = (actor: User, action: string, target: string, details: string) => {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      target,
      details,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(log);
    saveDatabase();
  };

  const addNotification = (userId: string, title: string, message: string, type: 'info'|'success'|'warning'|'alert' = 'info', link?: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      link
    };
    db.notifications.unshift(notif);
    saveDatabase();
  };

  // ================= API ROUTES =================

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', institution: db.settings.institutionName });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (user.passwordHash) {
      const valid = bcrypt.compareSync(password || '', user.passwordHash);
      if (!valid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });
    res.json({ token, user });
  });

  // Auth: Register Student
  app.post('/api/auth/register', (req, res) => {
    const { name, email, mobile, password, dateOfBirth, gender, state, city } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: 'Please provide all required registration fields.' });
    }

    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    if (db.users.some((u) => u.mobile === mobile)) {
      return res.status(400).json({ error: 'An account with this mobile number already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser: User & { passwordHash?: string } = {
      id: `usr-student-${Date.now()}`,
      name,
      email,
      mobile,
      role: 'student',
      dateOfBirth,
      gender,
      state,
      city,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    db.users.push(newUser);
    saveDatabase();

    addNotification(
      newUser.id,
      'Welcome to NOU!',
      'Your account has been registered successfully. Start your admission application today!',
      'success'
    );

    addAuditLog(newUser, 'STUDENT_REGISTERED', newUser.email, `Student account created for ${name}`);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: newUser });
  });

  // Auth: Current User
  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user = db.users.find((u) => u.id === req.user.id);
    res.json({ user: user || req.user });
  });

  // Auth: Switch Persona (Quick Dev Testing)
  app.post('/api/auth/switch-persona', (req, res) => {
    const { role, userId } = req.body;
    let user = db.users.find((u) => u.id === userId || u.role === role);
    if (!user) {
      user = db.users[0];
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });
    res.json({ token, user });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permission required.' });
    }
    db.settings = { ...db.settings, ...req.body };
    saveDatabase();
    addAuditLog(req.user, 'SETTINGS_UPDATED', 'AdminSettings', 'Updated system parameters');
    res.json(db.settings);
  });

  // Programs
  app.get('/api/programs', (req, res) => {
    res.json(db.programs);
  });

  app.post('/api/programs', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    const newProg = { ...req.body, id: `prog-${Date.now()}` };
    db.programs.push(newProg);
    saveDatabase();
    addAuditLog(req.user, 'PROGRAM_CREATED', newProg.code, `Created program ${newProg.title}`);
    res.json(newProg);
  });

  app.put('/api/programs/:id', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    const idx = db.programs.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Program not found' });
    db.programs[idx] = { ...db.programs[idx], ...req.body };
    saveDatabase();
    addAuditLog(req.user, 'PROGRAM_UPDATED', db.programs[idx].code, `Updated program ${db.programs[idx].title}`);
    res.json(db.programs[idx]);
  });

  // Applications: My Applications (Student)
  app.get('/api/applications/my', authenticateToken, (req: any, res) => {
    const apps = db.applications.filter((a) => a.studentId === req.user.id || a.studentEmail === req.user.email);
    res.json(apps);
  });

  // Applications: All Applications (Admin/Faculty)
  app.get('/api/applications', authenticateToken, (req: any, res) => {
    res.json(db.applications);
  });

  // Applications: Single Application
  app.get('/api/applications/:id', authenticateToken, (req: any, res) => {
    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });
    res.json(appItem);
  });

  // Applications: Save Draft or Create
  app.post('/api/applications/save', authenticateToken, (req: any, res) => {
    const data = req.body;
    let existing = db.applications.find((a) => a.id === data.id);

    if (!existing) {
      // Generate unique NOU-2026-XXXXXX ID
      const count = db.applications.length + 1;
      const appId = `NOU-2026-${String(count).padStart(6, '0')}`;
      existing = {
        id: appId,
        studentId: req.user.id,
        studentName: req.user.name,
        studentEmail: req.user.email,
        studentMobile: req.user.mobile || data.mobile || '',
        fatherName: data.fatherName || '',
        motherName: data.motherName || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        nationality: data.nationality || 'Indian',
        category: data.category || 'General',
        permanentAddress: data.permanentAddress || { addressLine: '', city: '', state: '', pinCode: '' },
        correspondenceAddress: data.correspondenceAddress || { addressLine: '', city: '', state: '', pinCode: '' },
        sameAsPermanent: data.sameAsPermanent ?? true,
        qualifications: data.qualifications || [],
        academicSession: db.settings.academicSession,
        programId: data.programId || '',
        programTitle: data.programTitle || '',
        programLevel: data.programLevel || 'Undergraduate',
        specialization: data.specialization || '',
        preferredStudyMode: data.preferredStudyMode || 'Online Interactive',
        documents: data.documents || [],
        declarationAgreed: false,
        status: 'Application Created',
        createdAt: new Date().toISOString(),
        statusHistory: [
          {
            id: `sh-${Date.now()}`,
            status: 'Application Created',
            changedBy: req.user.name,
            changedAt: new Date().toISOString()
          }
        ],
        feePaid: false
      };
      db.applications.push(existing);
    } else {
      // Update draft
      if (existing.status !== 'Application Created' && req.user.role === 'student') {
        return res.status(400).json({ error: 'Submitted applications are locked for editing.' });
      }
      Object.assign(existing, data);
    }

    saveDatabase();
    res.json(existing);
  });

  // Applications: Submit Application
  app.post('/api/applications/:id/submit', authenticateToken, (req: any, res) => {
    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });

    appItem.status = 'Application Submitted';
    appItem.submittedAt = new Date().toISOString();
    appItem.declarationAgreed = true;
    appItem.statusHistory.unshift({
      id: `sh-${Date.now()}`,
      status: 'Application Submitted',
      changedBy: req.user.name,
      changedAt: new Date().toISOString(),
      remarks: 'Application submitted successfully by student.'
    });

    saveDatabase();

    addNotification(
      appItem.studentId,
      'Application Submitted',
      `Your admission application ${appItem.id} for ${appItem.programTitle} has been submitted successfully and is now under verification.`,
      'success',
      '/dashboard'
    );

    addAuditLog(req.user, 'APPLICATION_SUBMITTED', appItem.id, `Submitted application for ${appItem.programTitle}`);

    res.json(appItem);
  });

  // Applications: Document Verification (Admin)
  app.post('/api/applications/:id/documents/:docId/verify', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    const { status, rejectionReason } = req.body;
    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });

    const doc = appItem.documents.find((d) => d.id === req.params.docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.status = status;
    if (rejectionReason) doc.rejectionReason = rejectionReason;

    saveDatabase();

    addNotification(
      appItem.studentId,
      `Document ${status}`,
      `Your document (${doc.documentType}) has been marked as ${status}.${rejectionReason ? ' Reason: ' + rejectionReason : ''}`,
      status === 'Verified' ? 'success' : 'alert'
    );

    res.json(appItem);
  });

  // Applications: Status Change & Action (Admin)
  app.post('/api/applications/:id/status', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    const { status, remarks, assignedTestId } = req.body;
    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });

    appItem.status = status as ApplicationStatus;
    if (assignedTestId) appItem.assignedTestId = assignedTestId;

    appItem.statusHistory.unshift({
      id: `sh-${Date.now()}`,
      status: status as ApplicationStatus,
      changedBy: req.user.name,
      changedAt: new Date().toISOString(),
      remarks
    });

    saveDatabase();

    addNotification(
      appItem.studentId,
      `Application Status Update: ${status}`,
      `Your application ${appItem.id} status changed to "${status}".${remarks ? ' Note: ' + remarks : ''}`,
      'info'
    );

    addAuditLog(req.user, 'STATUS_CHANGED', appItem.id, `Changed status to ${status}. Remarks: ${remarks || 'N/A'}`);

    res.json(appItem);
  });

  // Applications: Pay Application Fee (Mock)
  app.post('/api/applications/:id/pay-fee', authenticateToken, (req: any, res) => {
    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });

    appItem.feePaid = true;
    appItem.paymentReference = `PAY-NOU-${Math.floor(100000 + Math.random() * 900000)}`;

    saveDatabase();

    addNotification(
      appItem.studentId,
      'Fee Payment Successful',
      `Payment receipt generated for ${appItem.id}. Ref: ${appItem.paymentReference}`,
      'success'
    );

    res.json({ success: true, application: appItem });
  });

  // Question Bank CRUD & CSV
  app.get('/api/questions', (req, res) => {
    res.json(db.questions);
  });

  app.post('/api/questions', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
    const newQ: Question = {
      ...req.body,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdBy: req.user.name
    };
    db.questions.push(newQ);
    saveDatabase();
    addAuditLog(req.user, 'QUESTION_CREATED', newQ.id, `Added question: ${newQ.questionText.slice(0, 40)}...`);
    res.json(newQ);
  });

  app.put('/api/questions/:id', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
    const idx = db.questions.findIndex((q) => q.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Question not found' });
    db.questions[idx] = { ...db.questions[idx], ...req.body };
    saveDatabase();
    res.json(db.questions[idx]);
  });

  app.delete('/api/questions/:id', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    db.questions = db.questions.filter((q) => q.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Question CSV Bulk Import
  app.post('/api/questions/bulk-import', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') return res.status(403).json({ error: 'Unauthorized' });
    const { questions } = req.body; // array of raw imported objects
    if (!Array.isArray(questions)) return res.status(400).json({ error: 'Invalid JSON array' });

    let addedCount = 0;
    questions.forEach((qItem: any) => {
      const newQ: Question = {
        id: `q-csv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        questionText: qItem.question || qItem.questionText || '',
        type: qItem.type || 'MCQ',
        programCode: qItem.program || qItem.programCode || 'ALL',
        subject: qItem.subject || 'General',
        difficulty: qItem.difficulty || 'Medium',
        marks: Number(qItem.marks) || 5,
        negativeMarks: Number(qItem.negativeMarks) || 1,
        options: [
          { id: 'opt-a', text: qItem.option_a || 'Option A' },
          { id: 'opt-b', text: qItem.option_b || 'Option B' },
          { id: 'opt-c', text: qItem.option_c || 'Option C' },
          { id: 'opt-d', text: qItem.option_d || 'Option D' }
        ],
        correctAnswer: qItem.correct_answer || 'opt-a',
        explanation: qItem.explanation || '',
        active: true,
        createdBy: req.user.name
      };
      if (newQ.questionText) {
        db.questions.push(newQ);
        addedCount++;
      }
    });

    saveDatabase();
    addAuditLog(req.user, 'BULK_QUESTIONS_IMPORTED', 'QuestionBank', `Imported ${addedCount} questions via CSV`);
    res.json({ success: true, count: addedCount });
  });

  // Entrance Tests CRUD
  app.get('/api/tests', (req, res) => {
    res.json(db.tests);
  });

  app.post('/api/tests', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    const newTest: EntranceTest = {
      ...req.body,
      id: `test-${Date.now()}`
    };
    db.tests.push(newTest);
    saveDatabase();
    addAuditLog(req.user, 'TEST_CREATED', newTest.id, `Created test ${newTest.title}`);
    res.json(newTest);
  });

  app.put('/api/tests/:id', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    const idx = db.tests.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Test not found' });
    db.tests[idx] = { ...db.tests[idx], ...req.body };
    saveDatabase();
    res.json(db.tests[idx]);
  });

  // Start or Resume Test Attempt
  app.post('/api/tests/:testId/start', authenticateToken, (req: any, res) => {
    const { testId } = req.params;
    const { applicationId } = req.body;

    const test = db.tests.find((t) => t.id === testId);
    if (!test) return res.status(404).json({ error: 'Entrance test not found' });

    const application = db.applications.find((a) => a.id === applicationId);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    // Check if attempt already exists
    let attempt = db.testAttempts.find(
      (at) => at.testId === testId && at.studentId === req.user.id && at.applicationId === applicationId
    );

    if (attempt) {
      if (attempt.isSubmitted) {
        return res.status(400).json({ error: 'Test attempt has already been submitted and locked.' });
      }
      return res.json({ attempt, test, questions: getAssignedQuestionsForAttempt(attempt) });
    }

    // Select random questions for student from bank according to test rules
    const programCode = test.programCode;
    let pool = db.questions.filter(
      (q) => (q.programCode === programCode || q.programCode === 'ALL' || !q.programCode) && q.active
    );

    if (pool.length === 0) {
      pool = db.questions.filter((q) => q.active);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, test.totalQuestionsToDisplay || 10);
    const assignedQuestionIds = selectedQuestions.map((q) => q.id);

    attempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      testId,
      testTitle: test.title,
      studentId: req.user.id,
      applicationId,
      studentName: req.user.name,
      assignedQuestionIds,
      answers: {},
      startTime: new Date().toISOString(),
      timeRemainingSeconds: test.durationMinutes * 60,
      isSubmitted: false
    };

    db.testAttempts.push(attempt);
    saveDatabase();

    addAuditLog(req.user, 'TEST_STARTED', test.title, `Started entrance test attempt for ${applicationId}`);

    res.json({ attempt, test, questions: selectedQuestions });
  });

  function getAssignedQuestionsForAttempt(attempt: TestAttempt) {
    return attempt.assignedQuestionIds
      .map((qId) => db.questions.find((q) => q.id === qId))
      .filter(Boolean) as Question[];
  }

  // Auto-Save Test Progress
  app.post('/api/tests/attempts/:attemptId/save', authenticateToken, (req: any, res) => {
    const { attemptId } = req.params;
    const { answers, timeRemainingSeconds } = req.body;

    const attempt = db.testAttempts.find((a) => a.id === attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.isSubmitted) return res.status(400).json({ error: 'Attempt locked' });

    attempt.answers = answers || attempt.answers;
    if (typeof timeRemainingSeconds === 'number') {
      attempt.timeRemainingSeconds = timeRemainingSeconds;
    }

    saveDatabase();
    res.json({ success: true, savedAt: new Date().toISOString() });
  });

  // Submit Test & Calculate Results Server-Side
  app.post('/api/tests/attempts/:attemptId/submit', authenticateToken, (req: any, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = db.testAttempts.find((a) => a.id === attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    const test = db.tests.find((t) => t.id === attempt.testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const application = db.applications.find((a) => a.id === attempt.applicationId);

    if (answers) {
      attempt.answers = answers;
    }

    attempt.isSubmitted = true;
    attempt.submittedAt = new Date().toISOString();

    // Server-Side Evaluation
    const assignedQuestions = getAssignedQuestionsForAttempt(attempt);
    let attemptedQuestions = 0;
    let correctQuestions = 0;
    let incorrectQuestions = 0;
    let unansweredQuestions = 0;

    let positiveScore = 0;
    let negativeScore = 0;
    let hasShortAnswerRequiringManual = false;

    assignedQuestions.forEach((q) => {
      const studentAns: StudentAnswer | undefined = attempt.answers[q.id];
      if (!studentAns || (studentAns.status === 'Not Answered' && !studentAns.selectedOption && !studentAns.shortAnswerText)) {
        unansweredQuestions++;
        return;
      }

      attemptedQuestions++;

      if (q.type === 'Short Answer') {
        hasShortAnswerRequiringManual = true;
        // Create manual evaluation item for faculty
        const manualItem: ManualEvaluation = {
          id: `meval-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          attemptId: attempt.id,
          questionId: q.id,
          studentId: attempt.studentId,
          studentName: attempt.studentName,
          studentAnswerText: studentAns.shortAnswerText || '',
          maxMarks: q.marks,
          status: 'Pending'
        };
        db.manualEvaluations.push(manualItem);
        return;
      }

      // MCQ / TrueFalse / Multiple Select
      let isCorrect = false;
      if (q.type === 'MCQ' || q.type === 'True/False') {
        isCorrect = studentAns.selectedOption === q.correctAnswer;
      } else if (q.type === 'Multiple Select') {
        const studentSelected = Array.isArray(studentAns.selectedOption) ? studentAns.selectedOption : [studentAns.selectedOption];
        const correctList = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        isCorrect =
          studentSelected.length === correctList.length &&
          studentSelected.every((val) => correctList.includes(val));
      }

      if (isCorrect) {
        correctQuestions++;
        positiveScore += q.marks || test.positiveMarksPerQuestion || 5;
      } else {
        incorrectQuestions++;
        negativeScore += q.negativeMarks || test.negativeMarksPerQuestion || 1;
      }
    });

    const maxScore = assignedQuestions.reduce((acc, q) => acc + (q.marks || 5), 0);
    const finalScore = Math.max(0, positiveScore - negativeScore);
    const percentage = maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0;
    const passed = percentage >= test.passingPercentage;

    const resultId = `NOU-RESULT-2026-${String(db.testResults.length + 101).padStart(6, '0')}`;

    const testResult: TestResult = {
      id: resultId,
      attemptId: attempt.id,
      testId: test.id,
      testTitle: test.title,
      studentId: attempt.studentId,
      studentName: attempt.studentName,
      applicationId: attempt.applicationId,
      programTitle: application?.programTitle || test.programTitle,
      testDate: new Date().toISOString(),
      totalQuestions: assignedQuestions.length,
      attemptedQuestions,
      correctQuestions,
      incorrectQuestions,
      unansweredQuestions,
      positiveScore,
      negativeScore,
      finalScore,
      maxScore,
      percentage,
      passed,
      passingPercentage: test.passingPercentage,
      requiresManualEvaluation: hasShortAnswerRequiringManual,
      manualEvaluationCompleted: !hasShortAnswerRequiringManual,
      calculatedAt: new Date().toISOString()
    };

    db.testResults.push(testResult);

    // Update Application Status
    if (application) {
      application.status = 'Entrance Test Completed';
      application.statusHistory.unshift({
        id: `sh-${Date.now()}`,
        status: 'Entrance Test Completed',
        changedBy: 'System Auto-Evaluator',
        changedAt: new Date().toISOString(),
        remarks: `Entrance test score: ${finalScore}/${maxScore} (${percentage}%). Result: ${passed ? 'PASSED' : 'NOT PASSED'}`
      });

      if (passed && application.documents.every((d) => d.status === 'Verified')) {
        application.status = 'Eligible for Review';
        application.statusHistory.unshift({
          id: `sh-${Date.now()}-2`,
          status: 'Eligible for Review',
          changedBy: 'System Rule Engine',
          changedAt: new Date().toISOString(),
          remarks: 'Applicant verified and passed entrance test. Recommended for final admission decision.'
        });
      }
    }

    saveDatabase();

    addNotification(
      attempt.studentId,
      'Entrance Test Result Ready',
      `Your entrance test result for ${test.title} is now available. Final Score: ${finalScore}/${maxScore} (${percentage}%).`,
      passed ? 'success' : 'alert',
      `/result/${resultId}`
    );

    addAuditLog(
      req.user,
      'TEST_SUBMITTED',
      attempt.applicationId,
      `Submitted attempt for ${test.title}. Score: ${finalScore}/${maxScore}`
    );

    res.json({ success: true, result: testResult });
  });

  // Get Test Result
  app.get('/api/tests/results/:id', authenticateToken, (req: any, res) => {
    const result = db.testResults.find((r) => r.id === req.params.id || r.attemptId === req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json(result);
  });

  // Faculty: Manual Evaluations
  app.get('/api/evaluations', authenticateToken, (req: any, res) => {
    res.json(db.manualEvaluations);
  });

  app.post('/api/evaluations/:id/evaluate', authenticateToken, (req: any, res) => {
    if (req.user?.role !== 'faculty' && req.user?.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const { marksAwarded, comments } = req.body;
    const item = db.manualEvaluations.find((m) => m.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Evaluation item not found' });

    item.marksAwarded = Number(marksAwarded);
    item.comments = comments;
    item.facultyId = req.user.id;
    item.facultyName = req.user.name;
    item.evaluatedAt = new Date().toISOString();
    item.status = 'Evaluated';

    // Recalculate test result
    const result = db.testResults.find((r) => r.attemptId === item.attemptId);
    if (result) {
      result.positiveScore += Number(marksAwarded);
      result.finalScore = Math.max(0, result.positiveScore - result.negativeScore);
      result.percentage = Math.round((result.finalScore / result.maxScore) * 100);
      result.passed = result.percentage >= result.passingPercentage;
      result.manualEvaluationCompleted = true;
    }

    saveDatabase();
    res.json({ success: true, item, result });
  });

  // Notifications
  app.get('/api/notifications', authenticateToken, (req: any, res) => {
    const notifs = db.notifications.filter((n) => n.userId === req.user.id || req.user.role === 'admin');
    res.json(notifs);
  });

  app.post('/api/notifications/mark-read', authenticateToken, (req: any, res) => {
    db.notifications.forEach((n) => {
      if (n.userId === req.user.id) n.read = true;
    });
    saveDatabase();
    res.json({ success: true });
  });

  // Admin Dashboard Stats & Metrics
  app.get('/api/admin/stats', authenticateToken, (req: any, res) => {
    const totalStudents = db.users.filter((u) => u.role === 'student').length;
    const totalApps = db.applications.length;
    const newApps = db.applications.filter((a) => a.status === 'Application Submitted' || a.status === 'Application Created').length;
    const pendingApps = db.applications.filter((a) => a.status === 'Documents Under Review' || a.status === 'Application Submitted').length;
    const verifiedApps = db.applications.filter((a) => a.status === 'Documents Verified' || a.status === 'Entrance Test Required').length;
    const selectedStudents = db.applications.filter((a) => a.status === 'Selected' || a.status === 'Admission Confirmed').length;

    const totalTestsCompleted = db.testResults.length;
    const totalTestsPassed = db.testResults.filter((r) => r.passed).length;
    const totalTestsFailed = db.testResults.filter((r) => !r.passed).length;

    // Applications by Program chart data
    const appsByProgramMap: Record<string, number> = {};
    db.applications.forEach((a) => {
      appsByProgramMap[a.programTitle] = (appsByProgramMap[a.programTitle] || 0) + 1;
    });
    const appsByProgram = Object.keys(appsByProgramMap).map((key) => ({
      name: key.split('—')[0].trim(),
      count: appsByProgramMap[key]
    }));

    res.json({
      totalStudents,
      totalApps,
      newApps,
      pendingApps,
      verifiedApps,
      selectedStudents,
      totalTestsCompleted,
      totalTestsPassed,
      totalTestsFailed,
      appsByProgram
    });
  });

  // Audit Logs
  app.get('/api/admin/audit-logs', authenticateToken, (req: any, res) => {
    res.json(db.auditLogs);
  });

  // ================= VITE MIDDLEWARE SETUP =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOU Nexus Online Institute server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
