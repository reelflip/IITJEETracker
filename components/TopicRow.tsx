
import React, { useState } from 'react';
import { Topic, TopicProgress, Status, Subject, ExerciseProgress } from '../types';
import { ChevronDown, ChevronUp, CheckCircle, Circle, BookOpen, PenTool } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TopicRowProps {
  topic: Topic;
  progress: TopicProgress;
  onUpdate: (id: string, updates: Partial<TopicProgress>) => void;
}

const statusColors = {
  [Status.NOT_STARTED]: 'bg-gray-100 text-gray-500 border-gray-200',
  [Status.IN_PROGRESS]: 'bg-blue-50 text-blue-600 border-blue-200',
  [Status.COMPLETED]: 'bg-green-50 text-green-600 border-green-200',
  [Status.REVISED]: 'bg-purple-50 text-purple-600 border-purple-200',
};

const subjectColors = {
  [Subject.PHYSICS]: 'text-purple-600 bg-purple-100',
  [Subject.CHEMISTRY]: 'text-teal-600 bg-teal-100',
  [Subject.MATHS]: 'text-orange-600 bg-orange-100',
};

export const TopicRow: React.FC<TopicRowProps> = ({ topic, progress, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'exercises' | 'theory'>('exercises');

  // Fallback if exercises array is malformed (e.g. from old local storage)
  const safeExercises = progress.exercises?.length === 4 
    ? progress.exercises 
    : [
        { completed: 0, total: 60 }, 
        { completed: 0, total: 50 },
        { completed: 0, total: 40 },
        { completed: 0, total: 20 }
      ];

  const totalQuestions = safeExercises.reduce((acc, curr) => acc + curr.total, 0);
  const totalCompleted = safeExercises.reduce((acc, curr) => acc + curr.completed, 0);
  const percentComplete = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;

  const handleExerciseUpdate = (index: number, field: 'completed' | 'total', value: number) => {
    const newExercises = [...safeExercises] as [ExerciseProgress, ExerciseProgress, ExerciseProgress, ExerciseProgress];
    
    // Validate inputs
    let cleanValue = Math.max(0, value);
    if (field === 'completed' && cleanValue > newExercises[index].total) {
      cleanValue = newExercises[index].total;
    }

    newExercises[index] = {
      ...newExercises[index],
      [field]: cleanValue
    };

    onUpdate(topic.id, { exercises: newExercises });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-all duration-200 overflow-hidden ${expanded ? 'ring-1 ring-bt-blue' : ''}`}>
      
      {/* Main Row Content */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Topic Info */}
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${subjectColors[topic.subject]}`}>
              {topic.subject}
            </span>
            <span className="text-xs text-gray-400 font-medium">Phase {topic.phase}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
            {topic.name}
            {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </h3>
          <div className="flex items-center gap-4 mt-1">
             <p className="text-xs text-gray-500">Est. {topic.estimatedHours} Hours</p>
             <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${percentComplete === 100 ? 'bg-green-500' : 'bg-bt-blue'}`} style={{ width: `${percentComplete}%` }}></div>
                </div>
                <span className="text-xs font-medium text-gray-600">{percentComplete}% Questions</span>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={progress.status}
            onChange={(e) => onUpdate(topic.id, { status: e.target.value as Status })}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border focus:ring-2 focus:ring-offset-1 focus:ring-bt-blue outline-none cursor-pointer ${statusColors[progress.status]}`}
          >
            {Object.values(Status).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button 
             onClick={() => setExpanded(!expanded)}
             className="text-sm font-medium text-bt-blue hover:text-blue-700 underline underline-offset-2"
          >
            {expanded ? 'Close' : 'Details'}
          </button>
        </div>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="bg-slate-50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
           {/* Tabs */}
           <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('exercises')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'exercises' 
                  ? 'bg-white text-bt-blue border-b-2 border-bt-blue' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                 <PenTool size={16} /> Exercises
              </button>
              <button 
                onClick={() => setActiveTab('theory')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'theory' 
                  ? 'bg-white text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                 <BookOpen size={16} /> Quick Theory
              </button>
           </div>

           {/* Tab Content */}
           <div className="p-4">
             {activeTab === 'exercises' ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Chapter Exercises</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {safeExercises.map((ex, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-gray-700">Exercise {idx + 1}</span>
                              {ex.completed >= ex.total && ex.total > 0 ? (
                                <CheckCircle size={14} className="text-green-500" />
                              ) : (
                                <Circle size={14} className="text-gray-300" />
                              )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Solved</label>
                                <input 
                                  type="number" 
                                  min={0}
                                  value={ex.completed}
                                  onChange={(e) => handleExerciseUpdate(idx, 'completed', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-bt-blue focus:border-bt-blue outline-none"
                                />
                            </div>
                            <span className="text-gray-400 mt-4">/</span>
                            <div className="flex-1">
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total</label>
                                <input 
                                  type="number" 
                                  min={1}
                                  value={ex.total}
                                  onChange={(e) => handleExerciseUpdate(idx, 'total', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-bt-blue focus:border-bt-blue outline-none"
                                />
                            </div>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="mt-2 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${ex.completed >= ex.total ? 'bg-green-500' : 'bg-bt-blue'}`} 
                                style={{ width: `${Math.min(100, (ex.completed / (ex.total || 1)) * 100)}%` }}
                              ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
             ) : (
               <div className="prose prose-sm prose-teal max-w-none bg-white p-4 rounded-lg border border-gray-200 shadow-inner">
                  {topic.theorySummary ? (
                    <>
                      <h4 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1">Key Concepts & Formulas</h4>
                      <ReactMarkdown>{topic.theorySummary}</ReactMarkdown>
                    </>
                  ) : (
                    <div className="text-center text-gray-400 py-4 italic">
                      No theory notes available for this topic yet.
                    </div>
                  )}
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};
