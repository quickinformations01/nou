import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User, Bell, Menu, X, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const { user, settings, unreadCount, markNotifsAsRead } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'programs', label: 'Programs' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'entrance-test-info', label: 'Entrance Test' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'about', label: 'About NOU' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E1] shadow-2xs">
      {/* Disclaimer Bar when UGC recognition unverified */}
      {settings && !settings.ugcDisclaimerVerified && (
        <div className="bg-amber-50/80 text-amber-900 border-b border-[#E5E5E1] px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>{settings.ugcDisclaimerText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Institute Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="bg-[#1D1D1B] text-white w-11 h-11 flex items-center justify-center text-2xl font-serif rounded-lg shadow-xs group-hover:bg-indigo-900 transition-colors">
              N
            </div>
            <div>
              <div className="text-lg font-bold text-[#1D1D1B] tracking-tight flex items-center gap-2">
                <span>NOU</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-normal border-l border-[#E5E5E1] pl-2 hidden sm:inline">
                  Nexus Online Institute
                </span>
                <span className="hidden sm:inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                  India
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide">
                {settings?.institutionTagline || 'Learn Online. Build Your Future.'}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                  currentTab === link.id
                    ? 'text-indigo-700 bg-slate-100'
                    : 'text-slate-600 hover:text-[#1D1D1B] hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons & Portal Link */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    markNotifsAsRead();
                    onNavigate('dashboard');
                  }}
                  className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors border border-[#E5E5E1]"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-[#1D1D1B]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D1D1B] text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-900 transition-colors shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-indigo-300" />
                  <span>
                    {user.role === 'admin'
                      ? 'Admin Dashboard'
                      : user.role === 'faculty'
                      ? 'Faculty Portal'
                      : 'Student Portal'}
                  </span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-lg text-slate-700 hover:text-indigo-700 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Student Login
                </button>
                <button
                  onClick={() => onNavigate('apply')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest shadow-md shadow-indigo-100 transition-all"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 text-slate-700 bg-slate-100 rounded-lg"
              >
                <User className="w-5 h-5 text-blue-900" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium ${
                currentTab === link.id
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-center"
              >
                Go to Dashboard ({user.role})
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-lg font-medium text-center"
                >
                  Student Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('apply');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-blue-900 text-white rounded-lg font-semibold text-center"
                >
                  Apply Now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
