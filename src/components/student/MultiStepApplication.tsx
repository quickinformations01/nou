import React, { useState, useEffect } from 'react';
import { Program, Application, AcademicQualification, ApplicationDocument } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  MapPin,
  GraduationCap,
  BookOpen,
  FileText,
  CheckSquare,
  Send,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface ApplicationProps {
  programs: Program[];
  selectedProgramId?: string;
  existingApp?: Application | null;
  onSubmitted: (app: Application) => void;
  onCancel: () => void;
}

export const MultiStepApplication: React.FC<ApplicationProps> = ({
  programs,
  selectedProgramId,
  existingApp,
  onSubmitted,
  onCancel
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [appId, setAppId] = useState<string>(existingApp?.id || '');
  
  // Step 1: Personal
  const [fullName, setFullName] = useState(existingApp?.studentName || user?.name || '');
  const [email, setEmail] = useState(existingApp?.studentEmail || user?.email || '');
  const [mobile, setMobile] = useState(existingApp?.studentMobile || user?.mobile || '');
  const [fatherName, setFatherName] = useState(existingApp?.fatherName || '');
  const [motherName, setMotherName] = useState(existingApp?.motherName || '');
  const [dob, setDob] = useState(existingApp?.dateOfBirth || user?.dateOfBirth || '2004-05-15');
  const [gender, setGender] = useState(existingApp?.gender || user?.gender || 'Male');
  const [nationality, setNationality] = useState(existingApp?.nationality || 'Indian');
  const [category, setCategory] = useState(existingApp?.category || 'General');

  // Step 2: Address
  const [permAddrLine, setPermAddrLine] = useState(existingApp?.permanentAddress?.addressLine || '');
  const [permCity, setPermCity] = useState(existingApp?.permanentAddress?.city || user?.city || '');
  const [permState, setPermState] = useState(existingApp?.permanentAddress?.state || user?.state || '');
  const [permPin, setPermPin] = useState(existingApp?.permanentAddress?.pinCode || '');

  const [sameAsPerm, setSameAsPerm] = useState(existingApp?.sameAsPermanent ?? true);

  const [corrAddrLine, setCorrAddrLine] = useState(existingApp?.correspondenceAddress?.addressLine || '');
  const [corrCity, setCorrCity] = useState(existingApp?.correspondenceAddress?.city || '');
  const [corrState, setCorrState] = useState(existingApp?.correspondenceAddress?.state || '');
  const [corrPin, setCorrPin] = useState(existingApp?.correspondenceAddress?.pinCode || '');

  // Step 3: Academic Qualifications
  const [qualifications, setQualifications] = useState<AcademicQualification[]>(
    existingApp?.qualifications?.length
      ? existingApp.qualifications
      : [
          {
            id: 'q-1',
            qualification: '10th',
            boardOrUniversity: 'CBSE',
            institution: 'Central School',
            passingYear: 2020,
            rollNumber: '10th-88192',
            subjects: 'English, Math, Science, Social Studies',
            maxMarks: 500,
            obtainedMarks: 440,
            percentage: 88,
            grade: 'A'
          },
          {
            id: 'q-2',
            qualification: '12th',
            boardOrUniversity: 'State Board',
            institution: 'Junior College',
            passingYear: 2022,
            rollNumber: '12th-99182',
            subjects: 'Physics, Chemistry, Math, English',
            maxMarks: 500,
            obtainedMarks: 425,
            percentage: 85,
            grade: 'A'
          }
        ]
  );

  // Step 4: Program Selection
  const defaultProgId = selectedProgramId || existingApp?.programId || programs[0]?.id || '';
  const [programId, setProgramId] = useState(defaultProgId);
  const selectedProgObj = programs.find((p) => p.id === programId) || programs[0];
  const [specialization, setSpecialization] = useState(
    existingApp?.specialization || selectedProgObj?.specializations[0] || ''
  );
  const [studyMode, setStudyMode] = useState<'Online Interactive' | 'Self-Paced Hybrid'>(
    existingApp?.preferredStudyMode || 'Online Interactive'
  );

  // Step 5: Documents
  const [documents, setDocuments] = useState<ApplicationDocument[]>(
    existingApp?.documents?.length
      ? existingApp.documents
      : [
          { id: 'd-1', documentType: 'Passport Photograph', fileName: 'photo.jpg', uploadedAt: new Date().toISOString(), status: 'Pending' },
          { id: 'd-2', documentType: 'Signature', fileName: 'signature.png', uploadedAt: new Date().toISOString(), status: 'Pending' },
          { id: 'd-3', documentType: 'Identity Document', fileName: 'aadhaar_card.pdf', uploadedAt: new Date().toISOString(), status: 'Pending' },
          { id: 'd-4', documentType: '10th Certificate', fileName: '10th_marksheet.pdf', uploadedAt: new Date().toISOString(), status: 'Pending' },
          { id: 'd-5', documentType: '12th Certificate', fileName: '12th_marksheet.pdf', uploadedAt: new Date().toISOString(), status: 'Pending' }
        ]
  );

  // Step 7: Declaration
  const [declarationAgreed, setDeclarationAgreed] = useState(existingApp?.declarationAgreed || false);

  useEffect(() => {
    if (selectedProgObj) {
      if (!specialization || !selectedProgObj.specializations.includes(specialization)) {
        setSpecialization(selectedProgObj.specializations[0] || '');
      }
    }
  }, [programId]);

  const addQualificationRow = () => {
    const newQ: AcademicQualification = {
      id: `q-${Date.now()}`,
      qualification: 'Bachelor\'s Degree',
      boardOrUniversity: '',
      institution: '',
      passingYear: 2025,
      rollNumber: '',
      subjects: '',
      maxMarks: 100,
      obtainedMarks: 75,
      percentage: 75
    };
    setQualifications([...qualifications, newQ]);
  };

  const removeQualificationRow = (id: string) => {
    setQualifications(qualifications.filter((q) => q.id !== id));
  };

  const handleDocumentUploadMock = (docType: string) => {
    const docName = `${docType.toLowerCase().replace(/ /g, '_')}_scan.pdf`;
    const existing = documents.find((d) => d.documentType === docType);
    if (existing) {
      setDocuments(
        documents.map((d) =>
          d.documentType === docType
            ? { ...d, fileName: docName, uploadedAt: new Date().toISOString(), status: 'Pending' }
            : d
        )
      );
    } else {
      setDocuments([
        ...documents,
        { id: `doc-${Date.now()}`, documentType: docType, fileName: docName, uploadedAt: new Date().toISOString(), status: 'Pending' }
      ]);
    }
  };

  const buildApplicationPayload = (): Partial<Application> => {
    return {
      id: appId || undefined,
      studentName: fullName,
      studentEmail: email,
      studentMobile: mobile,
      fatherName,
      motherName,
      dateOfBirth: dob,
      gender,
      nationality,
      category,
      permanentAddress: {
        addressLine: permAddrLine,
        city: permCity,
        state: permState,
        pinCode: permPin
      },
      correspondenceAddress: sameAsPerm
        ? { addressLine: permAddrLine, city: permCity, state: permState, pinCode: permPin }
        : { addressLine: corrAddrLine, city: corrCity, state: corrState, pinCode: corrPin },
      sameAsPermanent: sameAsPerm,
      qualifications,
      programId: selectedProgObj.id,
      programTitle: selectedProgObj.title,
      programLevel: selectedProgObj.level,
      specialization,
      preferredStudyMode: studyMode,
      documents,
      declarationAgreed
    };
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError(null);
      const saved = await api.saveApplicationDraft(buildApplicationPayload());
      setAppId(saved.id);
      alert(`Draft saved successfully! Application Ref ID: ${saved.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save draft.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!declarationAgreed) {
      setError('Please check the declaration checkbox to confirm accuracy.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const saved = await api.saveApplicationDraft(buildApplicationPayload());
      const submitted = await api.submitApplication(saved.id);
      onSubmitted(submitted);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    '1. Personal',
    '2. Address',
    '3. Academics',
    '4. Program',
    '5. Documents',
    '6. Review',
    '7. Declaration',
    '8. Submit'
  ];

  return (
    <div className="max-w-5xl mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-6 sm:p-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
            Academic Session 2026 - 2027
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">Online Admission Application</h1>
        </div>
        {appId && (
          <div className="bg-blue-900/80 px-3.5 py-1.5 rounded-xl border border-blue-700 text-xs font-mono font-bold">
            App ID: {appId}
          </div>
        )}
      </div>

      {/* Step Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 overflow-x-auto">
        <div className="flex items-center min-w-[650px] justify-between">
          {stepsList.map((st, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <button
                key={idx}
                onClick={() => setCurrentStep(stepNum)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-blue-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{st}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="m-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Content Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: PERSONAL DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-5 h-5 text-blue-900" />
              <span>Step 1 — Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="e.g. Sunita Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                  <option>PwD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ADDRESS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-5 h-5 text-blue-900" />
              <span>Step 2 — Permanent & Correspondence Address</span>
            </h3>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Permanent Address</h4>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address Line</label>
                <input
                  type="text"
                  value={permAddrLine}
                  onChange={(e) => setPermAddrLine(e.target.value)}
                  placeholder="Flat No, Street, Landmark"
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={permCity}
                    onChange={(e) => setPermCity(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={permState}
                    onChange={(e) => setPermState(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={permPin}
                    onChange={(e) => setPermPin(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                id="sameAsPermCheck"
                checked={sameAsPerm}
                onChange={(e) => setSameAsPerm(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
              <label htmlFor="sameAsPermCheck" className="cursor-pointer">
                Same as permanent address
              </label>
            </div>

            {!sameAsPerm && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Correspondence Address</h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address Line</label>
                  <input
                    type="text"
                    value={corrAddrLine}
                    onChange={(e) => setCorrAddrLine(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={corrCity}
                      onChange={(e) => setCorrCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={corrState}
                      onChange={(e) => setCorrState(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={corrPin}
                      onChange={(e) => setCorrPin(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ACADEMIC QUALIFICATIONS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-900" />
                <span>Step 3 — Academic Information</span>
              </h3>
              <button
                type="button"
                onClick={addQualificationRow}
                className="px-3 py-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Qualification</span>
              </button>
            </div>

            <div className="space-y-4">
              {qualifications.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs relative"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Qualification #{idx + 1} ({q.qualification})</span>
                    {qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualificationRow(q.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Qualification Level</label>
                      <select
                        value={q.qualification}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].qualification = e.target.value as any;
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      >
                        <option>10th</option>
                        <option>12th</option>
                        <option>Diploma</option>
                        <option>Bachelor's Degree</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Board / University</label>
                      <input
                        type="text"
                        value={q.boardOrUniversity}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].boardOrUniversity = e.target.value;
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={q.institution}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].institution = e.target.value;
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Passing Year</label>
                      <input
                        type="number"
                        value={q.passingYear}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].passingYear = Number(e.target.value);
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={q.rollNumber}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].rollNumber = e.target.value;
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                      <input
                        type="number"
                        value={q.maxMarks}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].maxMarks = Number(e.target.value);
                          if (updated[idx].maxMarks > 0) {
                            updated[idx].percentage = Math.round((updated[idx].obtainedMarks / updated[idx].maxMarks) * 100);
                          }
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Obtained Marks</label>
                      <input
                        type="number"
                        value={q.obtainedMarks}
                        onChange={(e) => {
                          const updated = [...qualifications];
                          updated[idx].obtainedMarks = Number(e.target.value);
                          if (updated[idx].maxMarks > 0) {
                            updated[idx].percentage = Math.round((updated[idx].obtainedMarks / updated[idx].maxMarks) * 100);
                          }
                          setQualifications(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Percentage (%)</label>
                      <input
                        type="number"
                        readOnly
                        value={q.percentage}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-bold text-blue-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PROGRAM SELECTION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <BookOpen className="w-5 h-5 text-blue-900" />
              <span>Step 4 — Program Selection & Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
                <input
                  type="text"
                  readOnly
                  value="2026 - 2027"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Program</label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-blue-900"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.level}] {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProgObj && (
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                  <h4 className="font-bold text-blue-950 text-sm">{selectedProgObj.title}</h4>
                  <span className="bg-blue-900 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    {selectedProgObj.code}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="font-semibold text-slate-700">Duration:</span> {selectedProgObj.duration}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Semester Fee:</span> ₹{selectedProgObj.tuitionFeePerSemester.toLocaleString('en-IN')}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Application Fee:</span> ₹{selectedProgObj.applicationFee}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Eligibility:</span> {selectedProgObj.eligibility}
                </div>

                <div className="pt-2">
                  <label className="block font-semibold text-slate-900 mb-1">Choose Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  >
                    {selectedProgObj.specializations.map((spec, i) => (
                      <option key={i} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: DOCUMENTS */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Upload className="w-5 h-5 text-blue-900" />
              <span>Step 5 — Upload Required Documents</span>
            </h3>

            <p className="text-xs text-slate-600">
              Please provide scanned copies of photograph, signature, and certificates required for {selectedProgObj?.code}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedProgObj?.requiredDocumentTypes || [
                'Passport Photograph',
                'Signature',
                'Identity Document',
                '10th Certificate',
                '12th Certificate'
              ]).map((docType, idx) => {
                const docItem = documents.find((d) => d.documentType === docType);
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{docType}</div>
                      {docItem?.fileName ? (
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Uploaded ({docItem.fileName})</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-700 font-medium">Pending Upload</div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDocumentUploadMock(docType)}
                      className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{docItem?.fileName ? 'Re-upload' : 'Upload'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-blue-900" />
              <span>Step 6 — Review Application Summary</span>
            </h3>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div><strong>Full Name:</strong> {fullName}</div>
                <div><strong>Father's Name:</strong> {fatherName}</div>
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Mobile:</strong> {mobile}</div>
                <div><strong>DOB:</strong> {dob}</div>
                <div><strong>Gender / Category:</strong> {gender} / {category}</div>
              </div>

              <div className="border-b border-slate-200 pb-3">
                <strong>Permanent Address:</strong> {permAddrLine}, {permCity}, {permState} - {permPin}
              </div>

              <div className="border-b border-slate-200 pb-3">
                <strong>Program Selected:</strong> {selectedProgObj?.title} ({specialization})
              </div>

              <div>
                <strong>Academic Qualifications ({qualifications.length}):</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {qualifications.map((q) => (
                    <li key={q.id}>
                      {q.qualification} - {q.boardOrUniversity} ({q.passingYear}): {q.percentage}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: DECLARATION */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckSquare className="w-5 h-5 text-blue-900" />
              <span>Step 7 — Student Declaration</span>
            </h3>

            <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-3">
              <p className="leading-relaxed">
                I hereby declare that all information, academic marks, personal details, and documents provided in this application are authentic, accurate, and complete to the best of my knowledge. I understand that providing false or misleading details will result in immediate disqualification and cancellation of my admission.
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-200/80">
                <input
                  type="checkbox"
                  id="declCheck"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                  className="w-4 h-4 text-blue-900 rounded"
                />
                <label htmlFor="declCheck" className="font-bold text-slate-900 cursor-pointer">
                  I confirm and agree to the above declaration statement.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: SUBMIT */}
        {currentStep === 8 && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Ready to Lock & Submit Application</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Clicking "Final Submit" will officially lock your application, generate your official reference ID, and submit it for document review and entrance test assignment.
              </p>
            </div>

            <button
              onClick={handleSubmitFinal}
              disabled={loading || !declarationAgreed}
              className="px-8 py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Application...' : 'Final Submit Application'}</span>
            </button>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
