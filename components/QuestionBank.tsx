
import React, { useState, useRef, useEffect } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { Difficulty, Question, Subject } from '../types';
import { generatePracticeQuestions } from '../services/geminiService';
import { Loader2, CheckCircle, XCircle, BookOpen, Database, Trophy, AlertCircle, RefreshCw, BarChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface QuestionBankProps {
    onResultUpdate?: (topicName: string, isCorrect: boolean) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ onResultUpdate }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Quiz State
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const topRef = useRef<HTMLDivElement>(null);

  const filteredTopics = SYLLABUS_DATA.filter(t => t.subject === selectedSubject);

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setQuestions([]);
    setUserSelections({});
    setQuizSubmitted(false);
    setScore({ correct: 0, total: 0 });
    
    const results = await generatePracticeQuestions(selectedTopic, difficulty, selectedSubject as Subject);
    setQuestions(results);
    setLoading(false);
  };

  const handleSelectOption = (qIdx: number, option: string) => {
    if (quizSubmitted) return; // Prevent changing after submission
    setUserSelections(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userSelections).length === 0) {
        alert("Please attempt at least one question before submitting.");
        return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
        const isCorrect = userSelections[idx] === q.correctAnswer;
        if (isCorrect) correctCount++;
        
        // Update global analytics for each question
        if (onResultUpdate && selectedTopic) {
            onResultUpdate(selectedTopic, isCorrect);
        }
    });

    setScore({ correct: correctCount, total: questions.length });
    setQuizSubmitted(true);
    
    // Scroll to top to show score
    setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const getScoreColor = (percentage: number) => {
      if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
      if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" ref={topRef}>
      
      {/* Quiz Configuration Panel */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-teal-100" />
            <h2 className="text-2xl font-bold">Practice Question Bank</h2>
          </div>
          <p className="text-teal-50">
            Select a topic to generate a quick practice quiz.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            {loading ? <Loader2 className="animate-spin" /> : <Database />}
            {quizSubmitted ? 'Generate New Quiz' : 'Get Questions'}
          </button>
        </div>
      </div>

      {/* Scorecard Summary (Visible after submit) */}
      {quizSubmitted && (
          <div className={`rounded-xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 ${getScoreColor((score.correct / score.total) * 100)}`}>
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <Trophy size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold">Quiz Results</h3>
                      <p className="font-medium opacity-90">
                          You scored {score.correct} out of {score.total}
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-6 text-center">
                  <div>
                      <div className="text-3xl font-bold">{Math.round((score.correct / score.total) * 100)}%</div>
                      <div className="text-xs font-bold uppercase tracking-wider opacity-75">Accuracy</div>
                  </div>
                  <div className="w-px h-10 bg-current opacity-20 hidden md:block"></div>
                  <div className="hidden md:block">
                      <div className="text-3xl font-bold">{score.total - Object.keys(userSelections).length}</div>
                      <div className="text-xs font-bold uppercase tracking-wider opacity-75">Skipped</div>
                  </div>
              </div>
          </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userSelected = userSelections[idx];
          const isCorrect = userSelected === q.correctAnswer;
          const isSkipped = !userSelected;

          return (
            <div key={idx} className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
                quizSubmitted 
                    ? (isCorrect ? 'border-green-200 bg-green-50/10' : isSkipped ? 'border-gray-200' : 'border-red-200 bg-red-50/10') 
                    : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                  Q{idx + 1}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  q.difficulty.includes('Easy') ? 'bg-green-100 text-green-700' :
                  q.difficulty.includes('Medium') ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {difficulty.split(' ')[0]}
                </span>
              </div>
              
              <p className="text-lg text-gray-900 font-medium mb-4">{q.questionText}</p>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userSelected === opt;
                  const isThisCorrect = opt === q.correctAnswer;
                  
                  let itemClass = "p-4 border rounded-lg flex items-center gap-3 transition-all relative ";
                  
                  if (quizSubmitted) {
                     if (isThisCorrect) {
                        itemClass += "bg-green-100 border-green-500 ring-1 ring-green-500 text-green-900";
                     } else if (isThisSelected) {
                        itemClass += "bg-red-100 border-red-500 ring-1 ring-red-500 text-red-900";
                     } else {
                        itemClass += "bg-white opacity-60 border-gray-200";
                     }
                  } else {
                     if (isThisSelected) {
                        itemClass += "bg-teal-50 border-teal-500 ring-1 ring-teal-500 cursor-pointer shadow-sm";
                     } else {
                        itemClass += "hover:bg-gray-50 cursor-pointer border-gray-200";
                     }
                  }

                  return (
                    <div 
                      key={optIdx} 
                      onClick={() => handleSelectOption(idx, opt)}
                      className={itemClass}
                    >
                      <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold border ${
                         quizSubmitted && isThisCorrect ? 'bg-green-600 text-white border-green-600' :
                         quizSubmitted && isThisSelected ? 'bg-red-600 text-white border-red-600' :
                         isThisSelected ? 'bg-teal-600 text-white border-teal-600' : 
                         'bg-gray-100 text-gray-500 border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="font-medium">{opt}</span>
                      
                      {quizSubmitted && isThisCorrect && <CheckCircle className="absolute right-4 text-green-600" size={20} />}
                      {quizSubmitted && isThisSelected && !isThisCorrect && <XCircle className="absolute right-4 text-red-500" size={20} />}
                    </div>
                  );
                })}
              </div>

              {/* Solution Section (Revealed after submit) */}
              {quizSubmitted && (
                <div className="mt-4 bg-white p-5 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-2 font-bold mb-3 text-gray-800">
                    <BookOpen size={18} className="text-teal-600" /> 
                    <span>Explanation</span>
                  </div>
                  
                  <div className="text-gray-700 text-sm leading-relaxed">
                    <ReactMarkdown>{q.explanation}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Action Buttons */}
        {questions.length > 0 && !quizSubmitted && (
            <div className="flex justify-center pt-6 pb-12">
                <button
                    onClick={handleSubmitQuiz}
                    className="bg-gray-900 hover:bg-black text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 transform hover:-translate-y-1"
                >
                    <BarChart size={24} /> Submit Quiz & View Analytics
                </button>
            </div>
        )}

        {questions.length === 0 && !loading && selectedTopic && (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Database className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Ready to practice?</p>
            <p className="text-sm">Select a subject and topic above, then click "Get Questions" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};