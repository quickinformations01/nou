import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Program,
  Application,
  EntranceTest,
  Question,
  TestAttempt,
  TestResult,
  ManualEvaluation,
  NotificationItem,
  AuditLog,
  AdminSettings
} from '../src/types.js';
import { initialPrograms, initialAdminSettings, initialTests, sampleQuestions } from './seedData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: (User & { passwordHash?: string })[];
  programs: Program[];
  applications: Application[];
  tests: EntranceTest[];
  questions: Question[];
  testAttempts: TestAttempt[];
  testResults: TestResult[];
  manualEvaluations: ManualEvaluation[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  settings: AdminSettings;
}

let dbInstance: DatabaseSchema | null = null;

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadDatabase(): DatabaseSchema {
  if (dbInstance) return dbInstance;
  ensureDataDirExists();

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbInstance = JSON.parse(data);
      console.log('Database loaded successfully from file.');
      return dbInstance!;
    } catch (err) {
      console.error('Error reading db.json, re-initializing database:', err);
    }
  }

  // Seed default database
  const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
  const studentPasswordHash = bcrypt.hashSync('student123', 10);
  const facultyPasswordHash = bcrypt.hashSync('faculty123', 10);

  const seededUsers: (User & { passwordHash?: string })[] = [
    {
      id: 'usr-admin-1',
      name: 'Dr. Anand Mehta',
      email: 'admin@nou.edu.in',
      mobile: '9876543210',
      role: 'admin',
      createdAt: new Date().toISOString(),
      passwordHash: defaultPasswordHash
    },
    {
      id: 'usr-faculty-1',
      name: 'Prof. Suresh Kapoor',
      email: 'faculty.cs@nou.edu.in',
      mobile: '9876543211',
      role: 'faculty',
      department: 'Computer Science & Applications',
      assignedProgramIds: ['prog-btech', 'prog-bca', 'prog-mca'],
      createdAt: new Date().toISOString(),
      passwordHash: facultyPasswordHash
    },
    {
      id: 'usr-faculty-2',
      name: 'Dr. Meenakshi Sundaram',
      email: 'faculty.biz@nou.edu.in',
      mobile: '9876543212',
      role: 'faculty',
      department: 'Business & Commerce',
      assignedProgramIds: ['prog-bba', 'prog-mba', 'prog-bcom'],
      createdAt: new Date().toISOString(),
      passwordHash: facultyPasswordHash
    },
    {
      id: 'usr-student-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      mobile: '9123456789',
      role: 'student',
      dateOfBirth: '2004-05-15',
      gender: 'Male',
      state: 'Maharashtra',
      city: 'Mumbai',
      createdAt: new Date().toISOString(),
      passwordHash: studentPasswordHash
    },
    {
      id: 'usr-student-2',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      mobile: '9876123456',
      role: 'student',
      dateOfBirth: '2003-08-22',
      gender: 'Female',
      state: 'Gujarat',
      city: 'Ahmedabad',
      createdAt: new Date().toISOString(),
      passwordHash: studentPasswordHash
    }
  ];

  const sampleApplication1: Application = {
    id: 'NOU-2026-000001',
    studentId: 'usr-student-1',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@gmail.com',
    studentMobile: '9123456789',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    dateOfBirth: '2004-05-15',
    gender: 'Male',
    nationality: 'Indian',
    category: 'General',
    permanentAddress: {
      addressLine: 'Flat 402, Green Valley Heights, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400053'
    },
    correspondenceAddress: {
      addressLine: 'Flat 402, Green Valley Heights, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400053'
    },
    sameAsPermanent: true,
    qualifications: [
      {
        id: 'q-1',
        qualification: '10th',
        boardOrUniversity: 'CBSE',
        institution: 'Delhi Public School, Mumbai',
        passingYear: 2020,
        rollNumber: 'CBSE-2020-8812',
        subjects: 'English, Math, Science, Social Studies, Hindi',
        maxMarks: 500,
        obtainedMarks: 440,
        percentage: 88,
        grade: 'A1'
      },
      {
        id: 'q-2',
        qualification: '12th',
        boardOrUniversity: 'Maharashtra State Board',
        institution: 'St. Xavier Junior College, Mumbai',
        passingYear: 2022,
        rollNumber: 'MH-12-77123',
        subjects: 'Physics, Chemistry, Mathematics, English, CS',
        maxMarks: 600,
        obtainedMarks: 510,
        percentage: 85,
        grade: 'A'
      }
    ],
    academicSession: '2026 - 2027',
    programId: 'prog-bca',
    programTitle: 'BCA — Bachelor of Computer Applications',
    programLevel: 'Undergraduate',
    specialization: 'Full Stack Development',
    preferredStudyMode: 'Online Interactive',
    documents: [
      {
        id: 'doc-1',
        documentType: 'Passport Photograph',
        fileName: 'rahul_photo.jpg',
        uploadedAt: new Date().toISOString(),
        status: 'Verified'
      },
      {
        id: 'doc-2',
        documentType: 'Signature',
        fileName: 'rahul_sign.png',
        uploadedAt: new Date().toISOString(),
        status: 'Verified'
      },
      {
        id: 'doc-3',
        documentType: 'Identity Document',
        fileName: 'aadhaar_card.pdf',
        uploadedAt: new Date().toISOString(),
        status: 'Verified'
      },
      {
        id: 'doc-4',
        documentType: '10th Certificate',
        fileName: '10th_marksheet.pdf',
        uploadedAt: new Date().toISOString(),
        status: 'Verified'
      },
      {
        id: 'doc-5',
        documentType: '12th Certificate',
        fileName: '12th_marksheet.pdf',
        uploadedAt: new Date().toISOString(),
        status: 'Verified'
      }
    ],
    declarationAgreed: true,
    status: 'Entrance Test Required',
    assignedTestId: 'test-bca',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    statusHistory: [
      {
        id: 'sh-1',
        status: 'Application Created',
        changedBy: 'Rahul Sharma',
        changedAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'sh-2',
        status: 'Application Submitted',
        changedBy: 'Rahul Sharma',
        changedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        id: 'sh-3',
        status: 'Documents Verified',
        changedBy: 'Dr. Anand Mehta',
        changedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        remarks: 'All 10th and 12th marksheets and identity cards verified successfully.'
      },
      {
        id: 'sh-4',
        status: 'Entrance Test Required',
        changedBy: 'Dr. Anand Mehta',
        changedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        remarks: 'Assigned BCA National Entrance Examination 2026.'
      }
    ],
    feePaid: true,
    paymentReference: 'PAY-NOU-992182'
  };

  const initialNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId: 'usr-student-1',
      title: 'Entrance Test Assigned',
      message: 'Your BCA Entrance Test is ready. Please complete your exam before August 30.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/test'
    },
    {
      id: 'notif-2',
      userId: 'usr-admin-1',
      title: 'New Application Received',
      message: 'Rahul Sharma submitted application NOU-2026-000001 for BCA.',
      type: 'success',
      read: true,
      createdAt: new Date().toISOString()
    }
  ];

  const initialAuditLogs: AuditLog[] = [
    {
      id: 'log-1',
      actorId: 'usr-admin-1',
      actorName: 'Dr. Anand Mehta',
      actorRole: 'admin',
      action: 'DOCUMENTS_VERIFIED',
      target: 'NOU-2026-000001',
      details: 'Verified documents for Rahul Sharma (BCA)',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  dbInstance = {
    users: seededUsers,
    programs: initialPrograms,
    applications: [sampleApplication1],
    tests: initialTests,
    questions: sampleQuestions,
    testAttempts: [],
    testResults: [],
    manualEvaluations: [],
    notifications: initialNotifications,
    auditLogs: initialAuditLogs,
    settings: initialAdminSettings
  };

  saveDatabase();
  console.log('Seeded database successfully.');
  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  ensureDataDirExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbInstance, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}
