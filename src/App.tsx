import React, { useState, useEffect } from 'react';
import {
  Car,
  UserCheck,
  FolderKanban,
  Database,
  ShieldCheck,
  Sparkles,
  Layers,
  FileCode,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Server
} from 'lucide-react';
import { DriverRegistrationForm } from './components/public/DriverRegistrationForm';
import { RiderRegistrationForm } from './components/public/RiderRegistrationForm';
import { RegistrationsPortal } from './components/admin/RegistrationsPortal';
import { CloudflareD1Console } from './components/admin/CloudflareD1Console';
import { api } from './services/api';
import { D1Config } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'driver-reg' | 'rider-reg' | 'manage' | 'd1-console'>('driver-reg');
  const [d1Config, setD1Config] = useState<D1Config | null>(null);

  useEffect(() => {
    async function checkD1() {
      try {
        const conf = await api.getD1Config();
        setD1Config(conf);
      } catch (err) {
        console.error('Failed to query D1 config:', err);
      }
    }
    checkD1();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-sky-500 selection:text-white">
      <div>
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('driver-reg')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base tracking-tight text-white">Driver & Rider Portal</h1>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    D1 Cloudflare
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Registration & CNIC / License Document Storage in Cloudflare D1
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActiveTab('driver-reg')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'driver-reg'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-sky-300" /> Driver Registration
              </button>

              <button
                onClick={() => setActiveTab('rider-reg')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'rider-reg'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-300" /> Rider Registration
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'manage'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5 text-emerald-300" /> Manage Records
              </button>

              <button
                onClick={() => setActiveTab('d1-console')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'd1-console'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-400" /> D1 SQL Console
              </button>
            </nav>

            {/* Cloudflare D1 Connection Badge */}
            <div className="flex items-center gap-2">
              <div
                onClick={() => setActiveTab('d1-console')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400 border border-slate-700 transition-colors"
                title="Click to open Cloudflare D1 Console"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">D1 DB:</span>
                <span className="font-bold">{d1Config?.databaseId || 'noudb'}</span>
              </div>
            </div>
          </div>

          {/* Mobile subnav */}
          <div className="md:hidden flex overflow-x-auto border-t border-slate-800 px-4 py-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('driver-reg')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 ${
                activeTab === 'driver-reg' ? 'bg-sky-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              Driver Reg
            </button>
            <button
              onClick={() => setActiveTab('rider-reg')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 ${
                activeTab === 'rider-reg' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              Rider Reg
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 ${
                activeTab === 'manage' ? 'bg-emerald-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              Records & Docs
            </button>
            <button
              onClick={() => setActiveTab('d1-console')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 ${
                activeTab === 'd1-console' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 bg-slate-800'
              }`}
            >
              D1 Console
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'driver-reg' && (
            <DriverRegistrationForm onSuccess={() => setActiveTab('manage')} />
          )}

          {activeTab === 'rider-reg' && (
            <RiderRegistrationForm onSuccess={() => setActiveTab('manage')} />
          )}

          {activeTab === 'manage' && <RegistrationsPortal />}

          {activeTab === 'd1-console' && <CloudflareD1Console />}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white">
                <Car className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-200">Driver & Rider Registration Portal</span>
              <span className="text-[11px] text-slate-500">• Cloudflare D1 Backend Integration</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-slate-500">Tables:</span>
              <span className="text-sky-400">drivers</span>
              <span className="text-purple-400">riders</span>
              <span className="text-emerald-400">documents</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500">
            <p>© 2026 Driver & Rider Registration Platform. All documents & data stored in Cloudflare D1.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('driver-reg')} className="hover:text-slate-300">Driver Registration</button>
              <button onClick={() => setActiveTab('rider-reg')} className="hover:text-slate-300">Rider Registration</button>
              <button onClick={() => setActiveTab('d1-console')} className="hover:text-amber-400 font-mono">D1 Console</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
