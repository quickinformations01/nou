import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { api } from '../../services/api';
import {
  Upload,
  Plus,
  Trash2,
  FileSpreadsheet,
  Download,
  Search,
  CheckCircle2,
  HelpCircle,
  Filter,
  Edit2
} from 'lucide-react';

export const QuestionBankAdmin: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Modal State for New/Edit Question
  const [showModal, setShowModal] = useState(false);
  const [qText, setQText] = useState('');
  const [qSubject, setQSubject] = useState('Computer Science');
  const [qType, setQType] = useState<'MCQ' | 'Multiple Select' | 'Short Answer' | 'True/False'>('MCQ');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qMarks, setQMarks] = useState(5);
  const [qNegative, setQNegative] = useState(1);
  const [qExplanation, setQExplanation] = useState('');

  // Options for MCQ
  const [options, setOptions] = useState([
    { id: 'opt-a', text: 'Option A', isCorrect: true },
    { id: 'opt-b', text: 'Option B', isCorrect: false },
    { id: 'opt-c', text: 'Option C', isCorrect: false },
    { id: 'opt-d', text: 'Option D', isCorrect: false }
  ]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions();
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const correctOptionIds = options.filter((o) => o.isCorrect).map((o) => o.id);
      await api.createQuestion({
        subject: qSubject,
        type: qType,
        questionText: qText,
        options: options.map((o) => ({ id: o.id, text: o.text })),
        correctAnswer: correctOptionIds,
        difficulty: qDifficulty,
        marks: qMarks,
        negativeMarks: qNegative,
        explanation: qExplanation
      });
      setShowModal(false);
      setQText('');
      loadQuestions();
      alert('Question saved to question bank!');
    } catch (err: any) {
      alert(err.message || 'Error saving question');
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) return;

        const importedQs: Partial<Question>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 6) {
            const correctOptLetter = (cols[6] || 'A').toUpperCase();
            let correctOptId = 'opt-a';
            if (correctOptLetter === 'B') correctOptId = 'opt-b';
            if (correctOptLetter === 'C') correctOptId = 'opt-c';
            if (correctOptLetter === 'D') correctOptId = 'opt-d';

            importedQs.push({
              subject: cols[0] || 'General',
              type: 'MCQ',
              questionText: cols[1],
              options: [
                { id: 'opt-a', text: cols[2] },
                { id: 'opt-b', text: cols[3] },
                { id: 'opt-c', text: cols[4] },
                { id: 'opt-d', text: cols[5] }
              ],
              correctAnswer: [correctOptId],
              difficulty: 'Medium',
              marks: 5,
              negativeMarks: 1
            });
          }
        }

        const res = await api.bulkImportQuestions(importedQs);
        alert(`Successfully imported ${res.count} questions into bank!`);
        loadQuestions();
      } catch (err: any) {
        alert('CSV Parsing Error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const header = 'Subject,QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectOptionLetter\n';
    const sample = 'Computer Science,What does SQL stand for?,Structured Query Language,Sequential Question List,Simple Query Logic,Server Language,A\n';
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NOU_Question_Import_Template.csv';
    link.click();
  };

  const filtered = questions.filter((q) => {
    const matchSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubj = filterSubject === 'All' || q.subject === filterSubject;
    const matchDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    return matchSearch && matchSubj && matchDiff;
  });

  return (
    <div className="space-y-6">
      {/* Header & CSV Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Entrance Exam Question Bank</h2>
          <p className="text-xs text-slate-500">Manage questions across subjects & bulk import via CSV</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadCSVTemplate}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>CSV Template</span>
          </button>

          <label className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <input
          type="text"
          placeholder="Search question text or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
        />

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
        >
          <option value="All">All Subjects</option>
          <option>Computer Science</option>
          <option>Logical Reasoning</option>
          <option>General Aptitude</option>
          <option>Management</option>
        </select>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
        >
          <option value="All">All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">Q#{idx + 1}</span>
                <span className="bg-slate-100 font-semibold text-slate-700 px-2.5 py-0.5 rounded">{q.subject}</span>
                <span className="text-[10px] font-bold uppercase text-slate-400">{q.difficulty}</span>
              </div>

              <div className="text-slate-500 font-mono">
                +{q.marks} Marks | -{q.negativeMarks} Neg
              </div>
            </div>

            <div className="font-bold text-slate-900 text-sm">{q.questionText}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {q.options?.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-2.5 rounded-xl border ${
                    opt.isCorrect ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {opt.text} {opt.isCorrect && '✓'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveQuestion} className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Add New Question</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={qSubject}
                onChange={(e) => setQSubject(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Statement</label>
              <textarea
                required
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Options (Check the correct answer)</label>
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={opt.isCorrect}
                    onChange={() => {
                      setOptions(options.map((o, i) => ({ ...o, isCorrect: i === idx })));
                    }}
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[idx].text = e.target.value;
                      setOptions(updated);
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-semibold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-900 text-white rounded-xl font-bold">
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
