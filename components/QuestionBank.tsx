import React, { useState } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { Difficulty, Question, Subject } from '../types';
import { generatePracticeQuestions } from '../services/geminiService';
import { Loader2, BrainCircuit, CheckCircle, XCircle, Eye, EyeOff, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const QuestionBank: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  const filteredTopics = SYLLABUS_DATA.filter(t => t.subject === selectedSubject);

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setQuestions([]);
    setRevealedSolutions({});
    
    const results = await generatePracticeQuestions(selectedTopic, difficulty);
    setQuestions(results);
    setLoading(false);
  };

  const toggleSolution = (index: number) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-teal-100" />
            <h2 className="text-2xl font-bold">AI Question Bank</h2>
          </div>
          <p className="text-teal-50">
            Generate unlimited practice problems for any topic, tailored to your difficulty level.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Subject Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Subject</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => { setSelectedSubject(e.target.value as Subject); setSelectedTopic(''); }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">-- Choose Subject --</option>
                {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Topic Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. Select Topic</label>
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedSubject}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none disabled:bg-gray-100"
              >
                <option value="">-- Choose Topic --</option>
                {filteredTopics.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3. Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedTopic}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
            Generate Questions
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                Q{idx + 1}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                q.difficulty.includes('Easy') ? 'bg-green-100 text-green-700' :
                q.difficulty.includes('Medium') ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {difficulty}
              </span>
            </div>
            
            <p className="text-lg text-gray-900 font-medium mb-4">{q.questionText}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-bold">
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-gray-700">{opt}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <button 
                onClick={() => toggleSolution(idx)}
                className="text-teal-600 font-medium text-sm flex items-center gap-2 hover:underline"
              >
                {revealedSolutions[idx] ? <EyeOff size={16} /> : <Eye size={16} />}
                {revealedSolutions[idx] ? 'Hide Solution' : 'Show Solution'}
              </button>

              {revealedSolutions[idx] && (
                <div className="mt-4 bg-teal-50 p-4 rounded-lg border border-teal-100">
                  <div className="flex items-center gap-2 text-teal-800 font-bold mb-2">
                    <CheckCircle size={18} />
                    Correct Answer: {q.correctAnswer}
                  </div>
                  <div className="text-gray-700 text-sm">
                    <strong className="block mb-1">Explanation:</strong>
                    <ReactMarkdown>{q.explanation}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {questions.length === 0 && !loading && selectedTopic && (
          <div className="text-center text-gray-500 py-8">
            Press "Generate Questions" to start practicing.
          </div>
        )}
      </div>
    </div>
  );
};
