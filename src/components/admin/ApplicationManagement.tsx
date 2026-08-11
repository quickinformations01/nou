import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Application, Program, ApplicationStatus, ApplicationDocument } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Download,
  AlertCircle,
  Eye,
  ShieldCheck,
  Send,
  UserCheck
} from 'lucide-react';

export const ApplicationManagement: React.FC<{ programs: Program[] }> = ({ programs }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Rejection modal
  const [rejectingDocType, setRejectingDocType] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getAllApplications();
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentMobile.includes(searchQuery);

    const matchesProg = filterProgram === 'All' || app.programId === filterProgram;
    const matchesStat = filterStatus === 'All' || app.status === filterStatus;

    return matchesSearch && matchesProg && matchesStat;
  });

  const handleVerifyDoc = async (appId: string, docType: string) => {
    try {
      const updated = await api.verifyDocument(appId, docType, 'Verified');
      setSelectedApp(updated);
      loadApplications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRejectDoc = async () => {
    if (!selectedApp || !rejectingDocType) return;
    try {
      const updated = await api.verifyDocument(selectedApp.id, rejectingDocType, 'Rejected', rejectionReason);
      setSelectedApp(updated);
      setRejectingDocType(null);
      setRejectionReason('');
      loadApplications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUpdateStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      const updated = await api.updateApplicationStatus(appId, status);
      setSelectedApp(updated);
      loadApplications();
      alert(`Application status updated to "${status}"`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleExportCSV = () => {
    const headers = 'App ID,Student Name,Email,Mobile,Program,Status,Submitted At\n';
    const rows = filteredApps
      .map(
        (a) =>
          `"${a.id}","${a.studentName}","${a.studentEmail}","${a.studentMobile}","${a.programTitle}","${a.status}","${a.submittedAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NOU_Applications_Export_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">Application Management Directory</h2>
            <p className="text-xs text-slate-500">
              Total Applications: {applications.length} | Showing: {filteredApps.length}
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Name, App ID, Email, Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs"
            />
          </div>

          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="All">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="All">All Statuses</option>
            <option>Application Created</option>
            <option>Application Submitted</option>
            <option>Documents Under Review</option>
            <option>Documents Verified</option>
            <option>Entrance Test Required</option>
            <option>Entrance Test Completed</option>
            <option>Selected</option>
            <option>Admission Confirmed</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="p-4">App Ref ID</th>
                <th className="p-4">Candidate Details</th>
                <th className="p-4">Program</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-900">{app.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{app.studentName}</div>
                    <div className="text-[11px] text-slate-500">
                      {app.studentEmail} | {app.studentMobile}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{app.programTitle}</div>
                    <div className="text-[11px] text-slate-500">{app.specialization}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : 'Draft'}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md text-[10px] font-bold">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-900">App ID: {selectedApp.id}</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedApp.studentName}</h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value as ApplicationStatus)}
                  className="bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  <option>Application Created</option>
                  <option>Application Submitted</option>
                  <option>Documents Under Review</option>
                  <option>Documents Verified</option>
                  <option>Entrance Test Required</option>
                  <option>Entrance Test Completed</option>
                  <option>Selected</option>
                  <option>Admission Confirmed</option>
                  <option>Rejected</option>
                </select>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Document Verification Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Uploaded Documents & Verification Status
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{doc.documentType}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div className="text-slate-600 font-mono text-[11px]">{doc.fileName}</div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleVerifyDoc(selectedApp.id, doc.documentType)}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verify</span>
                      </button>

                      <button
                        onClick={() => setRejectingDocType(doc.documentType)}
                        className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reason Modal */}
            {rejectingDocType && (
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-3 text-xs">
                <div className="font-bold text-rose-900">Provide Rejection Reason for {rejectingDocType}</div>
                <input
                  type="text"
                  placeholder="e.g. Image blurry, name does not match mark sheet..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setRejectingDocType(null)}
                    className="px-3 py-1.5 bg-slate-200 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectDoc}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
