import React, { useEffect, useState } from 'react';
import {
  Car,
  UserCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Database,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { DriverRegistration, RiderRegistration, StatusType, DocumentItem } from '../../types';

export const RegistrationsPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'riders'>('drivers');
  const [drivers, setDrivers] = useState<DriverRegistration[]>([]);
  const [riders, setRiders] = useState<RiderRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Driver / Rider for detail modal
  const [selectedDriver, setSelectedDriver] = useState<DriverRegistration | null>(null);
  const [selectedRider, setSelectedRider] = useState<RiderRegistration | null>(null);

  // Selected Document image preview modal
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Status notes state
  const [statusNoteInput, setStatusNoteInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [drvData, rdrData] = await Promise.all([api.getDrivers(), api.getRiders()]);
      setDrivers(drvData);
      setRiders(rdrData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch registration records from Cloudflare D1');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered lists
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cnicNumber.includes(searchQuery) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRiders = riders.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cnicNumber.includes(searchQuery) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Driver Status Update
  const handleUpdateDriverStatus = async (id: string, newStatus: StatusType) => {
    setActionLoading(true);
    try {
      const res = await api.updateDriverStatus(id, newStatus, statusNoteInput);
      setDrivers(drivers.map((d) => (d.id === id ? res.driver : d)));
      if (selectedDriver?.id === id) setSelectedDriver(res.driver);
      setStatusNoteInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to update status in D1');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Rider Status Update
  const handleUpdateRiderStatus = async (id: string, newStatus: StatusType) => {
    setActionLoading(true);
    try {
      const res = await api.updateRiderStatus(id, newStatus, statusNoteInput);
      setRiders(riders.map((r) => (r.id === id ? res.rider : r)));
      if (selectedRider?.id === id) setSelectedRider(res.rider);
      setStatusNoteInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to update status in D1');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete driver
  const handleDeleteDriver = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete Driver ${id} from Cloudflare D1?`)) return;
    try {
      await api.deleteDriver(id);
      setDrivers(drivers.filter((d) => d.id !== id));
      if (selectedDriver?.id === id) setSelectedDriver(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete driver from D1');
    }
  };

  // Delete rider
  const handleDeleteRider = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete Rider ${id} from Cloudflare D1?`)) return;
    try {
      await api.deleteRider(id);
      setRiders(riders.filter((r) => r.id !== id));
      if (selectedRider?.id === id) setSelectedRider(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete rider from D1');
    }
  };

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" /> Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cloudflare D1 Records Portal</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-xs font-mono font-semibold flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> D1 Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review and manage all submitted driver and rider registrations and document cards (CNIC front/back, license, registration).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Records
            </button>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Drivers
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{drivers.length}</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Riders
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{riders.length}</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {drivers.filter((d) => d.status === 'Pending').length + riders.filter((r) => r.status === 'Pending').length}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              D1 Document Files
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {drivers.reduce((acc, d) => acc + d.documents.length, 0) + riders.reduce((acc, r) => acc + r.documents.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'drivers'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Car className="w-4 h-4" /> Driver Registrations ({drivers.length})
            </button>

            <button
              onClick={() => setActiveTab('riders')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'riders'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Rider Registrations ({riders.length})
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, CNIC, plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* DRIVERS TABLE LIST */}
        {activeTab === 'drivers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="p-3">Driver ID</th>
                  <th className="p-3">Full Name & CNIC</th>
                  <th className="p-3">Vehicle Details</th>
                  <th className="p-3">License & City</th>
                  <th className="p-3">Docs in D1</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No driver registration records found.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">{driver.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{driver.fullName}</div>
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {driver.cnicNumber}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{driver.vehicleMake} {driver.vehicleModel}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Plate: {driver.licensePlate} ({driver.vehicleType})
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono">{driver.drivingLicenseNumber}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{driver.city}</div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md text-[11px]">
                          <FileText className="w-3 h-3" /> {driver.documents.length} Files
                        </span>
                      </td>
                      <td className="p-3">{getStatusBadge(driver.status)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedDriver(driver)}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:hover:bg-sky-900 text-sky-300 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Docs
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Driver"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* RIDERS TABLE LIST */}
        {activeTab === 'riders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="p-3">Rider ID</th>
                  <th className="p-3">Full Name & CNIC</th>
                  <th className="p-3">Contact & City</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">CNIC Docs in D1</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                {filteredRiders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No rider registration records found.
                    </td>
                  </tr>
                ) : (
                  filteredRiders.map((rider) => (
                    <tr key={rider.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">{rider.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{rider.fullName}</div>
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {rider.cnicNumber}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>{rider.phone}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{rider.city}</div>
                      </td>
                      <td className="p-3 font-semibold">{rider.preferredPaymentMethod}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md text-[11px]">
                          <FileText className="w-3 h-3" /> {rider.documents.length} Files
                        </span>
                      </td>
                      <td className="p-3">{getStatusBadge(rider.status)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedRider(rider)}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-300 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Docs
                          </button>
                          <button
                            onClick={() => handleDeleteRider(rider.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Rider"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DRIVER DETAIL & DOCUMENT REVIEW MODAL */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-8">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{selectedDriver.fullName}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                      {selectedDriver.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Registered on {new Date(selectedDriver.createdAt).toLocaleDateString()} • Stored in Cloudflare D1
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Driver Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <div>
                  <h4 className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">Personal Details</h4>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <p><span className="text-slate-400">CNIC Number:</span> <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedDriver.cnicNumber}</span></p>
                    <p><span className="text-slate-400">Email:</span> {selectedDriver.email}</p>
                    <p><span className="text-slate-400">Phone:</span> {selectedDriver.phone}</p>
                    <p><span className="text-slate-400">Address:</span> {selectedDriver.address}, {selectedDriver.city}</p>
                    <p><span className="text-slate-400">Emergency Contact:</span> {selectedDriver.emergencyContactName} ({selectedDriver.emergencyContactPhone})</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">Vehicle & License</h4>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <p><span className="text-slate-400">Vehicle Make & Model:</span> <span className="font-bold">{selectedDriver.vehicleMake} {selectedDriver.vehicleModel} ({selectedDriver.vehicleYear})</span></p>
                    <p><span className="text-slate-400">Category & Color:</span> {selectedDriver.vehicleType} • {selectedDriver.vehicleColor || 'N/A'}</p>
                    <p><span className="text-slate-400">License Plate:</span> <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{selectedDriver.licensePlate}</span></p>
                    <p><span className="text-slate-400">Driving License No:</span> <span className="font-mono">{selectedDriver.drivingLicenseNumber}</span> (Exp: {selectedDriver.licenseExpiryDate || 'N/A'})</p>
                    <p><span className="text-slate-400">Current Status:</span> {getStatusBadge(selectedDriver.status)}</p>
                  </div>
                </div>
              </div>

              {/* Document Cards Grid stored in D1 */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Attached Documents ({selectedDriver.documents.length} Files in Cloudflare D1)</span>
                  <span className="text-[11px] font-mono text-sky-500">d1_table: documents</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDriver.documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setPreviewDoc(doc)}
                      className="group cursor-pointer bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-sky-500 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{doc.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono">
                            {doc.type}
                          </span>
                        </div>
                        <div className="h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                          <img src={doc.dataUrl} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                            <Eye className="w-4 h-4" /> Zoom Image
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate flex justify-between items-center">
                        <span className="truncate">{doc.fileName}</span>
                        <span className="font-mono text-[10px]">{(doc.fileSize / 1024).toFixed(0)}KB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Update Verification Status in Cloudflare D1
                </h4>
                <div>
                  <input
                    type="text"
                    placeholder="Enter status update remarks / notes for driver..."
                    value={statusNoteInput}
                    onChange={(e) => setStatusNoteInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateDriverStatus(selectedDriver.id, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Driver Registration
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateDriverStatus(selectedDriver.id, 'Under Review')}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" /> Mark Under Review
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateDriverStatus(selectedDriver.id, 'Rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIDER DETAIL & DOCUMENT REVIEW MODAL */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{selectedRider.fullName}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {selectedRider.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Registered on {new Date(selectedRider.createdAt).toLocaleDateString()} • Stored in Cloudflare D1
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRider(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-2">
                <p><span className="text-slate-400">CNIC Number:</span> <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedRider.cnicNumber}</span></p>
                <p><span className="text-slate-400">Email & Phone:</span> {selectedRider.email} • {selectedRider.phone}</p>
                <p><span className="text-slate-400">Home Address:</span> {selectedRider.homeAddress}, {selectedRider.city}</p>
                <p><span className="text-slate-400">Payment Method:</span> {selectedRider.preferredPaymentMethod}</p>
                <p><span className="text-slate-400">Status:</span> {getStatusBadge(selectedRider.status)}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
                  Attached Rider CNIC & Profile Photos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRider.documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setPreviewDoc(doc)}
                      className="group cursor-pointer bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-purple-500 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{doc.title}</span>
                      </div>
                      <div className="h-36 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={doc.dataUrl} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Update Rider Verification Status in D1
                </h4>
                <input
                  type="text"
                  placeholder="Enter status notes..."
                  value={statusNoteInput}
                  onChange={(e) => setStatusNoteInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateRiderStatus(selectedRider.id, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                  >
                    Approve Rider
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateRiderStatus(selectedRider.id, 'Rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                  >
                    Reject Rider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL DOCUMENT ZOOM MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100">{previewDoc.title}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex justify-center bg-slate-950 rounded-xl mt-3 overflow-auto max-h-[75vh]">
              <img src={previewDoc.dataUrl} alt={previewDoc.title} className="max-h-[70vh] object-contain rounded-lg" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{previewDoc.fileName}</span>
              <span className="font-mono text-sky-400">D1 Document ID: {previewDoc.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
