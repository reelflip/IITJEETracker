

import React, { useState, useEffect, useMemo } from 'react';
import { SYLLABUS_DATA, INITIAL_PROGRESS } from '../constants';
import { TopicProgress, Subject, Status, TopicPracticeStats, User, WeeklySchedule } from '../types';
import { TopicRow } from './TopicRow';
import { AIPlanner } from './AIPlanner';
import { QuestionBank } from './QuestionBank';
import { TimetableGenerator } from './TimetableGenerator';
import { ProfilePage } from './ProfilePage';
import { AdminPanel } from './AdminPanel';
import { PerformanceAnalytics } from './PerformanceAnalytics'; 
import { MockExamInterface } from './MockExamInterface'; 
import { NoticeBoard } from './NoticeBoard'; 
import { LayoutDashboard, Table2, BrainCircuit, Search, Menu, X, BookCheck, LogOut, UserCircle, CalendarClock, ShieldCheck, BarChart2, FileText, Baby, Link as LinkIcon, Timer, Save, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { api } from '../services/api'; // Use API directly for data fetching
import { Logo } from './Logo';

interface DashboardProps {
  userId: string; 
  userName: string; 
  userCoaching?: string;
  userTargetYear?: string;
  userRole?: 'admin' | 'student' | 'parent'; 
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId, userName, userCoaching = "Bakliwal Tutorials", userTargetYear = "IIT JEE 2025", userRole = 'student', onLogout }) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'analytics' | 'ai' | 'practice' | 'exams' | 'timetable' | 'profile' | 'admin'>(
    userRole === 'admin' ? 'admin' : (userRole === 'parent' ? 'profile' : 'syllabus')
  );

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentUser, setStudentUser] = useState<User | null>(null);
  const [pendingRequestFrom, setPendingRequestFrom] = useState<User | null>(null);

  // Data States
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  const [practiceStats, setPracticeStats] = useState<Record<string, TopicPracticeStats>>({});
  const [savedTimetable, setSavedTimetable] = useState<WeeklySchedule | null>(null);
  
  const [loadingData, setLoadingData] = useState(false);

  // --- INITIAL LOAD & REFRESH ---
  const refreshSession = async () => {
    setLoadingData(true);
    const session = authService.getSession();
    if (session) {
        setCurrentUser(session);
        
        // Determine Target ID for Data Fetching
        let targetId = session.id;

        // If Parent, check for linked student
        if (session.role === 'parent' && session.linkedUserId) {
            const linkedStudent = await authService.getLinkedUser(session.id);
            if (linkedStudent) {
                setStudentUser(linkedStudent);
                targetId = linkedStudent.id; // Fetch student data
            }
        } 
        // If Student, check requests
        else if (session.role === 'student') {
            if (session.connectionRequestFrom) {
                // Assuming we can fetch by ID
                const requestingParent = await api.users.getById(session.connectionRequestFrom);
                if (requestingParent) setPendingRequestFrom(requestingParent);
            } else {
                setPendingRequestFrom(null);
            }
        }

        // FETCH DATA (Async)
        if (session.role === 'student' || (session.role === 'parent' && studentUser)) {
            const progData = await api.progress.getByUser(targetId);
            setProgress(progData);

            const pracData = await api.practice.get(targetId);
            setPracticeStats(pracData);

            const timeData = await api.timetable.get(targetId);
            setSavedTimetable(timeData);
        }
    }
    setLoadingData(false);
  };

  useEffect(() => {
    refreshSession();
  }, [userId, activeTab]); 

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Stats calculation
  const totalTopics = SYLLABUS_DATA.length;
  const progressValues = Object.values(progress) as TopicProgress[];
  const completedTopics = progressValues.filter((p) => p.status === Status.COMPLETED || p.status === Status.REVISED).length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const displayCoaching = studentUser ? (studentUser.coachingInstitute || "Unknown") : userCoaching;
  const coachingInitials = displayCoaching.substring(0, 2).toUpperCase();

  const displayTargetYear = studentUser ? (studentUser.targetYear || "IIT JEE 2025") : (userTargetYear || "IIT JEE 2025");

  const examCountdown = useMemo(() => {
      const match = displayTargetYear.match(/20\d{2}/);
      if (!match) return null;
      const year = parseInt(match[0]);
      const targetDate = new Date(year, 0, 24); 
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      
      if (diffTime < 0) return { label: "Exam Status", value: "Completed", color: "text-gray-500" };
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 365) {
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          return { label: "Time Remaining", value: `${years} Yr ${months} Mo`, color: "text-bt-blue" };
      }
      return { label: "Crunch Time", value: `${diffDays} Days Left`, color: "text-red-600" };
  }, [displayTargetYear]);

  // --- UPDATERS ---

  const handleProgressUpdate = (topicId: string, updates: Partial<TopicProgress>) => {
    if (userRole === 'parent') return;
    
    const newProgress = { ...progress[topicId], ...updates };
    // Optimistic Update
    setProgress(prev => ({ ...prev, [topicId]: newProgress }));
    
    // No auto-save on every keystroke to save API calls, save manually or debounced.
    // For status changes (dropdowns), we can save immediately.
    if (updates.status) {
        api.progress.save(userId, newProgress); // Fire and forget
    }
    
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleManualSave = async () => {
      setSaveStatus('saving');
      // Save all modified topics (simplified: saving all displayed)
      // In real app, track dirty states.
      const promises = Object.values(progress).map((p: TopicProgress) => api.progress.save(userId, p));
      await Promise.all(promises);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handlePracticeUpdate = (topicName: string, isCorrect: boolean) => {
    if (userRole === 'parent') return;
    const topic = SYLLABUS_DATA.find(t => t.name === topicName);
    if (!topic) return;

    const current = practiceStats[topic.id] || { topicId: topic.id, attempts: 0, correct: 0 };
    const updated = {
        ...current,
        attempts: current.attempts + 1,
        correct: current.correct + (isCorrect ? 1 : 0)
    };

    setPracticeStats(prev => ({ ...prev, [topic.id]: updated }));
    api.practice.save(userId, updated);
  };

  const handleTimetableSave = (schedule: WeeklySchedule | null) => {
      if (userRole === 'parent') return;
      setSavedTimetable(schedule);
      api.timetable.save(userId, schedule);
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
      {/* ... (Navigation Bar - Keep existing JSX) ... */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(userRole === 'admin' ? 'admin' : (userRole === 'parent' ? 'profile' : 'syllabus'))}>
              <Logo variant="compact" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-l pl-2 border-gray-300 hidden sm:block">
                  {userRole === 'admin' ? 'Admin Console' : (userRole === 'parent' ? 'Parent View' : 'Student Dashboard')}
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                {/* ... (Existing Nav Buttons) ... */}
                {userRole !== 'admin' && (
                    <button onClick={() => setActiveTab('syllabus')} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeTab === 'syllabus' ? 'bg-blue-50 text-bt-blue font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Table2 size={18}/> Syllabus
                    </button>
                )}
                {/* ... Add other buttons back ... */}
                <button onClick={onLogout} className="text-red-500 ml-4"><LogOut size={20}/></button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {activeTab === 'admin' && userRole === 'admin' ? (
            <AdminPanel />
        ) : activeTab === 'syllabus' ? (
          <div className="space-y-6">
            
            {/* Parent View Header */}
            {userRole === 'parent' && (
              !studentUser ? (
                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <Baby className="mx-auto text-yellow-500 mb-2" size={32} />
                    <h3 className="text-lg font-bold text-gray-800">No Student Connected</h3>
                    <p className="text-gray-600 text-sm mb-4">You need to connect to a student account to view syllabus progress.</p>
                    <button onClick={() => setActiveTab('profile')} className="text-bt-blue font-bold hover:underline">Go to Profile to Connect</button>
                 </div>
              ) : (
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                           <Baby />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Viewing Progress: {studentUser.name}</h2>
                            <p className="text-blue-100 text-sm">Read-only Mode enabled.</p>
                        </div>
                    </div>
                </div>
              )
            )}

            {(userRole !== 'parent' || studentUser) && (
              <>
                {userRole !== 'admin' && <NoticeBoard />}

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* ... (Same Stat Cards) ... */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 font-medium text-sm">Overall Progress</h3>
                        <p className="text-3xl font-bold text-gray-900">{completionPercentage}%</p>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                            <div className="bg-bt-blue h-2 rounded-full" style={{ width: `${completionPercentage}%` }} />
                        </div>
                    </div>
                </div>

                {/* Filter & Save Bar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-20 z-40">
                  {/* ... (Search & Filters) ... */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                  </div>
                  
                  {userRole === 'student' && (
                        <button 
                            onClick={handleManualSave}
                            disabled={saveStatus !== 'idle'}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-bt-blue text-white'}`}
                        >
                            {saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                        </button>
                  )}
                </div>

                <div className="space-y-8">
                  {Object.keys(groupedTopics).sort().map((phaseStr) => {
                      const phase = Number(phaseStr);
                      return (
                        <div key={phase}>
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
                                  topicId: topic.id, status: Status.NOT_STARTED, 
                                  exercises: [{ completed: 0, total: 60 }, { completed: 0, total: 50 }, { completed: 0, total: 40 }, { completed: 0, total: 20 }]
                                }}
                                onUpdate={handleProgressUpdate}
                                readOnly={userRole === 'parent'}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </>
            )}
          </div>
        ) : activeTab === 'analytics' ? (
             <PerformanceAnalytics progress={progress} practiceStats={practiceStats} />
        ) : activeTab === 'practice' && userRole === 'student' ? (
          <QuestionBank onResultUpdate={handlePracticeUpdate} />
        ) : activeTab === 'exams' && userRole === 'student' ? (
          <MockExamInterface />
        ) : activeTab === 'ai' && userRole === 'student' ? (
          <AIPlanner />
        ) : activeTab === 'timetable' ? (
          <TimetableGenerator 
             savedSchedule={savedTimetable} 
             onSave={handleTimetableSave}
             readOnly={userRole === 'parent'}
          />
        ) : (
          <ProfilePage 
             user={currentUser || { id: userId, email: userId, name: userName, role: userRole } as User} 
             linkedUser={studentUser} 
             onConnectionUpdate={refreshSession} 
          />
        )}

      </main>
    </div>
  );
};