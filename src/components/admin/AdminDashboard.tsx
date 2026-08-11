import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Application, Program, User } from '../../types';
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Settings,
  ShieldCheck,
  Plus,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateSection: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateSection }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Registered Students</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {stats?.totalStudents || 0}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">Unique Applicants</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Applications</div>
          <div className="text-2xl font-extrabold text-blue-900 font-mono">
            {stats?.totalApps || 0}
          </div>
          <div className="text-[11px] text-slate-500">Submitted & Drafts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Pending Verification</div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            {stats?.pendingApps || 0}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">Docs Under Review</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Entrance Tests Taken</div>
          <div className="text-2xl font-extrabold text-indigo-900 font-mono">
            {stats?.totalTestsCompleted || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            {stats?.totalTestsPassed || 0} Passed ({stats?.totalTestsFailed || 0} Failed)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Admissions Confirmed</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {stats?.selectedStudents || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Selected Candidates</div>
        </div>
      </div>

      {/* Quick Access Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigateSection('applications')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-3"
        >
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl w-fit">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Application Management</h3>
          <p className="text-xs text-slate-600">Review student applications, verify uploaded documents, assign entrance tests, and issue admission decisions.</p>
        </div>

        <div
          onClick={() => onNavigateSection('questions')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-3"
        >
          <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl w-fit">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Question Bank & CSV Import</h3>
          <p className="text-xs text-slate-600">Add questions across subjects, configure difficulty levels, and import/export question sets via CSV.</p>
        </div>

        <div
          onClick={() => onNavigateSection('tests')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-3"
        >
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl w-fit">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Test Structure & Rules</h3>
          <p className="text-xs text-slate-600">Configure exam durations, question randomization rules, negative marking formulas, and result visibility.</p>
        </div>
      </div>
    </div>
  );
};
