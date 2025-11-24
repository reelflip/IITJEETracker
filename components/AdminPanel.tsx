
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';
import { User, TopicProgress, Status, Notice, MotivationItem, Subject, ExamPaper, Question } from '../types';
import { SYLLABUS_DATA, INITIAL_PROGRESS, MOCK_QUESTION_DB } from '../constants';
import { Trash2, Eye, ShieldCheck, GraduationCap, X, Search, Lock, Megaphone, Quote, Plus, Layout, Mail, Send, Users, FileText, CheckSquare } from 'lucide-react';

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'content' | 'communication' | 'tests'>('users');
    
    // --- USER MGMT STATE ---
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userStats, setUserStats] = useState<any>(null);

    // --- CONTENT MGMT STATE ---
    const [notices, setNotices] = useState<Notice[]>([]);
    const [motivations, setMotivations] = useState<MotivationItem[]>([]);
    
    const [newNoticeTitle, setNewNoticeTitle] = useState('');
    const [newNoticeContent, setNewNoticeContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);

    const [newQuote, setNewQuote] = useState('');
    const [newAuthor, setNewAuthor] = useState('');

    // --- TEST SERIES STATE ---
    const [customExams, setCustomExams] = useState<ExamPaper[]>([]);
    const [examTitle, setExamTitle] = useState('');
    const [examDuration, setExamDuration] = useState(180);
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
    const [questionSubjectFilter, setQuestionSubjectFilter] = useState<Subject>(Subject.PHYSICS);

    // --- COMMUNICATION STATE ---
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        // Load data based on tab
        if (activeTab === 'users' || activeTab === 'communication') {
            setUsers(authService.getUsers());
        } else if (activeTab === 'tests') {
            setCustomExams(contentService.getCustomExams());
        } else {
            setNotices(contentService.getNotices());
            setMotivations(contentService.getMotivation());
        }
    }, [activeTab]);

    // --- USER HANDLERS ---
    const handleDeleteUser = (email: string, name: string, role: string) => {
        if (role === 'admin') {
            alert("Cannot delete an Administrator account.");
            return;
        }
        if(confirm(`Are you sure you want to delete student ${name}? This action cannot be undone.`)) {
            authService.deleteUser(email);
            setUsers(users.filter(u => u.email !== email));
        }
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        const storageKey = `bt-jee-tracker-progress-${user.email}`;
        let progress = INITIAL_PROGRESS;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) progress = JSON.parse(saved);
        } catch (e) { console.error(e); }
        
        const total = SYLLABUS_DATA.length;
        const progressValues = Object.values(progress) as TopicProgress[];
        const completed = progressValues.filter(p => p.status === Status.COMPLETED || p.status === Status.REVISED).length;
        const inProgress = progressValues.filter(p => p.status === Status.IN_PROGRESS).length;
        
        setUserStats({
            completed, inProgress, total,
            percentage: total > 0 ? Math.round((completed/total)*100) : 0,
            lastActive: inProgress > 0 ? 'Recently' : 'Inactive'
        });
    };

    // --- CONTENT HANDLERS ---
    const handleAddNotice = (e: React.FormEvent) => {
        e.preventDefault();
        const added = contentService.addNotice({
            title: newNoticeTitle,
            content: newNoticeContent,
            isImportant
        });
        setNotices([added, ...notices]);
        setNewNoticeTitle('');
        setNewNoticeContent('');
        setIsImportant(false);
    };

    const handleDeleteNotice = (id: string) => {
        if(confirm("Delete this notice?")) {
            contentService.deleteNotice(id);
            setNotices(notices.filter(n => n.id !== id));
        }
    };

    const handleAddMotivation = (e: React.FormEvent) => {
        e.preventDefault();
        const added = contentService.addMotivation({
            type: 'quote',
            content: newQuote,
            author: newAuthor
        });
        setMotivations([...motivations, added]);
        setNewQuote('');
        setNewAuthor('');
    };

    const handleDeleteMotivation = (id: string) => {
        if(confirm("Delete this item?")) {
            contentService.deleteMotivation(id);
            setMotivations(motivations.filter(m => m.id !== id));
        }
    };

    // --- TEST SERIES HANDLERS ---
    const handleAddQuestionToExam = (q: Question) => {
        const newQ = { ...q, id: `custom-${Date.now()}-${Math.random()}` }; // Unique ID for exam context
        setSelectedQuestions([...selectedQuestions, newQ]);
    };

    const handleRemoveQuestionFromExam = (idx: number) => {
        const newList = [...selectedQuestions];
        newList.splice(idx, 1);
        setSelectedQuestions(newList);
    };

    const handleCreateExam = () => {
        if (!examTitle) {
            alert("Please enter an exam title.");
            return;
        }
        if (selectedQuestions.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        // Group questions by subject
        const sections = [
            { subject: Subject.PHYSICS, questions: selectedQuestions.filter(q => q.subject === Subject.PHYSICS) },
            { subject: Subject.CHEMISTRY, questions: selectedQuestions.filter(q => q.subject === Subject.CHEMISTRY) },
            { subject: Subject.MATHS, questions: selectedQuestions.filter(q => q.subject === Subject.MATHS) },
        ].filter(s => s.questions.length > 0);

        const newExam: ExamPaper = {
            id: `custom-exam-${Date.now()}`,
            title: examTitle,
            year: new Date().getFullYear().toString(),
            type: 'Mains', // Defaulting to Mains style for simplicity
            durationMinutes: examDuration,
            totalMarks: selectedQuestions.length * 4,
            sections
        };

        contentService.addCustomExam(newExam);
        setCustomExams([...customExams, newExam]);
        
        // Reset Form
        setExamTitle('');
        setSelectedQuestions([]);
        alert("Test created successfully! Students can now see it in Mock Exams.");
    };

    const handleDeleteExam = (id: string) => {
        if (confirm("Are you sure? This will remove the test for all students.")) {
            contentService.deleteCustomExam(id);
            setCustomExams(customExams.filter(e => e.id !== id));
        }
    };

    // --- COMMUNICATION HANDLERS ---
    const handleSendBroadcast = (e: React.FormEvent) => {
        e.preventDefault();
        if(!emailSubject || !emailBody) return;
        
        setSendingEmail(true);
        const recipients = users.filter(u => u.role !== 'admin');
        
        // Simulate delay and API call
        setTimeout(() => {
            alert(`📢 Broadcast Sent Successfully!\n\nTo: ${recipients.length} registered users\nSubject: ${emailSubject}\n\n(This is a simulated email service)`);
            setSendingEmail(false);
            setEmailSubject('');
            setEmailBody('');
        }, 1500);
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.coachingInstitute || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Admin Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-900 p-6 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShieldCheck className="text-green-400" /> Admin Console
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Manage platform, users, and communication.</p>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
                                activeTab === 'users' ? 'bg-bt-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <Layout size={16} /> Users
                        </button>
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
                                activeTab === 'content' ? 'bg-bt-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <Megaphone size={16} /> Content
                        </button>
                        <button 
                            onClick={() => setActiveTab('tests')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
                                activeTab === 'tests' ? 'bg-bt-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <FileText size={16} /> Test Series
                        </button>
                        <button 
                            onClick={() => setActiveTab('communication')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
                                activeTab === 'communication' ? 'bg-bt-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <Mail size={16} /> Communication
                        </button>
                    </div>
                </div>
            </div>

            {/* --- USERS TAB --- */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6 animate-in fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-lg font-bold text-gray-800">Registered Users</h3>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Institute</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role==='admin'?'bg-gray-800':'bg-bt-blue'}`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                                                user.role === 'admin' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.coachingInstitute || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.role === 'student' ? (
                                                <>
                                                    <button onClick={() => handleViewUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Eye size={16}/></button>
                                                    <button onClick={() => handleDeleteUser(user.email, user.name, user.role)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                                </>
                                            ) : <span className="text-gray-400 text-xs"><Lock size={12} className="inline"/> Protected</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- CONTENT TAB --- */}
            {activeTab === 'content' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
                    
                    {/* Notice Board Manager */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Megaphone className="text-orange-500" /> Notice Board
                        </h3>
                        
                        <form onSubmit={handleAddNotice} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-3">
                            <input 
                                type="text" 
                                placeholder="Notice Title" 
                                required
                                value={newNoticeTitle}
                                onChange={e => setNewNoticeTitle(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-bt-blue"
                            />
                            <textarea 
                                placeholder="Details..." 
                                required
                                rows={2}
                                value={newNoticeContent}
                                onChange={e => setNewNoticeContent(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-bt-blue"
                            />
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={isImportant} onChange={e => setIsImportant(e.target.checked)} />
                                    Mark as Important
                                </label>
                                <button type="submit" className="bg-bt-blue text-white px-4 py-1.5 rounded text-sm font-bold flex items-center gap-1">
                                    <Plus size={14} /> Add Notice
                                </button>
                            </div>
                        </form>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {notices.map(notice => (
                                <div key={notice.id} className="p-3 border rounded bg-white flex justify-between items-start group">
                                    <div>
                                        <p className={`font-bold text-sm ${notice.isImportant ? 'text-red-600' : 'text-gray-800'}`}>
                                            {notice.title}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-2">{notice.content}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{notice.date}</p>
                                    </div>
                                    <button onClick={() => handleDeleteNotice(notice.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Motivation Manager */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Quote className="text-purple-500" /> Daily Motivation
                        </h3>

                        <form onSubmit={handleAddMotivation} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-3">
                            <textarea 
                                placeholder="Enter Quote Text..." 
                                required
                                rows={2}
                                value={newQuote}
                                onChange={e => setNewQuote(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-bt-blue"
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Author Name" 
                                    value={newAuthor}
                                    onChange={e => setNewAuthor(e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:border-bt-blue"
                                />
                                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-bold flex items-center gap-1">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                        </form>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {motivations.map(mot => (
                                <div key={mot.id} className="p-3 border rounded bg-white flex justify-between items-center group">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 italic">"{mot.content}"</p>
                                        <p className="text-xs text-purple-600 font-bold mt-1">- {mot.author || 'Unknown'}</p>
                                    </div>
                                    <button onClick={() => handleDeleteMotivation(mot.id)} className="text-gray-400 hover:text-red-500 ml-2">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}

            {/* --- TEST SERIES TAB --- */}
            {activeTab === 'tests' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in">
                    {/* Creator Panel */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="text-bt-blue" /> Create New Mock Test
                        </h3>
                        
                        <div className="space-y-4 mb-6">
                            <input 
                                type="text" 
                                placeholder="Test Title (e.g., Major Test 4 - Physics)" 
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-bt-blue"
                                value={examTitle}
                                onChange={e => setExamTitle(e.target.value)}
                            />
                            <div className="flex gap-4 items-center">
                                <label className="text-sm text-gray-600">Duration (mins):</label>
                                <input 
                                    type="number" 
                                    value={examDuration}
                                    onChange={e => setExamDuration(parseInt(e.target.value) || 0)}
                                    className="w-24 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-bt-blue"
                                />
                            </div>
                        </div>

                        {/* Question Picker */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-700">Add Questions from Bank</h4>
                                <select 
                                    className="text-xs border rounded p-1"
                                    value={questionSubjectFilter}
                                    onChange={e => setQuestionSubjectFilter(e.target.value as Subject)}
                                >
                                    {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            
                            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                                {(MOCK_QUESTION_DB[questionSubjectFilter] || []).map((q, idx) => {
                                    // Cast q to Question to ensure type safety if needed, though structure matches
                                    const fullQ = { ...q, subject: questionSubjectFilter } as Question;
                                    return (
                                        <div key={idx} className="bg-white p-3 rounded border text-sm flex gap-3 hover:shadow-sm cursor-pointer group" onClick={() => handleAddQuestionToExam(fullQ)}>
                                            <Plus size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="line-clamp-2 text-gray-800">{q.questionText}</p>
                                                <p className="text-xs text-gray-400 mt-1">Correct: {q.correctAnswer}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Questions Preview */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Selected Questions ({selectedQuestions.length})</h4>
                            {selectedQuestions.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">No questions added yet.</p>
                            ) : (
                                <div className="space-y-2 max-h-40 overflow-y-auto bg-blue-50 p-2 rounded border border-blue-100">
                                    {selectedQuestions.map((q, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs text-blue-900 bg-white p-2 rounded border border-blue-200">
                                            <span className="truncate flex-1">{idx + 1}. {q.questionText}</span>
                                            <button onClick={() => handleRemoveQuestionFromExam(idx)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleCreateExam}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <CheckSquare size={18} /> Publish Test Series
                        </button>
                    </div>

                    {/* Existing Exams List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Active Custom Tests</h3>
                        {customExams.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">No custom tests created.</p>
                        ) : (
                            customExams.map(exam => (
                                <div key={exam.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{exam.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{exam.totalMarks} Marks • {exam.durationMinutes} Mins</p>
                                            <div className="flex gap-1 mt-2">
                                                {exam.sections.map(s => (
                                                    <span key={s.subject} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s.subject}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteExam(exam.id)} className="text-red-400 hover:text-red-600 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* --- COMMUNICATION TAB --- */}
            {activeTab === 'communication' && (
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow border border-gray-200 p-8 animate-in fade-in">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Email Broadcast</h3>
                            <p className="text-sm text-gray-500">Send announcements to all registered students and parents.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSendBroadcast} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                            <input 
                                type="text" 
                                value={emailSubject}
                                onChange={e => setEmailSubject(e.target.value)}
                                placeholder="e.g., Important Exam Schedule Update"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                            <textarea 
                                value={emailBody}
                                onChange={e => setEmailBody(e.target.value)}
                                rows={6}
                                placeholder="Type your message here..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none resize-none"
                                required
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 text-sm text-blue-800">
                            <Users size={16} />
                            <span>This email will be sent to <strong>{users.filter(u => u.role !== 'admin').length}</strong> registered users.</span>
                        </div>

                        <button 
                            type="submit" 
                            disabled={sendingEmail}
                            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {sendingEmail ? 'Sending...' : <><Send size={18} /> Send Broadcast</>}
                        </button>
                    </form>
                </div>
            )}

            {/* Student Details Modal (Reused) */}
            {selectedUser && userStats && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                        <div className="bg-bt-blue p-6 text-white flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <GraduationCap /> {selectedUser.name}
                                </h3>
                                <p className="text-blue-100 text-sm mt-1">{selectedUser.email}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 text-center">
                                    <p className="text-gray-500 text-xs font-bold uppercase">Completion</p>
                                    <p className="text-3xl font-bold text-bt-blue mt-1">{userStats.percentage}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                                        <div className="bg-bt-blue h-1.5 rounded-full" style={{ width: `${userStats.percentage}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                    <p className="text-green-600 text-xs font-bold uppercase">Topics Done</p>
                                    <p className="text-2xl font-bold text-green-700 mt-1">{userStats.completed}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
