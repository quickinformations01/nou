import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, GraduationCap, LogOut, ExternalLink } from 'lucide-react';

export const DemoBanner: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user, switchPersona, logout } = useAuth();

  return (
    <div className="bg-[#1D1D1B] text-slate-300 text-[11px] py-1.5 px-4 border-b border-[#2D2D2A] flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded text-[9px] tracking-[0.2em] uppercase border border-indigo-500/30">
          Demo Testing Session
        </span>
        <span className="hidden sm:inline text-slate-400 font-medium">Switch persona:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => switchPersona('student', 'usr-student-1')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            user?.role === 'student'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white/10 hover:bg-white/15 text-slate-300'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student (Rahul)</span>
        </button>

        <button
          onClick={() => switchPersona('admin', 'usr-admin-1')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            user?.role === 'admin'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-white/10 hover:bg-white/15 text-slate-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin (Dr. Mehta)</span>
        </button>

        <button
          onClick={() => switchPersona('faculty', 'usr-faculty-1')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            user?.role === 'faculty'
              ? 'bg-teal-600 text-white font-bold'
              : 'bg-white/10 hover:bg-white/15 text-slate-300'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Faculty (Prof. Kapoor)</span>
        </button>

        {user ? (
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 ml-1 text-xs font-medium"
            title="Log Out to Guest Mode"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Guest</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

