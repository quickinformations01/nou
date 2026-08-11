import React from 'react';
import { Mail, Phone, MapPin, Globe, ShieldCheck } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1D1D1B] text-slate-400 text-sm border-t border-[#2D2D2A] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[#1D1D1B] flex items-center justify-center font-serif text-2xl font-bold rounded-lg shadow-sm">
                N
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">NOU</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Nexus Online Institute</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering students across India with flexible, career-oriented online degree programs and state-of-the-art digital learning infrastructure.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Nexus Knowledge Campus, Tech City Park, Cyberabad, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Toll-Free Admissions: +91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>admissions@nexus.edu.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Programs */}
          <div>
            <h4 className="text-white font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">Undergraduate</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">B.Tech Technology</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">BCA Computer Apps</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">BBA Business Admin</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">B.Com Commerce</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">B.Sc Science</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">BA Bachelor of Arts</button></li>
            </ul>
          </div>

          {/* Col 3: Postgraduate */}
          <div>
            <h4 className="text-white font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">Postgraduate</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">MBA Business Admin</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">MCA Computer Apps</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">M.Com Commerce</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">M.Sc Science</button></li>
              <li><button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">MA Master of Arts</button></li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('admissions')} className="hover:text-white transition-colors">Admission Process</button></li>
              <li><button onClick={() => onNavigate('test-info')} className="hover:text-white transition-colors">Entrance Test Guidelines</button></li>
              <li><button onClick={() => onNavigate('dates')} className="hover:text-white transition-colors">Important Academic Dates</button></li>
              <li><button onClick={() => onNavigate('faqs')} className="hover:text-white transition-colors">FAQs & Support</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">Student Login Portal</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2D2D2A] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NOU — Nexus Online Institute. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('faqs')} className="hover:text-slate-400">Privacy Policy</button>
            <button onClick={() => onNavigate('faqs')} className="hover:text-slate-400">Terms of Admission</button>
            <button onClick={() => onNavigate('faqs')} className="hover:text-slate-400">Academic Regulations</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
