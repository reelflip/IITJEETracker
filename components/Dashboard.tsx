
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
import { AboutUs } from './AboutUs';
import { BlogPage } from './BlogPage';
import { LayoutDashboard, Table2, BrainCircuit, Search, Menu, X, BookCheck, LogOut, UserCircle, CalendarClock, ShieldCheck, BarChart2, FileText, Baby, Link as LinkIcon, Timer, Save, CheckCircle, Info, BookOpen } from 'lucide-react';
import { authService } from '../services/authService';
import { Logo } from './Logo'; // Import Logo

interface DashboardProps {
  userId: string; 
  userName: string; 
  userCoaching?: string;
  userTargetYear?: string;
  userRole?: 'admin' | 'student' | 'parent'; 
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId, userName, userCoaching = "Bakliwal Tutorials", userTargetYear = "IIT JEE 2025", userRole = 'student', onLogout }) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'analytics' | 'ai' | 'practice' | 'exams' | 'timetable' | 'profile' | 'admin' | 'about' | 'blogs'>(
    userRole === 'admin' ? 'admin' : (userRole === 'parent' ? 'profile' : 'syllabus')
  );

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentUser, setStudentUser] = useState<User | null>(null);
  const [pendingRequestFrom, setPendingRequestFrom] = useState<User | null>(null);

  const [progressKey, setProgressKey] = useState(`bt-jee-tracker-progress-${userId}`);
  const [practiceKey, setPracticeKey] = useState(`bt-jee-tracker-practice-${userId}`);
  const [timetableKey, setTimetableKey] = useState(`bt-jee-tracker-timetable-${userId}`);
  
  // Refresh logic to handle connection updates
  const refreshSession = () => {
    const session = authService.getSession();
    if (session) {
        setCurrentUser(session);
        // If Parent, check for linked student
        if (session.role === 'parent' && session.linkedUserId) {
            const linkedStudent = authService.getLinkedUser(session.id);
            if (linkedStudent) {
                setStudentUser(linkedStudent);
                // SWITCH DATA SOURCE TO STUDENT
                setProgressKey(`bt-jee-tracker-progress-${linkedStudent.email}`);
                setPracticeKey(`bt-jee-tracker-practice-${linkedStudent.email}`);
                setTimetableKey(`bt-jee-tracker-timetable-${linkedStudent.email}`);
            }
        } 
        // If Student, check for incoming requests
        else if (session.role === 'student') {
            if (session.connectionRequestFrom) {
                const requestingParent = authService.getUsers().find(u => u.id === session.connectionRequestFrom);
                if (requestingParent) setPendingRequestFrom(requestingParent);
            } else {
                setPendingRequestFrom(null);
            }
        }
    }
  };

  useEffect(() => {
    refreshSession();
  }, [userId, activeTab]); 

  // --- Textbook Progress State ---
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration logic...
        const migrated: Record<string, TopicProgress> = {};
        Object.keys(parsed).forEach(key => {
           const item = parsed[key];
           if (!item.exercises) {
              migrated[key] = {
                ...item,
                exercises: INITIAL_PROGRESS[key]?.exercises || [
                  { completed: 0, total: 60 }, { completed: 0, total: 50 }, { completed: 0, total: 40 }, { completed: 0, total: 20 }
                ]
              };
           } else {
             migrated[key] = item;
           }
        });
        setProgress({ ...INITIAL_PROGRESS, ...migrated });
      } else {
          // If no data found for student, use initial
          setProgress(INITIAL_PROGRESS);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
      setProgress(INITIAL_PROGRESS);
    }
  }, [progressKey]); // Reload when key changes

  // --- Online Practice Stats State ---
  const [practiceStats, setPracticeStats] = useState<Record<string, TopicPracticeStats>>({});

  useEffect(() => {
      try {
        const saved = localStorage.getItem(practiceKey);
        setPracticeStats(saved ? JSON.parse(saved) : {});
      } catch {
        setPracticeStats({});
      }
  }, [practiceKey]);

  // --- Timetable State ---
  const [savedTimetable, setSavedTimetable] = useState<WeeklySchedule | null>(null);
  
  useEffect(() => {
    try {
        const saved = localStorage.getItem(timetableKey);
        setSavedTimetable(saved ? JSON.parse(saved) : null);
    } catch {
        setSavedTimetable(null);
    }
  }, [timetableKey]);

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
  const coachingInitials = displayCoaching
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // --- Countdown Logic ---
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
      if (diffDays > 60) {
          const months = Math.floor(diffDays / 30);
          const days = diffDays % 30;
          return { label: "Time Remaining", value: `${months} Mo ${days} Days`, color: "text-indigo-600" };
      }
      return { label: "Crunch Time", value: `${diffDays} Days Left`, color: "text-red-600" };
  }, [displayTargetYear]);

  // Save changes ONLY if role is student (Auto-save backup)
  useEffect(() => {
    if (userRole === 'student') {
        localStorage.setItem(progressKey, JSON.stringify(progress));
        localStorage.setItem(practiceKey, JSON.stringify(practiceStats));
    }
  }, [progress, practiceStats, progressKey, practiceKey, userRole]);

  const handleProgressUpdate = (id: string, updates: Partial<TopicProgress>) => {
    if (userRole === 'parent') return;
    
    setProgress(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
    
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleManualSave = () => {
      setSaveStatus('saving');
      localStorage.setItem(progressKey, JSON.stringify(progress));
      setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
  };

  const handlePracticeUpdate = (topicName: string, isCorrect: boolean) => {
    if (userRole === 'parent') return;

    const topic = SYLLABUS_DATA.find(t => t.name === topicName);
    if (!topic) return;

    setPracticeStats(prev => {
      const current = prev[topic.id] || { topicId: topic.id, attempts: 0, correct: 0 };
      return {
        ...prev,
        [topic.id]: {
          ...current,
          attempts: current.attempts + 1,
          correct: current.correct + (isCorrect ? 1 : 0)
        }
      };
    });
  };

  const handleTimetableSave = (schedule: WeeklySchedule | null) => {
      if (userRole === 'parent') return;
      
      setSavedTimetable(schedule);
      if (schedule) {
          localStorage.setItem(timetableKey, JSON.stringify(schedule));
      } else {
          localStorage.removeItem(timetableKey);
      }
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
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(userRole === 'admin' ? 'admin' : (userRole === 'parent' ? 'profile' : 'syllabus'))}>
              <Logo variant="compact" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-l pl-2 border-gray-300 hidden sm:block">
                  {userRole === 'admin' ? 'Admin Console' : (userRole === 'parent' ? 'Parent View' : 'Student Dashboard')}
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              
              {userRole === 'admin' ? (
                 <button 
                    onClick={() => setActiveTab('admin')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'admin' ? 'bg-gray-900 text-white shadow-md transform scale-105' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                 >
                    <ShieldCheck size={18} />
                    Admin Panel
                 </button>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab('syllabus')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'syllabus' ? 'bg-blue-50 text-bt-blue font-bold shadow-sm ring-1 ring-blue-100 transform scale-105' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'}`}
                  >
                    <Table2 size={18} />
                    Syllabus
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-100 transform scale-105' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'}`}
                  >
                    <BarChart2 size={18} />
                    Analytics
                  </button>
                  
                  {/* Hide interactive tabs for parents */}
                  {userRole !== 'parent' && (
                      <>
                        <button 
                            onClick={() => setActiveTab('practice')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'practice' ? 'bg-teal-50 text-teal-700 font-bold shadow-sm ring-1 ring-teal-100 transform scale-105' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'}`}
                        >
                            <BookCheck size={18} />
                            Practice
                        </button>
                        <button 
                            onClick={() => setActiveTab('exams')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'exams' ? 'bg-red-50 text-red-700 font-bold shadow-sm ring-1 ring-red-100 transform scale-105' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'}`}
                        >
                            <FileText size={18} />
                            Mock Exams
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'ai' ? 'bg-purple-50 text-purple-700 font-bold shadow-sm ring-1 ring-purple-100 transform scale-105' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'}`}
                        >
                            <BrainCircuit size={18} />
                            Planner
                        </button>
                      </>
                  )}
                  
                  <button 
                    onClick={() => setActiveTab('timetable')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === 'timetable' ? 'bg-orange-50 text-orange-700 font-bold shadow-sm ring-1 ring-orange-100 transform scale-105' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'}`}
                  >
                    <CalendarClock size={18} />
                    Timetable
                  </button>
                </>
              )}

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('blogs')}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'blogs' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <BookOpen size={16} />
                  Blogs
                </button>
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'about' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Info size={16} />
                  About
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                    activeTab === 'profile' ? 'bg-bt-blue text-white shadow-sm' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <UserCircle size={16} />
                  {userName}
                </button>
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
                <button onClick={() => { setActiveTab('syllabus'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2">Syllabus</button>
                <button onClick={() => { setActiveTab('blogs'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2">Blogs</button>
                <button onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2">About Us</button>
                <button onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2">Profile</button>
                <button onClick={onLogout} className="block w-full text-left px-3 py-2 text-red-600">Logout</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {activeTab === 'admin' && userRole === 'admin' ? (
            <AdminPanel />
        ) : activeTab === 'about' ? (
            <AboutUs />
        ) : activeTab === 'blogs' ? (
            <BlogPage />
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
                {/* Insert Notice Board Here for Students/Parents */}
                {userRole !== 'admin' && <NoticeBoard />}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 flex items-center justify-between relative overflow-hidden">
                        <div className="z-10">
                            <h3 className="text-gray-800 font-semibold mb-2">
                                {userRole === 'parent' ? `Student Overview: ${studentUser?.name}` : `Welcome Back, ${userName}!`}
                            </h3>
                            <p className="text-gray-600 text-sm max-w-md">
                            {userRole === 'parent' 
                                ? `${studentUser?.name} has completed ${completedTopics} out of ${totalTopics} major topics.`
                                : `Consistent effort is the key to cracking JEE with excellence. You have completed ${completedTopics} out of ${totalTopics} major topics.`
                            }
                            </p>
                        </div>
                        {examCountdown && (
                            <div className="hidden md:flex flex-col items-end z-10 bg-slate-50 px-4 py-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-1 text-gray-400 mb-1">
                                    <Timer size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{examCountdown.label}</span>
                                </div>
                                <span className={`text-2xl font-bold ${examCountdown.color}`}>{examCountdown.value}</span>
                                <span className="text-[10px] text-gray-400 font-medium">Target: {displayTargetYear}</span>
                            </div>
                        )}
                        {/* Background decoration */}
                        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent -z-0"></div>
                    </div>

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
                </div>

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
                  <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0">
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
                    
                    {/* MANUAL SAVE BUTTON FOR STUDENTS */}
                    {userRole === 'student' && (
                        <>
                            <div className="w-px h-6 bg-gray-300 mx-2 hidden md:block"></div>
                            <button 
                                onClick={handleManualSave}
                                disabled={saveStatus !== 'idle'}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm ${
                                    saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-bt-blue text-white hover:bg-blue-700'
                                }`}
                            >
                                {saveStatus === 'saved' ? <CheckCircle size={18} /> : <Save size={18} />}
                                {saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                            </button>
                        </>
                    )}
                  </div>
                </div>

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
                                  exercises: [{ completed: 0, total: 60 }, { completed: 0, total: 50 }, { completed: 0, total: 40 }, { completed: 0, total: 20 }]
                                }}
                                onUpdate={handleProgressUpdate}
                                readOnly={userRole === 'parent'} // Parents cannot edit
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        ) : activeTab === 'analytics' ? (
           userRole === 'parent' && !studentUser ? (
             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center mt-8">
                 <LinkIcon className="mx-auto text-yellow-500 mb-3" size={48} />
                 <h3 className="text-xl font-bold text-gray-800">Connection Required</h3>
                 <p className="text-gray-600 mb-6">Connect to a student account to view performance analytics.</p>
                 <button onClick={() => setActiveTab('profile')} className="bg-bt-blue text-white px-6 py-2 rounded-lg font-bold">Go to Profile</button>
             </div>
           ) : (
             <PerformanceAnalytics progress={progress} practiceStats={practiceStats} />
           )
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

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} JEE PrepTracker. Tailored for your Success.</p>
        </div>
      </footer>
    </div>
  );
};
