
import React, { useMemo } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { TopicProgress, Subject, Status, ExerciseProgress } from '../types';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Target, BookOpen } from 'lucide-react';

interface PerformanceAnalyticsProps {
  progress: Record<string, TopicProgress>;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ progress }) => {
  
  // --- Calculation Logic ---
  const stats = useMemo(() => {
    const data = {
      overall: { total: 0, completed: 0, exercisesTotal: 0, exercisesDone: 0 },
      subjects: {
        [Subject.PHYSICS]: { total: 0, completed: 0, score: 0, weakTopics: [] as string[] },
        [Subject.CHEMISTRY]: { total: 0, completed: 0, score: 0, weakTopics: [] as string[] },
        [Subject.MATHS]: { total: 0, completed: 0, score: 0, weakTopics: [] as string[] },
      },
      criticalTopics: [] as { name: string; subject: Subject; score: number; reason: string }[]
    };

    SYLLABUS_DATA.forEach(topic => {
      const p = progress[topic.id];
      // Explicitly cast to ExerciseProgress[] to ensure correct reduce type inference
      const exercises = (p?.exercises || []) as ExerciseProgress[];
      
      // Calculate Exercise Score for this topic
      const totalQ = exercises.reduce((acc, curr) => acc + (curr.total || 0), 0);
      const doneQ = exercises.reduce((acc, curr) => acc + (curr.completed || 0), 0);
      const topicScore = totalQ > 0 ? (doneQ / totalQ) * 100 : 0;

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
      // We aggregate raw completion percentage for subject score
      data.subjects[topic.subject].score += topicScore;

      // Identify Weak Areas
      // Criteria: Status is In Progress but Score < 30%, or Not Started in early phases
      if (p?.status === Status.IN_PROGRESS && topicScore < 30) {
        data.criticalTopics.push({
          name: topic.name,
          subject: topic.subject,
          score: Math.round(topicScore),
          reason: 'Low Practice Efficiency'
        });
      } else if (p?.status === Status.NOT_STARTED && topic.phase <= 3) {
        data.criticalTopics.push({
          name: topic.name,
          subject: topic.subject,
          score: 0,
          reason: 'Backlog (Early Phase)'
        });
      }
    });

    // Normalize Subject Scores
    Object.keys(data.subjects).forEach(key => {
        const k = key as Subject;
        if (data.subjects[k].total > 0) {
            data.subjects[k].score = Math.round(data.subjects[k].score / data.subjects[k].total);
        }
    });

    return data;
  }, [progress]);

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
             {Math.round((stats.overall.completed / stats.overall.total) * 100)}%
           </p>
           <p className="text-xs text-gray-500 mt-1">{stats.overall.completed} of {stats.overall.total} Topics Mastered</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Target size={20} /></div>
             <h3 className="text-sm font-bold text-gray-500 uppercase">Problem Solving</h3>
           </div>
           <p className="text-3xl font-bold text-gray-900">
             {stats.overall.exercisesTotal > 0 ? Math.round((stats.overall.exercisesDone / stats.overall.exercisesTotal) * 100) : 0}%
           </p>
           <p className="text-xs text-gray-500 mt-1">{stats.overall.exercisesDone} Questions Solved</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-xl shadow-md md:col-span-2 text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <AlertTriangle className="text-yellow-300" /> Attention Needed
                    </h3>
                    <p className="text-red-100 text-sm mt-1">
                        You have {stats.criticalTopics.length} critical topics that are dragging down your score. Focus on these to improve rapidly.
                    </p>
                </div>
                <div className="text-3xl font-bold opacity-20">
                    {stats.criticalTopics.length}
                </div>
            </div>
        </div>
      </div>

      {/* Subject Proficiency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(Subject).map(subject => {
            const subjStats = stats.subjects[subject];
            return (
                <div key={subject} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">{subject}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(subjStats.score)}`}>
                            {subjStats.score}% Proficiency
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
                                    style={{ width: `${(subjStats.completed/subjStats.total)*100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Exercise Efficiency</span>
                                <span>{subjStats.score}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full ${getProgressBarColor(subjStats.score)}`} 
                                    style={{ width: `${subjStats.score}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Critical Focus Areas List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
              <div className="bg-red-50 p-4 border-b border-red-100">
                  <h3 className="font-bold text-red-800 flex items-center gap-2">
                      <Target size={18} /> Critical Focus Areas
                  </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {stats.criticalTopics.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                          <CheckCircle2 className="mx-auto w-8 h-8 text-green-500 mb-2" />
                          <p>Great job! No critical weak areas detected.</p>
                      </div>
                  ) : (
                      stats.criticalTopics.map((item, idx) => (
                          <div key={idx} className="p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                      {item.subject.slice(0,3)}
                                  </span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-red-500 font-medium">{item.reason}</span>
                                  <div className="text-xs font-bold text-gray-700">{item.score}% Done</div>
                              </div>
                              <div className="w-full bg-gray-100 h-1 mt-2 rounded-full">
                                  <div className="bg-red-500 h-1 rounded-full" style={{ width: `${item.score}%` }}></div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* Detailed Chapter Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen size={18} /> Chapter-wise Performance
                  </h3>
                  <span className="text-xs text-gray-500">Sorted by lowest completion</span>
              </div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chapter</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Exercise Score</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {SYLLABUS_DATA.map(topic => {
                              const p = progress[topic.id];
                              const exercises = (p?.exercises || []) as ExerciseProgress[];
                              const total = exercises.reduce((acc, curr) => acc + (curr.total || 0), 0);
                              const done = exercises.reduce((acc, curr) => acc + (curr.completed || 0), 0);
                              const score = total > 0 ? Math.round((done / total) * 100) : 0;
                              
                              return { topic, status: p?.status, score };
                          })
                          .sort((a, b) => a.score - b.score) // Sort by lowest score
                          .map(({ topic, status, score }) => (
                              <tr key={topic.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {topic.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {topic.subject}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                          ${status === Status.COMPLETED ? 'bg-green-100 text-green-800' : 
                                            status === Status.IN_PROGRESS ? 'bg-blue-100 text-blue-800' : 
                                            'bg-gray-100 text-gray-800'}`}>
                                          {status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <div className="flex items-center justify-center gap-2">
                                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                              <div 
                                                  className={`h-1.5 rounded-full ${getProgressBarColor(score)}`} 
                                                  style={{ width: `${score}%` }}
                                              ></div>
                                          </div>
                                          <span className="text-xs font-bold text-gray-700 w-8">{score}%</span>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};
