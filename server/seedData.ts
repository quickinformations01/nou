import { Program, Question, AdminSettings, EntranceTest } from '../src/types.js';

export const initialPrograms: Program[] = [
  {
    id: 'prog-btech',
    code: 'BTECH',
    title: 'B.Tech — Bachelor of Technology',
    level: 'Undergraduate',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics, Chemistry, and Mathematics (min 50% aggregate)',
    applicationFee: 1000,
    tuitionFeePerSemester: 35000,
    specializations: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Software Engineering'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate'],
    testRequired: true,
    active: true,
    description: 'Comprehensive online engineering program covering modern software, cloud engineering, and AI systems.'
  },
  {
    id: 'prog-bca',
    code: 'BCA',
    title: 'BCA — Bachelor of Computer Applications',
    level: 'Undergraduate',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream with Mathematics or Computer Science (min 45%)',
    applicationFee: 750,
    tuitionFeePerSemester: 22000,
    specializations: ['Full Stack Development', 'Cloud Computing & Cyber Security', 'Data Analytics'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate'],
    testRequired: true,
    active: true,
    description: 'Industry-aligned computing degree building practical skills in web, mobile, and software development.'
  },
  {
    id: 'prog-bba',
    code: 'BBA',
    title: 'BBA — Bachelor of Business Administration',
    level: 'Undergraduate',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream (min 45% aggregate)',
    applicationFee: 750,
    tuitionFeePerSemester: 25000,
    specializations: ['Digital Marketing', 'Finance & Banking', 'Human Resource Management'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate'],
    testRequired: true,
    active: true,
    description: 'Foundational business education preparing future leaders and digital entrepreneurs.'
  },
  {
    id: 'prog-bcom',
    code: 'BCOM',
    title: 'B.Com — Bachelor of Commerce',
    level: 'Undergraduate',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with Commerce or Mathematics (min 45% aggregate)',
    applicationFee: 600,
    tuitionFeePerSemester: 18000,
    specializations: ['Accounting & Taxation', 'FinTech & Banking', 'E-Commerce'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate'],
    testRequired: true,
    active: true,
    description: 'Practical commerce degree focused on financial management, audit, and commercial law.'
  },
  {
    id: 'prog-bsc',
    code: 'BSC',
    title: 'B.Sc — Bachelor of Science',
    level: 'Undergraduate',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in Science Stream (min 50% aggregate)',
    applicationFee: 700,
    tuitionFeePerSemester: 20000,
    specializations: ['Information Technology', 'Data Science', 'Applied Physics'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate'],
    testRequired: true,
    active: true,
    description: 'Scientific and analytical program for research, data, and technology careers.'
  },
  {
    id: 'prog-ba',
    code: 'BA',
    title: 'BA — Bachelor of Arts',
    level: 'Undergraduate',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream (min 40% aggregate)',
    applicationFee: 500,
    tuitionFeePerSemester: 15000,
    specializations: ['English Literature & Communication', 'Economics & Public Policy', 'Psychology'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate'],
    testRequired: true,
    active: true,
    description: 'Multidisciplinary humanities degree fostering critical thinking, research, and communication.'
  },
  {
    id: 'prog-mba',
    code: 'MBA',
    title: 'MBA — Master of Business Administration',
    level: 'Postgraduate',
    duration: '2 Years (4 Semesters)',
    eligibility: "Bachelor's Degree in any discipline (min 50% aggregate)",
    applicationFee: 1200,
    tuitionFeePerSemester: 45000,
    specializations: ['Executive Leadership', 'Financial Analytics', 'Operations & Supply Chain', 'Marketing Tech'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate', "Bachelor's Degree & Marksheets"],
    testRequired: true,
    active: true,
    description: 'Premium postgraduate management program designed for aspiring business leaders and professionals.'
  },
  {
    id: 'prog-mca',
    code: 'MCA',
    title: 'MCA — Master of Computer Applications',
    level: 'Postgraduate',
    duration: '2 Years (4 Semesters)',
    eligibility: "BCA/B.Sc Computer Science or Bachelor's with Mathematics at 10+2 or Graduation (min 50%)",
    applicationFee: 1000,
    tuitionFeePerSemester: 38000,
    specializations: ['Artificial Intelligence & Machine Learning', 'Cloud Architecture', 'Cyber Security'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate', "Bachelor's Degree & Marksheets"],
    testRequired: true,
    active: true,
    description: 'Advanced postgraduate computer applications degree with cutting-edge tech curriculum.'
  },
  {
    id: 'prog-mcom',
    code: 'MCOM',
    title: 'M.Com — Master of Commerce',
    level: 'Postgraduate',
    duration: '2 Years (4 Semesters)',
    eligibility: "B.Com / BBA / B.A. Economics (min 48% aggregate)",
    applicationFee: 800,
    tuitionFeePerSemester: 22000,
    specializations: ['Corporate Finance', 'International Business', 'Taxation & Auditing'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate', "Bachelor's Degree & Marksheets"],
    testRequired: true,
    active: true,
    description: 'Specialized postgraduate education in financial markets, commerce, and corporate governance.'
  },
  {
    id: 'prog-msc',
    code: 'MSC',
    title: 'M.Sc — Master of Science',
    level: 'Postgraduate',
    duration: '2 Years (4 Semesters)',
    eligibility: "B.Sc in relevant subject (min 50% aggregate)",
    applicationFee: 900,
    tuitionFeePerSemester: 28000,
    specializations: ['Data Science & AI', 'Information Technology', 'Applied Statistics'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate', "Bachelor's Degree & Marksheets"],
    testRequired: true,
    active: true,
    description: 'Advanced postgraduate science program emphasizing quantitative analysis and scientific research.'
  },
  {
    id: 'prog-ma',
    code: 'MA',
    title: 'MA — Master of Arts',
    level: 'Postgraduate',
    duration: '2 Years (4 Semesters)',
    eligibility: "Bachelor's Degree in any discipline (min 45% aggregate)",
    applicationFee: 700,
    tuitionFeePerSemester: 20000,
    specializations: ['English & Digital Media', 'Economics', 'Journalism & Mass Communication'],
    requiredDocumentTypes: ['Passport Photograph', 'Signature', 'Identity Document', '10th Certificate', '12th Certificate', "Bachelor's Degree & Marksheets"],
    testRequired: true,
    active: true,
    description: 'Postgraduate humanities study for creative thinkers, researchers, and media professionals.'
  }
];

export const initialAdminSettings: AdminSettings = {
  institutionName: 'NOU — Nexus Online Institute',
  institutionTagline: 'Learn Online. Build Your Future.',
  academicSession: '2026 - 2027',
  ugcDisclaimerVerified: false,
  ugcDisclaimerText: 'Note: Information regarding official regulatory approvals or accreditation is pending verification by the institution administrator.',
  admissionStartDate: '2026-06-01',
  admissionEndDate: '2026-09-30',
  contactEmail: 'admissions@nexus.edu.in',
  contactPhone: '+91 1800-123-4567',
  address: 'Nexus Knowledge Campus, Tech City Park, Cyberabad, India',
  allowSelfRegistration: true,
  defaultPassingPercentage: 50,
  defaultNegativeMarking: 0.25
};

export const initialTests: EntranceTest[] = [
  {
    id: 'test-bca',
    title: 'BCA National Entrance Examination 2026',
    programId: 'prog-bca',
    programCode: 'BCA',
    programTitle: 'BCA — Bachelor of Computer Applications',
    durationMinutes: 45,
    totalQuestionsToDisplay: 10,
    totalMarks: 50,
    passingPercentage: 50,
    positiveMarksPerQuestion: 5,
    negativeMarksPerQuestion: 1,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    attemptLimit: 1,
    instructions: [
      'The test consists of multiple-choice and short answer questions.',
      'Each correct answer carries +5 marks, and wrong MCQ answers carry -1 mark.',
      'Do not refresh or close the browser tab during the examination.',
      'Your answers are auto-saved in real-time as you progress.',
      'Ensure a steady internet connection before clicking Start Test.'
    ],
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultImmediately: true,
    showAnswerReview: true,
    active: true,
    subjectsIncluded: ['Computer Fundamentals', 'Programming', 'Mathematics', 'Logical Reasoning', 'English']
  },
  {
    id: 'test-mba',
    title: 'MBA Management Entrance Test 2026',
    programId: 'prog-mba',
    programCode: 'MBA',
    programTitle: 'MBA — Master of Business Administration',
    durationMinutes: 60,
    totalQuestionsToDisplay: 10,
    totalMarks: 50,
    passingPercentage: 50,
    positiveMarksPerQuestion: 5,
    negativeMarksPerQuestion: 1.25,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    attemptLimit: 1,
    instructions: [
      'Comprehensive management aptitude test covering Quantitative, Verbal, Data Interpretation, and Business Awareness.',
      'Keep scrap paper ready for calculations if needed.',
      'Answers are automatically saved.',
      'Timer will submit your attempt automatically when it expires.'
    ],
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultImmediately: true,
    showAnswerReview: true,
    active: true,
    subjectsIncluded: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation', 'Business Awareness']
  },
  {
    id: 'test-btech',
    title: 'B.Tech Technology Entrance Assessment 2026',
    programId: 'prog-btech',
    programCode: 'BTECH',
    programTitle: 'B.Tech — Bachelor of Technology',
    durationMinutes: 60,
    totalQuestionsToDisplay: 10,
    totalMarks: 50,
    passingPercentage: 50,
    positiveMarksPerQuestion: 5,
    negativeMarksPerQuestion: 1,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    attemptLimit: 1,
    instructions: [
      'Tests foundational problem solving, mathematics, logic, and computing basics.',
      'No external calculators allowed.'
    ],
    randomizeQuestions: true,
    randomizeOptions: true,
    showResultImmediately: true,
    showAnswerReview: true,
    active: true,
    subjectsIncluded: ['Mathematics', 'Computer Fundamentals', 'Logical Reasoning', 'English']
  }
];

export const sampleQuestions: Question[] = [
  // BCA & Computer Fundamentals
  {
    id: 'q-cf-1',
    questionText: 'What is the primary function of the Central Processing Unit (CPU) in a computer?',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'Computer Fundamentals',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: 'To store data permanently' },
      { id: 'opt-b', text: 'To perform arithmetic and logical instructions' },
      { id: 'opt-c', text: 'To display graphical user interface' },
      { id: 'opt-d', text: 'To connect to the internet' }
    ],
    correctAnswer: 'opt-b',
    explanation: 'The CPU is the electronic circuitry that executes instructions comprising a computer program.',
    active: true
  },
  {
    id: 'q-cf-2',
    questionText: 'RAM (Random Access Memory) is non-volatile memory.',
    type: 'True/False',
    programCode: 'BCA',
    subject: 'Computer Fundamentals',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-t', text: 'True' },
      { id: 'opt-f', text: 'False' }
    ],
    correctAnswer: 'opt-f',
    explanation: 'RAM is volatile memory; its contents are erased when power is switched off.',
    active: true
  },
  {
    id: 'q-cf-3',
    questionText: 'Which of the following are high-level programming languages? (Select all that apply)',
    type: 'Multiple Select',
    programCode: 'BCA',
    subject: 'Programming',
    difficulty: 'Medium',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-1', text: 'Python' },
      { id: 'opt-2', text: 'Java' },
      { id: 'opt-3', text: 'Assembly Language' },
      { id: 'opt-4', text: 'C++' }
    ],
    correctAnswer: ['opt-1', 'opt-2', 'opt-4'],
    explanation: 'Python, Java, and C++ are high-level languages, whereas Assembly is low-level.',
    active: true
  },
  {
    id: 'q-cf-4',
    questionText: 'Explain the concept of Object-Oriented Programming (OOP) and list its four main pillars in 2-3 sentences.',
    type: 'Short Answer',
    programCode: 'BCA',
    subject: 'Programming',
    difficulty: 'Hard',
    marks: 5,
    negativeMarks: 0,
    correctAnswer: 'OOP organizes software around objects containing data and methods. The four main pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    explanation: 'Short answer requiring manual faculty evaluation or reference check.',
    active: true
  },
  {
    id: 'q-math-1',
    questionText: 'If 2^x = 64, what is the value of x?',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'Mathematics',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: '4' },
      { id: 'opt-b', text: '5' },
      { id: 'opt-c', text: '6' },
      { id: 'opt-d', text: '8' }
    ],
    correctAnswer: 'opt-c',
    explanation: '2^6 = 64, so x = 6.',
    active: true
  },
  {
    id: 'q-math-2',
    questionText: 'What is the derivative of f(x) = 3x^2 + 5x - 7 with respect to x?',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'Mathematics',
    difficulty: 'Medium',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: '6x + 5' },
      { id: 'opt-b', text: '3x + 5' },
      { id: 'opt-c', text: '6x^2 + 5' },
      { id: 'opt-d', text: '6x - 7' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'd/dx(3x^2 + 5x - 7) = 6x + 5.',
    active: true
  },
  {
    id: 'q-lr-1',
    questionText: 'Complete the series: 3, 7, 15, 31, 63, ?',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'Logical Reasoning',
    difficulty: 'Medium',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: '125' },
      { id: 'opt-b', text: '127' },
      { id: 'opt-c', text: '128' },
      { id: 'opt-d', text: '131' }
    ],
    correctAnswer: 'opt-b',
    explanation: 'Pattern: (Previous number * 2) + 1. (63 * 2) + 1 = 127.',
    active: true
  },
  {
    id: 'q-eng-1',
    questionText: 'Choose the correct synonym for "Meticulous":',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'English',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: 'Careless' },
      { id: 'opt-b', text: 'Thorough and precise' },
      { id: 'opt-c', text: 'Hasty' },
      { id: 'opt-d', text: 'Reluctant' }
    ],
    correctAnswer: 'opt-b',
    explanation: 'Meticulous means showing great attention to detail; very careful and precise.',
    active: true
  },
  {
    id: 'q-gk-1',
    questionText: 'Which city is known as the Silicon Valley of India?',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'General Knowledge',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: 'Hyderabad' },
      { id: 'opt-b', text: 'Bengaluru' },
      { id: 'opt-c', text: 'Pune' },
      { id: 'opt-d', text: 'Gurugram' }
    ],
    correctAnswer: 'opt-b',
    explanation: 'Bengaluru is widely recognized as the tech hub and Silicon Valley of India.',
    active: true
  },
  {
    id: 'q-cf-5',
    questionText: 'Which protocol is standard for secure web communication over HTTPS?',
    type: 'MCQ',
    programCode: 'BCA',
    subject: 'Computer Fundamentals',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1,
    options: [
      { id: 'opt-a', text: 'FTP' },
      { id: 'opt-b', text: 'TLS/SSL' },
      { id: 'opt-c', text: 'SMTP' },
      { id: 'opt-d', text: 'SNMP' }
    ],
    correctAnswer: 'opt-b',
    explanation: 'TLS/SSL encrypts HTTP requests and responses.',
    active: true
  },

  // MBA Questions
  {
    id: 'q-mba-1',
    questionText: 'A item marked at ₹2,000 is sold at a 20% discount with an additional 10% cashback on discounted price. What is the final price paid?',
    type: 'MCQ',
    programCode: 'MBA',
    subject: 'Quantitative Aptitude',
    difficulty: 'Medium',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      { id: 'opt-a', text: '₹1,440' },
      { id: 'opt-b', text: '₹1,400' },
      { id: 'opt-c', text: '₹1,500' },
      { id: 'opt-d', text: '₹1,600' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Discounted price = 2000 * 0.8 = 1600. Cashback = 10% of 1600 = 160. Final price = 1600 - 160 = 1440.',
    active: true
  },
  {
    id: 'q-mba-2',
    questionText: 'What does SWOT analysis stand for in strategic management?',
    type: 'MCQ',
    programCode: 'MBA',
    subject: 'Business Awareness',
    difficulty: 'Easy',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      { id: 'opt-a', text: 'Sales, Wealth, Operations, Tactics' },
      { id: 'opt-b', text: 'Strengths, Weaknesses, Opportunities, Threats' },
      { id: 'opt-c', text: 'Strategy, Workforce, Objectives, Targets' },
      { id: 'opt-d', text: 'System, Workflow, Output, Timeframe' }
    ],
    correctAnswer: 'opt-b',
    explanation: 'SWOT stands for Strengths, Weaknesses, Opportunities, and Threats.',
    active: true
  },
  {
    id: 'q-mba-3',
    questionText: 'Briefly describe how digital marketing differs from traditional marketing and give two key metrics used in digital campaigns.',
    type: 'Short Answer',
    programCode: 'MBA',
    subject: 'Business Awareness',
    difficulty: 'Hard',
    marks: 5,
    negativeMarks: 0,
    correctAnswer: 'Digital marketing uses online channels providing real-time tracking and targeting compared to broad offline traditional channels. Key metrics: CTR (Click-Through Rate) and CAC (Customer Acquisition Cost).',
    explanation: 'Short answer for faculty evaluation.',
    active: true
  }
];
