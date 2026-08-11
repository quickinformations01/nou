import React from 'react';
import { UserCheck, Award, BookOpen, Mail } from 'lucide-react';

export const FacultyView: React.FC = () => {
  const facultyMembers = [
    {
      name: 'Prof. Suresh Kapoor',
      designation: 'Head of Department & Senior Professor',
      department: 'Computer Science & Software Applications',
      qualification: 'Ph.D. in Computer Science (IIT Bombay), M.Tech (IIT Delhi)',
      specialization: 'Full Stack Architecture, Artificial Intelligence, Cloud Security',
      email: 'faculty.cs@nou.edu.in'
    },
    {
      name: 'Dr. Meenakshi Sundaram',
      designation: 'Associate Professor & Dean of Management',
      department: 'School of Business & Commerce',
      qualification: 'Ph.D. in Finance (IIM Ahmedabad), MBA',
      specialization: 'Corporate Finance, Digital Leadership, Quantitative Analytics',
      email: 'faculty.biz@nou.edu.in'
    },
    {
      name: 'Dr. Vikramaditya Rao',
      designation: 'Professor of Applied Mathematics',
      department: 'School of Mathematical Sciences',
      qualification: 'Ph.D. in Applied Mathematics (IISc Bangalore)',
      specialization: 'Linear Algebra, Probability, Numerical Methods',
      email: 'v.rao@nou.edu.in'
    },
    {
      name: 'Dr. Ananya Roy',
      designation: 'Associate Professor',
      department: 'School of Humanities & Social Sciences',
      qualification: 'Ph.D. in English Literature (JNU Delhi)',
      specialization: 'Digital Humanities, Communication Studies',
      email: 'a.roy@nou.edu.in'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Distinguished Faculty</h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Our academic team comprises leading professors, researchers, and industry experts committed to delivering high-quality online education and mentorship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg font-serif shrink-0 shadow-sm">
                {member.name.split(' ')[1]?.[0] || 'F'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <div className="text-xs font-semibold text-blue-900">{member.designation}</div>
                <div className="text-[11px] text-slate-500">{member.department}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <strong className="text-slate-900">Qualifications:</strong> {member.qualification}
              </div>
              <div>
                <strong className="text-slate-900">Specializations:</strong> {member.specialization}
              </div>
              <div className="flex items-center gap-1.5 text-blue-800 font-medium pt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{member.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
