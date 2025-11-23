
import React, { useMemo, useState } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { TopicProgress, Subject, Status, ExerciseProgress, TopicPracticeStats } from '../types';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Target, BookOpen, Filter, Lightbulb, PieChart } from 'lucide-react';

interface PerformanceAnalyticsProps {
  progress: Record<string, TopicProgress>;
  practiceStats?: Record<string, TopicPracticeStats>; // New Prop
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ progress, practiceStats = {} }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  
  // --- Calculation Logic ---
  const stats = useMemo(() => {
    const data = {
      overall: { total: 0, completed: 0, exercisesTotal: 0, exercisesDone: 0 },
      subjects: {
        [Subject.PHYSICS]: { total: 0, completed: 0, score: 0, weakTopics: [] as string[] },
        [Subject.CHEMISTRY]: { total: 0, completed: 0, score: 0, weakTopics: [] as string[] },
        [Subject.MATHS]: { total: 0, completed: 0, score: 0, weakTopics: [] as string[] },
      },
      // Combining data for advanced insights
      holisticTopics: [] as { 
          id: string;
          name: string; 
          subject: Subject; 
          textbookScore: number; // Volume
          quizScore: number;     // Accuracy (Online)
          status: string;
          suggestion: string;
      }[]
    };

    SYLLABUS_DATA.forEach(topic => {
      const p = progress[topic.id];
      const practice = practiceStats[topic.id];

      // Explicitly cast to ExerciseProgress[] to ensure correct reduce type inference
      const exercises = (p?.exercises || []) as ExerciseProgress[];
      
      // 1. Textbook Score (Volume)
      const totalQ = exercises.reduce((acc, curr) => acc + (curr.total || 0), 0);
      const doneQ = exercises.reduce((acc, curr) => acc + (curr.completed || 0), 0);
      const textbookScore = totalQ > 0 ? (doneQ / totalQ) * 100 : 0;

      // 2. Quiz Score (Accuracy - Online)
      let quizScore = 0;
      let hasQuizData = false;
      if (practice && practice.attempts > 0) {
          quizScore = (practice.correct / practice.attempts) * 100;
          hasQuizData = true;
      }

      // Overall Stats
      data.overall.total++;
      data.overall.exercisesTotal += totalQ;
      data.overall.exercisesDone += doneQ;

      if (p?.status === Status.COMPLETED || p?.status === Status.REVISED) {
        data.overall.completed++;
        data.subjects[topic.subject].completed++;
      }

      // Subject Stats
      data.subjects[topic.subject].total++;
      data.subjects[topic.subject].score += textbookScore;

      // --- SUGGESTION ENGINE ---
      let suggestion = "";
      if (textbookScore < 20 && !hasQuizData) {
          suggestion = "Start solving exercises to build a base.";
      } else if (textbookScore > 80 && hasQuizData && quizScore > 80) {
          suggestion = "Mastered! Move to next topic.";
      } else if (textbookScore > 70 && hasQuizData && quizScore < 50) {
          suggestion = "High volume but low accuracy. Conceptual gaps likely. Revisit Theory.";
      } else if (textbookScore < 40 && hasQuizData && quizScore > 80) {
          suggestion = "Strong intuition! Solve more textbook problems to solidify muscle memory.";
      } else if (textbookScore > 50 && !hasQuizData) {
          suggestion = "Good textbook progress. Take a quiz to test retention.";
      } else {
          suggestion = "Keep pushing. Balance reading and solving.";
      }

      data.holisticTopics.push({
          id: topic.id,
          name: topic.name,
          subject: topic.subject,
          textbookScore: Math.round(textbookScore),
          quizScore: hasQuizData ? Math.round(quizScore) : -1, // -1 indicates no data
          status: p?.status || Status.NOT_STARTED,
          suggestion
      });
    });

    // Normalize Subject Scores
    Object.keys(data.subjects).forEach(key => {
        const k = key as Subject;
        if (data.subjects[k].total > 0) {
            data.subjects[k].score = Math.round(data.subjects[k].score / data.subjects[k].total);
        }
    });

    return data;
  }, [progress, practiceStats]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredHolisticTopics = stats.holisticTopics.filter(t => selectedSubject === 'All' || t.subject === selectedSubject);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 rounded-lg text-bt-blue"><BarChart3 size={20} /></div>
             <h3 className="text-sm font-bold text-gray-500 uppercase">Syllabus Coverage</h3>
           </div>
           <p className="text-3xl font-bold text-gray-900">
             {stats.overall.total > 0 ? Math.round((stats.overall.completed / stats.overall.total) * 100) : 0}%
           </p>
           <p className="text-xs text-gray-500 mt-1">{stats.overall.completed} of {stats.overall.total} Topics Mastered</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Target size={20} /></div>
             <h3 className="text-sm font-bold text-gray-500 uppercase">Textbook Solving</h3>
           </div>
           <p className="text-3xl font-bold text-gray-900">
             {stats.overall.exercisesTotal > 0 ? Math.round((stats.overall.exercisesDone / stats.overall.exercisesTotal) * 100) : 0}%
           </p>
           <p className="text-xs text-gray-500 mt-1">{stats.overall.exercisesDone} Questions Solved</p>
        </div>

        {/* Combined Insight Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-md md:col-span-2 text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Lightbulb className="text-yellow-300" /> Smart Insight
                    </h3>
                    <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
                        We are now combining your <strong>Manual Textbook Progress</strong> with your <strong>Online Quiz Accuracy</strong>. 
                        Check the table below to see if your practice volume matches your conceptual understanding.
                    </p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <PieChart size={32} className="text-white" />
                </div>
            </div>
        </div>
      </div>

      {/* Subject Proficiency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(Subject).map(subject => {
            const subjStats = stats.subjects[subject];
            const isSelected = selectedSubject === subject;
            return (
                <div 
                    key={subject} 
                    onClick={() => setSelectedSubject(isSelected ? 'All' : subject)}
                    className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer transition-all duration-200 ${
                        isSelected ? 'border-bt-blue ring-2 ring-bt-blue/20 transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-bold ${isSelected ? 'text-bt-blue' : 'text-gray-800'}`}>{subject}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(subjStats.score)}`}>
                            {subjStats.score}% Volume
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Topic Completion</span>
                                <span>{subjStats.completed}/{subjStats.total}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                    className="bg-gray-800 h-1.5 rounded-full" 
                                    style={{ width: `${subjStats.total > 0 ? (subjStats.completed/subjStats.total)*100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-20 z-10">
          <div className="flex items-center gap-2">
              <Filter className="text-gray-500 w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">Filter Analysis:</span>
          </div>
          <div className="flex gap-2">
            {(['All', Subject.PHYSICS, Subject.CHEMISTRY, Subject.MATHS] as const).map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSubject === subj 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
          
          {/* Detailed Holistic Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen size={18} /> Holistic Performance Review
                  </h3>
                  <span className="text-xs text-gray-500 hidden sm:inline">Combines Textbook Data (User Input) + Quiz Data (Online)</span>
              </div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chapter</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Textbook Vol.</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Quiz Accuracy</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">AI Suggestion</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {filteredHolisticTopics.length === 0 ? (
                               <tr>
                                   <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                       No topics found for this subject.
                                   </td>
                               </tr>
                          ) : (
                            filteredHolisticTopics
                              .sort((a, b) => a.textbookScore - b.textbookScore) // Sort by lowest volume
                              .map((topic) => (
                                  <tr key={topic.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {topic.name}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {topic.subject}
                                      </td>
                                      
                                      {/* Textbook Score Column */}
                                      <td className="px-6 py-4 whitespace-nowrap text-center">
                                          <div className="flex flex-col items-center gap-1">
                                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                  <div 
                                                      className={`h-1.5 rounded-full ${getProgressBarColor(topic.textbookScore)}`} 
                                                      style={{ width: `${topic.textbookScore}%` }}
                                                  ></div>
                                              </div>
                                              <span className="text-xs text-gray-600">{topic.textbookScore}% Solved</span>
                                          </div>
                                      </td>

                                      {/* Quiz Score Column */}
                                      <td className="px-6 py-4 whitespace-nowrap text-center">
                                          {topic.quizScore === -1 ? (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-400">
                                                  No Data
                                              </span>
                                          ) : (
                                              <div className="flex flex-col items-center gap-1">
                                                  <span className={`text-sm font-bold ${
                                                      topic.quizScore > 75 ? 'text-green-600' : 
                                                      topic.quizScore < 50 ? 'text-red-600' : 'text-yellow-600'
                                                  }`}>
                                                      {topic.quizScore}%
                                                  </span>
                                                  <span className="text-[10px] text-gray-400">Correct</span>
                                              </div>
                                          )}
                                      </td>

                                      {/* Suggestion Column */}
                                      <td className="px-6 py-4 text-sm text-gray-700">
                                          {topic.suggestion.includes('Conceptual gaps') ? (
                                              <span className="flex items-center gap-1.5 text-red-700 font-medium">
                                                  <AlertTriangle size={14} /> {topic.suggestion}
                                              </span>
                                          ) : topic.suggestion.includes('Mastered') ? (
                                              <span className="flex items-center gap-1.5 text-green-700 font-medium">
                                                  <CheckCircle2 size={14} /> {topic.suggestion}
                                              </span>
                                          ) : (
                                              <span>{topic.suggestion}</span>
                                          )}
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};
