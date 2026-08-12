import React, { useState } from 'react';
import {
  UserCheck,
  User,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Database,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Car
} from 'lucide-react';
import { api } from '../../services/api';
import { DocumentItem, RiderRegistration } from '../../types';
import { DocumentUploader } from '../common/DocumentUploader';

interface RiderRegistrationFormProps {
  onSuccess?: (rider: RiderRegistration) => void;
}

export const RiderRegistrationForm: React.FC<RiderRegistrationFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRider, setSubmittedRider] = useState<RiderRegistration | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnicNumber: '',
    dob: '',
    gender: 'female' as 'male' | 'female' | 'other',
    homeAddress: '',
    city: 'Islamabad',
    preferredPaymentMethod: 'Digital Wallet' as 'Cash' | 'Digital Wallet' | 'Credit/Debit Card',
    preferredVehicleTypes: ['Car', 'SUV'],
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  // Documents state
  const [docCnicFront, setDocCnicFront] = useState<DocumentItem | undefined>();
  const [docCnicBack, setDocCnicBack] = useState<DocumentItem | undefined>();
  const [docProfilePhoto, setDocProfilePhoto] = useState<DocumentItem | undefined>();

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleVehicleTypeToggle = (type: string) => {
    let current = [...formData.preferredVehicleTypes];
    if (current.includes(type)) {
      current = current.filter((t) => t !== type);
    } else {
      current.push(type);
    }
    setFormData({ ...formData, preferredVehicleTypes: current });
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Valid email is required.';
    if (!formData.phone.trim()) return 'Mobile Phone number is required.';
    if (!formData.cnicNumber.trim() || formData.cnicNumber.length < 13)
      return 'Valid CNIC number is required (e.g. 61101-5544332-2).';
    if (!formData.homeAddress.trim()) return 'Home address is required.';
    return null;
  };

  const validateStep2 = () => {
    if (!docCnicFront) return 'Please upload CNIC Front card image.';
    if (!docCnicBack) return 'Please upload CNIC Back card image.';
    if (!docProfilePhoto) return 'Please upload a Profile Photo / Headshot.';
    return null;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError('You must accept the terms and verify document authenticity.');
      return;
    }

    setLoading(true);

    const documentsList: DocumentItem[] = [];
    if (docCnicFront) documentsList.push(docCnicFront);
    if (docCnicBack) documentsList.push(docCnicBack);
    if (docProfilePhoto) documentsList.push(docProfilePhoto);

    try {
      const res = await api.registerRider({
        ...formData,
        documents: documentsList
      });

      setSubmittedRider(res.rider);
      if (onSuccess) onSuccess(res.rider);
    } catch (err: any) {
      setError(err.message || 'Failed to submit rider registration.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedRider) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rider Account Registered!</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Your rider registration details and CNIC identity documents have been stored in Cloudflare D1 database.
        </p>

        <div className="my-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Rider Registration ID:</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">{submittedRider.id}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Rider Name:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedRider.fullName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">CNIC Number:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{submittedRider.cnicNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Payment Preference:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedRider.preferredPaymentMethod}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Cloudflare D1 Status:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Database className="w-3 h-3" />
              {submittedRider.status}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Documents Stored:</span>
            <span className="font-medium text-purple-600 dark:text-purple-400">
              {submittedRider.documents.length} Files Saved in D1
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setSubmittedRider(null);
              setStep(1);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                cnicNumber: '',
                dob: '',
                gender: 'female',
                homeAddress: '',
                city: 'Islamabad',
                preferredPaymentMethod: 'Digital Wallet',
                preferredVehicleTypes: ['Car'],
                emergencyContactName: '',
                emergencyContactPhone: ''
              });
              setDocCnicFront(undefined);
              setDocCnicBack(undefined);
              setDocProfilePhoto(undefined);
            }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl text-xs transition-colors"
          >
            Submit Another Rider
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-800 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Rider Registration</h2>
              <p className="text-xs text-purple-100 mt-0.5">
                Passenger Profile Setup & CNIC Verification in Cloudflare D1
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-xs font-mono text-purple-200 border border-white/10">
            <Database className="w-3.5 h-3.5" />
            Cloudflare D1 Bound
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {[
            { num: 1, label: 'Profile Info' },
            { num: 2, label: 'CNIC & Photo' },
            { num: 3, label: 'Review & D1 Save' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-white text-purple-700 shadow-lg scale-110'
                    : step > s.num
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-white/20 text-white/80'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[11px] font-medium mt-1 text-white/90 hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: PERSONAL & PREFERENCES */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                Step 1: Rider Information & Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ayesha Siddiqui"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CNIC / National ID Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleChange}
                    placeholder="e.g. 61101-5544332-2"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rider@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 333 7788990"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Home Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleChange}
                    placeholder="House number, Street, Block or Sector"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Payment Method
                  </label>
                  <select
                    name="preferredPaymentMethod"
                    value={formData.preferredPaymentMethod}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="Cash">Cash on Delivery / Ride</option>
                    <option value="Digital Wallet">Digital Wallet (EasyPaisa / JazzCash)</option>
                    <option value="Credit/Debit Card">Credit / Debit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Name & Phone
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Tariq Siddiqui (+92 333 1122334)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Vehicle type preferences */}
                <div className="sm:col-span-2 pt-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Vehicle Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Car', 'Motorbike', 'Auto Rickshaw', 'Van/Cargo', 'SUV'].map((vType) => {
                      const selected = formData.preferredVehicleTypes.includes(vType);
                      return (
                        <button
                          type="button"
                          key={vType}
                          onClick={() => handleVehicleTypeToggle(vType)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selected
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {vType}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DOCUMENTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Step 2: Rider CNIC & Profile Documents
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Cloudflare D1 Document Storage
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentUploader
                  type="cnicFront"
                  title="CNIC Front Side"
                  description="Upload front photo of your National Identity Card."
                  required={true}
                  value={docCnicFront}
                  onChange={setDocCnicFront}
                />

                <DocumentUploader
                  type="cnicBack"
                  title="CNIC Back Side"
                  description="Upload back photo showing home address and CNIC chip."
                  required={true}
                  value={docCnicBack}
                  onChange={setDocCnicBack}
                />

                <DocumentUploader
                  type="profilePhoto"
                  title="Rider Profile Picture"
                  description="Upload a clear headshot photo for your rider profile."
                  required={true}
                  value={docProfilePhoto}
                  onChange={setDocProfilePhoto}
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Step 3: Review Rider Registration & Save to Cloudflare D1
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                    Rider Profile Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Name:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">CNIC:</span>{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-200">{formData.cnicNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Email:</span>{' '}
                      <span className="text-slate-800 dark:text-slate-200">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Phone:</span>{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-200">{formData.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 dark:text-slate-400">Address:</span>{' '}
                      <span className="text-slate-800 dark:text-slate-200">{formData.homeAddress}, {formData.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Payment Preference:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.preferredPaymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                    Attached Documents ({ [docCnicFront, docCnicBack, docProfilePhoto].filter(Boolean).length } Files)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-emerald-600 dark:text-emerald-400">
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> CNIC Front</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> CNIC Back</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Profile Photo</div>
                  </div>
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  I confirm that all rider profile information and CNIC documents provided are true and accurate. I authorize saving this rider record into Cloudflare D1 database.
                </span>
              </label>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => { setError(null); setStep(step - 1); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Rider to D1...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Register Rider & Save to D1</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
