export type UserRole = 'student' | 'admin' | 'faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  dateOfBirth?: string;
  gender?: string;
  state?: string;
  city?: string;
  createdAt: string;
  department?: string; // For faculty
  assignedProgramIds?: string[]; // For faculty
}

export type ApplicationStatus =
  | 'Application Created'
  | 'Application Submitted'
  | 'Documents Under Review'
  | 'Documents Verified'
  | 'Documents Rejected'
  | 'Re-upload Required'
  | 'Entrance Test Required'
  | 'Entrance Test Scheduled'
  | 'Entrance Test Completed'
  | 'Result Generated'
  | 'Eligible for Review'
  | 'Selected'
  | 'Waitlisted'
  | 'Rejected'
  | 'Admission Confirmed';

export interface AcademicQualification {
  id: string;
  qualification: '10th' | '12th' | 'Diploma' | "Bachelor's Degree" | 'Other';
  boardOrUniversity: string;
  institution: string;
  passingYear: number;
  rollNumber: string;
  subjects: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade?: string;
}

export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected' | 'Re-upload Required';

export interface ApplicationDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl?: string;
  fileDataUrl?: string; // Base64 preview
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  status: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  remarks?: string;
}

export interface Program {
  id: string;
  code: string;
  title: string; // e.g. B.Tech - Bachelor of Technology
  level: 'Undergraduate' | 'Postgraduate';
  duration: string; // e.g., "4 Years (8 Semesters)"
  eligibility: string;
  applicationFee: number;
  tuitionFeePerSemester: number;
  specializations: string[];
  requiredDocumentTypes: string[];
  testRequired: boolean;
  active: boolean;
  description: string;
}

export interface Application {
  id: string; // NOU-2026-XXXXXX
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  
  // Step 1: Personal Details
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  category: string; // General, OBC, SC, ST, EWS, PwD
  
  // Step 2: Address
  permanentAddress: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
  correspondenceAddress: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
  sameAsPermanent: boolean;
  
  // Step 3: Academic Information
  qualifications: AcademicQualification[];
  
  // Step 4: Program Selection
  academicSession: string; // 2026-2027
  programId: string;
  programTitle: string;
  programLevel: 'Undergraduate' | 'Postgraduate';
  specialization: string;
  preferredStudyMode: 'Online Interactive' | 'Self-Paced Hybrid';
  
  // Step 5: Documents
  documents: ApplicationDocument[];
  
  // Step 7: Declaration
  declarationAgreed: boolean;
  
  // Application Meta
  status: ApplicationStatus;
  assignedTestId?: string;
  createdAt: string;
  submittedAt?: string;
  statusHistory: ApplicationStatusHistory[];
  adminNotes?: string;
  feePaid: boolean;
  paymentReference?: string;
}

export type QuestionType = 'MCQ' | 'True/False' | 'Multiple Select' | 'Short Answer';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  type: QuestionType;
  programId?: string; // Target program or 'ALL'
  programCode?: string;
  subject: string;
  difficulty: QuestionDifficulty;
  marks: number;
  negativeMarks: number;
  options?: QuestionOption[];
  correctAnswer: string | string[]; // Single string for MCQ/TF/ShortAnswer, string[] for Multiple Select
  explanation?: string;
  active: boolean;
  createdBy?: string;
}

export interface EntranceTest {
  id: string;
  title: string;
  programId: string;
  programCode: string;
  programTitle: string;
  durationMinutes: number;
  totalQuestionsToDisplay: number;
  totalMarks: number;
  passingPercentage: number;
  positiveMarksPerQuestion: number;
  negativeMarksPerQuestion: number;
  startDate: string;
  endDate: string;
  attemptLimit: number;
  instructions: string[];
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResultImmediately: boolean;
  showAnswerReview: boolean;
  active: boolean;
  subjectsIncluded: string[];
}

export type AnswerStatus = 'Answered' | 'Not Answered' | 'Marked for Review';

export interface StudentAnswer {
  questionId: string;
  selectedOption?: string | string[]; // Option ID or text
  shortAnswerText?: string;
  status: AnswerStatus;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  applicationId: string;
  studentName: string;
  assignedQuestionIds: string[]; // Order of questions fixed for this attempt
  answers: Record<string, StudentAnswer>; // questionId -> answer
  startTime: string;
  endTime?: string;
  timeRemainingSeconds: number;
  isSubmitted: boolean;
  submittedAt?: string;
  ipAddress?: string;
}

export interface TestResult {
  id: string; // NOU-RESULT-2026-XXXXXX
  attemptId: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentName: string;
  applicationId: string;
  programTitle: string;
  testDate: string;
  
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  unansweredQuestions: number;
  
  positiveScore: number;
  negativeScore: number;
  finalScore: number;
  maxScore: number;
  percentage: number;
  
  passed: boolean;
  passingPercentage: number;
  requiresManualEvaluation: boolean;
  manualEvaluationCompleted: boolean;
  
  calculatedAt: string;
}

export interface ManualEvaluation {
  id: string;
  attemptId: string;
  questionId: string;
  studentId: string;
  studentName: string;
  facultyId?: string;
  facultyName?: string;
  studentAnswerText: string;
  maxMarks: number;
  marksAwarded?: number;
  comments?: string;
  evaluatedAt?: string;
  status: 'Pending' | 'Evaluated';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface AdminSettings {
  institutionName: string;
  institutionTagline: string;
  academicSession: string;
  logoUrl?: string;
  ugcDisclaimerVerified: boolean;
  ugcDisclaimerText: string;
  admissionStartDate: string;
  admissionEndDate: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  allowSelfRegistration: boolean;
  defaultPassingPercentage: number;
  defaultNegativeMarking: number;
}
