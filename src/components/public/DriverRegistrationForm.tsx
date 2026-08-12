import React, { useState } from 'react';
import {
  Car,
  User,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Database,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { api } from '../../services/api';
import { DocumentItem, DriverRegistration } from '../../types';
import { DocumentUploader } from '../common/DocumentUploader';

interface DriverRegistrationFormProps {
  onSuccess?: (driver: DriverRegistration) => void;
}

export const DriverRegistrationForm: React.FC<DriverRegistrationFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedDriver, setSubmittedDriver] = useState<DriverRegistration | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnicNumber: '',
    dob: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    city: 'Karachi',
    emergencyContactName: '',
    emergencyContactPhone: '',
    vehicleType: 'Car' as 'Car' | 'Motorbike' | 'Auto Rickshaw' | 'Van/Cargo' | 'SUV',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '2022',
    licensePlate: '',
    vehicleColor: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: ''
  });

  // Documents state
  const [docCnicFront, setDocCnicFront] = useState<DocumentItem | undefined>();
  const [docCnicBack, setDocCnicBack] = useState<DocumentItem | undefined>();
  const [docLicense, setDocLicense] = useState<DocumentItem | undefined>();
  const [docRegistration, setDocRegistration] = useState<DocumentItem | undefined>();
  const [docProfilePhoto, setDocProfilePhoto] = useState<DocumentItem | undefined>();
  const [docVehiclePhoto, setDocVehiclePhoto] = useState<DocumentItem | undefined>();

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Valid email is required.';
    if (!formData.phone.trim()) return 'Mobile Phone number is required.';
    if (!formData.cnicNumber.trim() || formData.cnicNumber.length < 13)
      return 'Valid CNIC number is required (e.g., 42101-1234567-1).';
    if (!formData.address.trim()) return 'Full residential address is required.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.vehicleMake.trim()) return 'Vehicle make is required (e.g. Toyota, Honda, Suzuki).';
    if (!formData.vehicleModel.trim()) return 'Vehicle model is required (e.g. Corolla, Civic, CG125).';
    if (!formData.licensePlate.trim()) return 'License plate number is required.';
    if (!formData.drivingLicenseNumber.trim()) return 'Driving license number is required.';
    return null;
  };

  const validateStep3 = () => {
    if (!docCnicFront) return 'Please upload CNIC Front image.';
    if (!docCnicBack) return 'Please upload CNIC Back image.';
    if (!docLicense) return 'Please upload Driving License image.';
    if (!docRegistration) return 'Please upload Vehicle Registration smartcard / document.';
    if (!docProfilePhoto) return 'Please upload a Profile Photo / Passport Size Photo.';
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
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setStep(4);
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
    if (docLicense) documentsList.push(docLicense);
    if (docRegistration) documentsList.push(docRegistration);
    if (docProfilePhoto) documentsList.push(docProfilePhoto);
    if (docVehiclePhoto) documentsList.push(docVehiclePhoto);

    try {
      const res = await api.registerDriver({
        ...formData,
        documents: documentsList
      });

      setSubmittedDriver(res.driver);
      if (onSuccess) onSuccess(res.driver);
    } catch (err: any) {
      setError(err.message || 'Failed to submit driver registration.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedDriver) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Driver Registration Submitted!</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Your driver application and uploaded documents (CNIC, Driving License, Registration) have been stored in the Cloudflare D1 database.
        </p>

        <div className="my-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Driver Registration ID:</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">{submittedDriver.id}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Driver Name:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedDriver.fullName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">CNIC Number:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{submittedDriver.cnicNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Vehicle & Plate:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {submittedDriver.vehicleMake} {submittedDriver.vehicleModel} ({submittedDriver.licensePlate})
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Cloudflare D1 Status:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              <Database className="w-3 h-3" />
              {submittedDriver.status}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Uploaded Documents:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {submittedDriver.documents.length} Files Stored in D1
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSubmittedDriver(null);
              setStep(1);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                cnicNumber: '',
                dob: '',
                gender: 'male',
                address: '',
                city: 'Karachi',
                emergencyContactName: '',
                emergencyContactPhone: '',
                vehicleType: 'Car',
                vehicleMake: '',
                vehicleModel: '',
                vehicleYear: '2022',
                licensePlate: '',
                vehicleColor: '',
                drivingLicenseNumber: '',
                licenseExpiryDate: ''
              });
              setDocCnicFront(undefined);
              setDocCnicBack(undefined);
              setDocLicense(undefined);
              setDocRegistration(undefined);
              setDocProfilePhoto(undefined);
              setDocVehiclePhoto(undefined);
            }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl text-xs transition-colors"
          >
            Submit Another Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Driver Registration</h2>
              <p className="text-xs text-sky-100 mt-0.5">
                Register as a Captain & Store Documents in Cloudflare D1
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-xs font-mono text-sky-200 border border-white/10">
            <Database className="w-3.5 h-3.5" />
            Cloudflare D1 Bound
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Vehicle' },
            { num: 3, label: 'Documents' },
            { num: 4, label: 'Review' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-white text-sky-700 shadow-lg scale-110'
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
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-sky-500" />
                Step 1: Personal Information
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
                    placeholder="e.g. Mohammad Tariq Khan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    placeholder="e.g. 42101-1234567-1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
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
                    placeholder="driver@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Residential Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House / Apartment number, Street, Sector / Area"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Name & Relation
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="e.g. Rashid Khan (Brother)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE & LICENSE DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-sky-500" />
                Step 2: Vehicle & Driving License Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  >
                    <option value="Car">Car / AC Ride</option>
                    <option value="Motorbike">Motorbike / Express</option>
                    <option value="Auto Rickshaw">Auto Rickshaw</option>
                    <option value="Van/Cargo">Van / Delivery Cargo</option>
                    <option value="SUV">SUV / Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Make / Manufacturer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={handleChange}
                    placeholder="e.g. Toyota, Honda, Suzuki, Yamaha"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    placeholder="e.g. Corolla GLi, Alto, CD70"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Model Year
                  </label>
                  <input
                    type="number"
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleChange}
                    placeholder="2022"
                    min="2005"
                    max="2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    License Plate Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    placeholder="e.g. KHI-9921 or LEO-4412"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    placeholder="e.g. Silver White, Black, Red"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Driving License Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="drivingLicenseNumber"
                    value={formData.drivingLicenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. KHI-DL-882194"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Driving License Expiry Date
                  </label>
                  <input
                    type="date"
                    name="licenseExpiryDate"
                    value={formData.licenseExpiryDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOADS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  Step 3: Document Uploads & Cloudflare D1 Storage
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Stored directly in Cloudflare D1 database
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-sky-50 dark:bg-sky-950/50 p-3 rounded-xl border border-sky-200 dark:border-sky-800">
                Please upload clear photos/scans of your CNIC front and back, driving license, and vehicle registration. You can also capture photos using your device camera.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentUploader
                  type="cnicFront"
                  title="CNIC Front Side"
                  description="Front photo showing full name, CNIC number, and photo clearly."
                  required={true}
                  value={docCnicFront}
                  onChange={setDocCnicFront}
                />

                <DocumentUploader
                  type="cnicBack"
                  title="CNIC Back Side"
                  description="Back photo showing residential address and smart card chip."
                  required={true}
                  value={docCnicBack}
                  onChange={setDocCnicBack}
                />

                <DocumentUploader
                  type="drivingLicense"
                  title="Driving License (Front)"
                  description="Official driver's license matching your vehicle category."
                  required={true}
                  value={docLicense}
                  onChange={setDocLicense}
                />

                <DocumentUploader
                  type="vehicleRegistration"
                  title="Vehicle Registration Card"
                  description="Vehicle Smartcard or Excise registration book."
                  required={true}
                  value={docRegistration}
                  onChange={setDocRegistration}
                />

                <DocumentUploader
                  type="profilePhoto"
                  title="Driver Profile Photo"
                  description="Clear passport-style headshot with good lighting."
                  required={true}
                  value={docProfilePhoto}
                  onChange={setDocProfilePhoto}
                />

                <DocumentUploader
                  type="vehiclePhoto"
                  title="Vehicle Exterior Photo (Optional)"
                  description="Photo showing license plate and vehicle condition."
                  required={false}
                  value={docVehiclePhoto}
                  onChange={setDocVehiclePhoto}
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Step 4: Review Application & Save to Cloudflare D1
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-4">
                {/* Personal summary */}
                <div>
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">
                    Personal Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Full Name:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">CNIC Number:</span>{' '}
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
                      <span className="text-slate-800 dark:text-slate-200">{formData.address}, {formData.city}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle summary */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">
                    Vehicle & License Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Category:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Vehicle:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formData.vehicleMake} {formData.vehicleModel} ({formData.vehicleYear})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">License Plate:</span>{' '}
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formData.licensePlate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">License No:</span>{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-200">{formData.drivingLicenseNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Documents checklist */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">
                    Cloudflare D1 Documents Ready ({ [docCnicFront, docCnicBack, docLicense, docRegistration, docProfilePhoto, docVehiclePhoto].filter(Boolean).length } Attached)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CNIC Front Attached
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CNIC Back Attached
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Driving License Attached
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registration Card Attached
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Profile Photo Attached
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  I hereby declare that all provided driver details, vehicle registration number, and CNIC/License documents are authentic and valid. I agree to store this registration record in the Cloudflare D1 database.
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

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
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
                    <span>Saving to Cloudflare D1...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Submit & Save to D1</span>
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
