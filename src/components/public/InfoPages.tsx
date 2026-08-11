import React from 'react';
import { Mail, Phone, MapPin, Calendar, HelpCircle, DollarSign, Award, Clock } from 'lucide-react';

export const AboutView: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">About NOU — Nexus Online Institute</h1>
      <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
        Nexus Online Institute (NOU) is a premier higher education institution dedicated to delivering career-oriented online degree programs across India. Built on modern cloud technologies, NOU offers flexible, accessible, and high-quality learning tailored for students and working professionals.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
        <p className="leading-relaxed">To democratize higher education across India by offering flexible, industry-relevant undergraduate and postgraduate online degrees.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <h3 className="text-base font-bold text-slate-900">Interactive Portal</h3>
        <p className="leading-relaxed">Combining live interactive sessions, recorded lectures, digital libraries, and continuous online assessment tools.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <h3 className="text-base font-bold text-slate-900">Merit Admission</h3>
        <p className="leading-relaxed">Transparent computer-based entrance tests with real-time automated scoring ensuring complete fairness.</p>
      </div>
    </div>
  </div>
);

export const ContactView: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div className="bg-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Contact Admissions & Helpdesk</h1>
      <p className="text-slate-300 text-sm max-w-2xl">Have questions regarding program eligibility, application submission, or entrance exams? Reach out to us.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs text-slate-700">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Admission Office</h3>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-900">Nexus Knowledge Campus</div>
            <div>Tech City Park, Cyberabad, India - 500081</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-blue-800 shrink-0" />
          <div>Toll Free: +91 1800-123-4567 | Landline: 040-88992211</div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-800 shrink-0" />
          <div>admissions@nexus.edu.in | support@nexus.edu.in</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Send an Inquiry</h3>
        <div className="space-y-2 text-xs">
          <input type="text" placeholder="Your Name" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
          <input type="email" placeholder="Your Email" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
          <textarea placeholder="Your Message or Question" rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
          <button className="w-full py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-950 transition-colors">Submit Inquiry</button>
        </div>
      </div>
    </div>
  </div>
);

export const FAQsView: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Frequently Asked Questions</h1>
      <p className="text-slate-300 text-sm mt-2">Find answers to common questions about admissions, entrance exams, and fee structure.</p>
    </div>

    <div className="space-y-4 max-w-4xl mx-auto">
      {[
        { q: 'How do I take the NOU Entrance Exam?', a: 'Once your application and documents are submitted, log in to your Student Dashboard. Click on Entrance Test tab to start your assigned test.' },
        { q: 'Is the entrance test automatically evaluated?', a: 'Yes! MCQ, True/False, and Multiple Select questions are graded immediately upon submission by our server. Scorecards are generated instantly.' },
        { q: 'What happens if my internet disconnects during the test?', a: 'NOU features auto-save functionality. Your answers are saved continuously, so you can resume your test safely when your connection returns.' },
        { q: 'Can I re-upload rejected documents?', a: 'Yes. If a document is marked as "Re-upload Required" by the admin, you can upload a fresh clear copy directly from your student dashboard.' }
      ].map((faq, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-800" />
            <span>{faq.q}</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);

export const ImportantDatesView: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Important Academic Dates 2026</h1>
      <p className="text-slate-300 text-sm mt-2">Keep track of key admission deadlines, test windows, and merit list publication dates.</p>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden max-w-3xl mx-auto">
      <div className="divide-y divide-slate-100 text-xs">
        {[
          { event: 'Online Application Opens', date: 'June 01, 2026', status: 'Active' },
          { event: 'Entrance Test Window Phase 1', date: 'June 15 - August 30, 2026', status: 'Ongoing' },
          { event: 'Document Verification Window', date: 'Rolling basis (within 48 hrs)', status: 'Active' },
          { event: 'First Admission Selection List', date: 'September 05, 2026', status: 'Upcoming' },
          { event: 'Commencement of Online Classes', date: 'September 15, 2026', status: 'Upcoming' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
            <div className="font-semibold text-slate-900">{item.event}</div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-600">{item.date}</span>
              <span className="bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded text-[10px] font-bold">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
