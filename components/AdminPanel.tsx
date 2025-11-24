
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';
import { User, TopicProgress, Status, Notice, MotivationItem } from '../types';
import { SYLLABUS_DATA, INITIAL_PROGRESS } from '../constants';
import { Trash2, Eye, ShieldCheck, GraduationCap, X, Search, Lock, Megaphone, Quote, Plus, Layout } from 'lucide-react';

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');
    
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

    useEffect(() => {
        // Load data based on tab
        if (activeTab === 'users') {
            setUsers(authService.getUsers());
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

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.coachingInstitute || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Admin Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShieldCheck className="text-green-400" /> Admin Console
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Manage platform, users, and content.</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                                activeTab === 'users' ? 'bg-bt-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <Layout size={16} /> Users
                        </button>
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                                activeTab === 'content' ? 'bg-bt-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <Megaphone size={16} /> Content
                        </button>
                    </div>
                </div>
            </div>

            {/* --- USERS TAB --- */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6 animate-in fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Registered Users</h3>
                        <div className="relative w-64">
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
