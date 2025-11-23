
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User, TopicProgress, Status } from '../types';
import { SYLLABUS_DATA, INITIAL_PROGRESS } from '../constants';
import { Trash2, Eye, ShieldCheck, GraduationCap, X, Search, Lock } from 'lucide-react';

export const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userStats, setUserStats] = useState<any>(null);

    useEffect(() => {
        // Load all users (removed filter to show admins as well)
        setUsers(authService.getUsers());
    }, []);

    const handleDelete = (email: string, name: string, role: string) => {
        if (role === 'admin') {
            alert("Cannot delete an Administrator account.");
            return;
        }
        if(confirm(`Are you sure you want to delete student ${name}? This action cannot be undone.`)) {
            authService.deleteUser(email);
            setUsers(users.filter(u => u.email !== email));
        }
    };

    const handleView = (user: User) => {
        setSelectedUser(user);
        
        // Fetch progress from localStorage
        const storageKey = `bt-jee-tracker-progress-${user.email}`;
        let progress = INITIAL_PROGRESS;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                 progress = JSON.parse(saved);
            }
        } catch (e) {
            console.error("Error reading student progress", e);
        }
        
        // Calculate Stats
        const total = SYLLABUS_DATA.length;
        const progressValues = Object.values(progress) as TopicProgress[];
        const completed = progressValues.filter(p => p.status === Status.COMPLETED || p.status === Status.REVISED).length;
        const inProgress = progressValues.filter(p => p.status === Status.IN_PROGRESS).length;
        
        setUserStats({
            completed,
            inProgress,
            total,
            percentage: total > 0 ? Math.round((completed/total)*100) : 0,
            // Mock recent activity based on 'In Progress' count
            lastActive: inProgress > 0 ? 'Recently' : 'Inactive'
        });
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.coachingInstitute || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShieldCheck className="text-green-400" /> Admin Console
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Manage users and view performance metrics</p>
                    </div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                        <span className="text-2xl font-bold text-white">{users.length}</span>
                        <span className="text-xs text-gray-400 block uppercase tracking-wider">Total Users</span>
                    </div>
                </div>

                <div className="p-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or institute..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                        />
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Institute</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.role === 'admin' ? 'bg-amber-50/30' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                                                        user.role === 'admin' ? 'bg-gray-800' : 'bg-bt-blue'
                                                    }`}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                            {user.name}
                                                            {user.role === 'admin' && <ShieldCheck size={14} className="text-amber-600" />}
                                                        </div>
                                                        <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.role === 'admin' ? (
                                                    <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-200 text-gray-800 border border-gray-300">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                                        Student
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-700">
                                                    {user.coachingInstitute || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {user.role === 'student' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleView(user)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center gap-1"
                                                        >
                                                            <Eye size={16} /> View
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(user.email, user.name, user.role)}
                                                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                                                        >
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 inline-flex items-center gap-1 cursor-not-allowed" title="Admin actions restricted">
                                                        <Lock size={14} /> Protected
                                                    </span>
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

            {/* Student Details Modal */}
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
                                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 text-center">
                                    <p className="text-gray-500 text-xs font-bold uppercase">Institute</p>
                                    <p className="text-lg font-bold text-gray-800 mt-2">{selectedUser.coachingInstitute}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                    <p className="text-green-600 text-xs font-bold uppercase">Topics Done</p>
                                    <p className="text-2xl font-bold text-green-700 mt-1">{userStats.completed} <span className="text-sm text-green-500 font-normal">/ {userStats.total}</span></p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                                    <p className="text-yellow-600 text-xs font-bold uppercase">In Progress</p>
                                    <p className="text-2xl font-bold text-yellow-700 mt-1">{userStats.inProgress}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h4 className="font-bold text-gray-700 mb-2">Raw Data Access</h4>
                                <p className="text-sm text-gray-500 mb-3">
                                    This student's progress data is stored locally in the browser storage under key: 
                                    <code className="bg-gray-200 px-1 py-0.5 rounded ml-1 text-xs">bt-jee-tracker-progress-{selectedUser.email}</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};