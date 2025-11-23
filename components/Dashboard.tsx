import React, { useState, useEffect } from 'react';
import { SYLLABUS_DATA, INITIAL_PROGRESS } from '../constants';
import { TopicProgress, Subject, Status } from '../types';
import { TopicRow } from './TopicRow';
import { AIPlanner } from './AIPlanner';
import { QuestionBank } from './QuestionBank';
import { TimetableGenerator } from './TimetableGenerator';
import { LayoutDashboard, Table2, BrainCircuit, Search, Menu, X, BookCheck, LogOut, UserCircle, CalendarClock } from 'lucide-react';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'ai' | 'practice' | 'timetable'>('syllabus');
  const [progress, setProgress] = useState<Record<string, TopicProgress>>(() => {
    // Load from user-specific local storage key
    const storageKey = `bt-jee-tracker-progress-${user}`;
    try {
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        // Data migration: ensure exercises structure exists
        const migrated: Record<string, TopicProgress> = {};
        Object.keys(parsed).forEach(key => {
           const item = parsed[key];
           if (!item.exercises) {
              migrated[key] = {
                ...item,
                exercises: INITIAL_PROGRESS[key]?.exercises || [
                  { completed: 0, total: 60 },
                  { completed: 0, total: 50 },
                  { completed: 0, total: 40 },
                  { completed: 0, total: 20 }
                ]
              };
           } else {
             migrated[key] = item;
           }
        });
        return { ...INITIAL_PROGRESS, ...migrated };
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
      // Fallback to initial state if data is corrupted
    }
    return INITIAL_PROGRESS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats calculation
  const totalTopics = SYLLABUS_DATA.length;
  const progressValues = Object.values(progress) as TopicProgress[];
  const completedTopics = progressValues.filter((p) => p.status === Status.COMPLETED || p.status === Status.REVISED).length;
  const completionPercentage = Math.round((completedTopics / totalTopics) * 100);

  // Persist to user-specific key
  useEffect(() => {
    localStorage.setItem(`bt-jee-tracker-progress-${user}`, JSON.stringify(progress));
  }, [progress, user]);

  const handleProgressUpdate = (id: string, updates: Partial<TopicProgress>) => {
    setProgress(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  const filteredTopics = SYLLABUS_DATA.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'All' || topic.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const groupedTopics: Record<number, typeof filteredTopics> = {};
  filteredTopics.forEach(topic => {
    if (!groupedTopics[topic.phase]) groupedTopics[topic.phase] = [];
    groupedTopics[topic.phase].push(topic);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-bt-blue rounded-lg flex items-center justify-center text-white font-bold">
                BT
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
                JEE PrepTracker
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <button 
                onClick={() => setActiveTab('syllabus')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === 'syllabus' ? 'bg-blue-50 text-bt-blue font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Table2 size={18} />
                Syllabus
              </button>
              <button 
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === 'practice' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <BookCheck size={18} />
                Practice
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === 'ai' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <BrainCircuit size={18} />
                Smart Planner
              </button>
              <button 
                onClick={() => setActiveTab('timetable')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === 'timetable' ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <CalendarClock size={18} />
                Timetable
              </button>

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                  <UserCircle size={16} />
                  {user}
                </div>
                <button 
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-md"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden gap-3">
               <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">{user}</span>
               <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
                 {mobileMenuOpen ? <X /> : <Menu />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => { setActiveTab('syllabus'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Syllabus Table
              </button>
              <button 
                onClick={() => { setActiveTab('practice'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Practice Bank
              </button>
              <button 
                onClick={() => { setActiveTab('ai'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Smart Planner
              </button>
              <button 
                onClick={() => { setActiveTab('timetable'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Timetable
              </button>
              <div className="border-t border-gray-100 my-2 pt-2">
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-600 font-medium"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Header Stats */}
        {activeTab === 'syllabus' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium text-sm">Overall Progress</h3>
                  <LayoutDashboard className="text-blue-500 w-5 h-5" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-gray-900">{completionPercentage}%</span>
                  <span className="text-sm text-gray-500 mb-1">completed</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                  <div 
                    className="bg-bt-blue h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }} 
                  />
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 flex flex-col justify-center">
                <h3 className="text-gray-800 font-semibold mb-2">Welcome Back, {user}!</h3>
                <p className="text-gray-600 text-sm">
                  Consistent effort is the key to cracking JEE. You have completed {completedTopics} out of {totalTopics} major topics. 
                  Keep pushing through your Phase tests!
                </p>
             </div>
          </div>
        )}

        {activeTab === 'syllabus' ? (
          <div className="space-y-6">
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-20 z-40">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {(['All', Subject.PHYSICS, Subject.CHEMISTRY, Subject.MATHS] as const).map(subj => (
                  <button
                    key={subj}
                    onClick={() => setFilterSubject(subj)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      filterSubject === subj 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic List */}
            <div className="space-y-8">
              {Object.keys(groupedTopics).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No topics found matching your filters.</p>
                </div>
              ) : (
                Object.keys(groupedTopics).sort().map((phaseStr) => {
                  const phase = Number(phaseStr);
                  return (
                    <div key={phase} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Phase {phase}</h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>
                      <div className="space-y-3">
                        {groupedTopics[phase].map(topic => (
                          <TopicRow 
                            key={topic.id}
                            topic={topic}
                            progress={progress[topic.id] || { 
                              topicId: topic.id, 
                              status: Status.NOT_STARTED, 
                              exercises: [
                                { completed: 0, total: 60 },
                                { completed: 0, total: 50 },
                                { completed: 0, total: 40 },
                                { completed: 0, total: 20 }
                              ]
                            }}
                            onUpdate={handleProgressUpdate}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : activeTab === 'practice' ? (
          <QuestionBank />
        ) : activeTab === 'ai' ? (
          <AIPlanner />
        ) : (
          <TimetableGenerator />
        )}

      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} JEE PrepTracker. Not officially affiliated with Bakliwal Tutorials.</p>
        </div>
      </footer>
    </div>
  );
};