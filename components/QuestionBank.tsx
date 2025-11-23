
import React, { useState } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { Difficulty, Question, Subject } from '../types';
import { generatePracticeQuestions } from '../services/geminiService';
import { Loader2, CheckCircle, XCircle, Eye, EyeOff, BookOpen, Database, PlayCircle, HelpCircle } from 'lucide-react';
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
  
  // Interactive State
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const filteredTopics = SYLLABUS_DATA.filter(t => t.subject === selectedSubject);

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setQuestions([]);
    setRevealedSolutions({});
    setUserSelections({});
    setCheckedState({});
    
    // Updated to pass selectedSubject for better offline accuracy
    const results = await generatePracticeQuestions(selectedTopic, difficulty, selectedSubject as Subject);
    setQuestions(results);
    setLoading(false);
  };

  const handleSelectOption = (qIdx: number, option: string) => {
    if (checkedState[qIdx]) return; // Prevent changing after checking
    setUserSelections(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleCheckAnswer = (qIdx: number) => {
    if (!userSelections[qIdx]) return;
    
    const isCorrect = userSelections[qIdx] === questions[qIdx].correctAnswer;
    
    setCheckedState(prev => ({ ...prev, [qIdx]: true }));
    // Automatically reveal explanation when checked
    setRevealedSolutions(prev => ({ ...prev, [qIdx]: true }));

    // Send data to global analytics
    if (onResultUpdate && selectedTopic) {
        onResultUpdate(selectedTopic, isCorrect);
    }
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
            <h2 className="text-2xl font-bold">Practice Question Bank</h2>
          </div>
          <p className="text-teal-50">
            Access practice problems tailored to your difficulty level from our offline database.
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
            {loading ? <Loader2 className="animate-spin" /> : <Database />}
            Get Questions
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isChecked = checkedState[idx];
          const userSelected = userSelections[idx];
          const isCorrect = userSelected === q.correctAnswer;

          return (
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
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userSelected === opt;
                  const isThisCorrect = opt === q.correctAnswer;
                  
                  let itemClass = "p-4 border rounded-lg flex items-center gap-3 transition-all relative ";
                  
                  if (isChecked) {
                     if (isThisCorrect) {
                        itemClass += "bg-green-50 border-green-500 ring-1 ring-green-500 text-green-900";
                     } else if (isThisSelected) {
                        itemClass += "bg-red-50 border-red-500 ring-1 ring-red-500 text-red-900";
                     } else {
                        itemClass += "bg-gray-50 opacity-60";
                     }
                  } else {
                     if (isThisSelected) {
                        itemClass += "bg-teal-50 border-teal-500 ring-1 ring-teal-500 cursor-pointer";
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
                         isChecked && isThisCorrect ? 'bg-green-200 border-green-300 text-green-800' :
                         isChecked && isThisSelected && !isThisCorrect ? 'bg-red-200 border-red-300 text-red-800' :
                         isThisSelected ? 'bg-teal-600 text-white border-teal-600' : 
                         'bg-gray-100 text-gray-500 border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="font-medium">{opt}</span>
                      
                      {isChecked && isThisCorrect && <CheckCircle className="absolute right-4 text-green-600" size={20} />}
                      {isChecked && isThisSelected && !isThisCorrect && <XCircle className="absolute right-4 text-red-500" size={20} />}
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 flex flex-wrap items-center gap-4">
                <button
                   onClick={() => handleCheckAnswer(idx)}
                   disabled={isChecked || !userSelected}
                   className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm transition-all ${
                     isChecked 
                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                       : userSelected 
                         ? 'bg-teal-600 text-white hover:bg-teal-700'
                         : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   }`}
                >
                   <PlayCircle size={16} /> Check Answer
                </button>

                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                <button 
                  onClick={() => toggleSolution(idx)}
                  className="text-gray-500 font-medium text-sm flex items-center gap-2 hover:text-teal-600 transition-colors"
                >
                  {revealedSolutions[idx] ? <EyeOff size={16} /> : <Eye size={16} />}
                  {revealedSolutions[idx] ? 'Hide Solution' : 'Show Solution'}
                </button>
              </div>

              {revealedSolutions[idx] && (
                <div className="mt-4 bg-teal-50 p-5 rounded-lg border border-teal-100 animate-in fade-in slide-in-from-top-1">
                  <div className={`flex items-center gap-2 font-bold mb-3 ${isChecked && isCorrect ? 'text-green-700' : 'text-teal-800'}`}>
                    {isChecked ? (
                       isCorrect ? <><CheckCircle size={18} /> Correct!</> : <><XCircle size={18} /> Incorrect</>
                    ) : (
                       <><HelpCircle size={18} /> Solution</>
                    )}
                  </div>
                  
                  {!isChecked && (
                     <div className="mb-2 text-sm font-semibold text-gray-700">
                        Correct Answer: {q.correctAnswer}
                     </div>
                  )}

                  <div className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded border border-teal-100/50">
                    <strong className="block mb-1 text-teal-900">Explanation:</strong>
                    <ReactMarkdown>{q.explanation}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
