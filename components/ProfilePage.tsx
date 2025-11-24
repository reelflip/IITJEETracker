
import React, { useState, useMemo } from 'react';
import { User as UserIcon, Mail, Building2, ShieldCheck, Link as LinkIcon, Send, CheckCircle, XCircle, AlertCircle, GraduationCap, Calendar, Timer, Pencil, Save, X, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { User, COACHING_INSTITUTES } from '../types';

interface ProfilePageProps {
  user: User; // Full user object to handle logic
  linkedUser?: User | null; // The connected student/parent
  onConnectionUpdate: () => void; // Callback to refresh dashboard
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, linkedUser, onConnectionUpdate }) => {
  // Connection State
  const [connectEmail, setConnectEmail] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editInstitute, setEditInstitute] = useState(user.coachingInstitute || COACHING_INSTITUTES[0]);
  
  // Generate years for edit dropdown
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3].map(y => `IIT JEE ${y}`);
  const [editTargetYear, setEditTargetYear] = useState(user.targetYear || availableYears[0]);

  // Derive initials
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // --- Countdown Logic ---
  const examCountdown = useMemo(() => {
      if (user.role !== 'student' || !user.targetYear) return null;
      
      const match = user.targetYear.match(/20\d{2}/);
      if (!match) return null;
      
      const year = parseInt(match[0]);
      const targetDate = new Date(year, 0, 24); // Jan 24th
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      
      if (diffTime < 0) return { label: "Status", value: "Completed", color: "text-gray-500" };

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return { 
          days: diffDays,
          label: diffDays > 1 ? "Days Remaining" : "Day Remaining",
          color: diffDays < 100 ? "text-red-600" : "text-bt-blue"
      };
  }, [user.targetYear, user.role]);

  const handleSendRequest = () => {
    if (!connectEmail) return;
    setLoading(true);
    setMsg(null);
    
    // Simulate delay
    setTimeout(() => {
        const res = authService.sendConnectionRequest(user.id, connectEmail);
        setMsg({
            type: res.success ? 'success' : 'error',
            text: res.message
        });
        setLoading(false);
        if (res.success) setConnectEmail('');
    }, 500);
  };

  const handleApprove = () => {
    if (!user.connectionRequestFrom) return;
    const res = authService.acceptConnectionRequest(user.id, user.connectionRequestFrom);
    if (res.success) {
        alert("Connection Approved!");
        onConnectionUpdate();
    }
  };

  const handleReject = () => {
    authService.rejectConnectionRequest(user.id);
    onConnectionUpdate();
  };

  const handleSaveProfile = () => {
      if (!editName.trim()) {
          alert("Name cannot be empty");
          return;
      }
      setSaveLoading(true);
      
      setTimeout(() => {
        const updates: Partial<User> = {
            name: editName
        };
        
        if (user.role === 'student') {
            updates.coachingInstitute = editInstitute;
            updates.targetYear = editTargetYear;
        }

        const res = authService.updateProfile(user.id, updates);
        if (res.success) {
            setIsEditing(false);
            onConnectionUpdate(); // Refresh dashboard session data
        } else {
            alert("Failed to update profile.");
        }
        setSaveLoading(false);
      }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* 1. Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-bt-blue to-blue-600 relative">
           <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                 <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {initials}
                 </div>
              </div>
           </div>
           
           {/* Edit Button */}
           {!isEditing && (
               <button 
                 onClick={() => {
                     setEditName(user.name);
                     if(user.role==='student') {
                         setEditInstitute(user.coachingInstitute || COACHING_INSTITUTES[0]);
                         setEditTargetYear(user.targetYear || availableYears[0]);
                     }
                     setIsEditing(true);
                 }}
                 className="absolute bottom-4 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm flex items-center gap-2 transition-all"
               >
                   <Pencil size={14} /> Edit Profile
               </button>
           )}
        </div>

        <div className="pt-20 pb-8 px-8">
           {/* Profile Header Content */}
           <div className="flex flex-col md:flex-row justify-between items-start gap-4">
               <div className="flex-1 w-full">
                    {isEditing ? (
                        <div className="space-y-2 mb-2">
                            <label className="text-xs text-gray-500 uppercase font-bold block">Full Name</label>
                            <input 
                                type="text" 
                                value={editName} 
                                onChange={e => setEditName(e.target.value)}
                                className="text-2xl font-bold text-gray-900 border-b-2 border-bt-blue outline-none w-full focus:bg-blue-50/50 rounded px-1"
                            />
                        </div>
                    ) : (
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    )}
                    
                    {!isEditing && (
                        <p className="text-gray-500 mt-1">{user.role === 'parent' ? 'Parent Account' : `JEE Aspirant • ${user.coachingInstitute}`}</p>
                    )}
               </div>
               
               {user.role === 'student' && !isEditing && (
                   <div className="text-right">
                       <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide block mb-1">
                           {user.targetYear}
                       </span>
                   </div>
               )}

               {/* Save/Cancel Actions */}
               {isEditing && (
                   <div className="flex gap-2 self-end md:self-start mt-2 md:mt-0">
                       <button 
                         onClick={() => setIsEditing(false)} 
                         disabled={saveLoading}
                         className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-300 flex items-center gap-1 transition-colors"
                       >
                           <X size={14} /> Cancel
                       </button>
                       <button 
                         onClick={handleSaveProfile} 
                         disabled={saveLoading}
                         className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-green-700 flex items-center gap-1 transition-colors disabled:opacity-70"
                       >
                           {saveLoading ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} Save Changes
                       </button>
                   </div>
               )}
           </div>

           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Account Details */}
              <div className="bg-slate-50 rounded-xl p-6 border border-gray-100 space-y-4">
                 <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Account Details</h3>
                 
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100">
                       <Mail size={18} />
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                       <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                 </div>

                 {user.role === 'student' && (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100">
                            <Building2 size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-bold">Institute</p>
                                {isEditing ? (
                                    <select 
                                        value={editInstitute}
                                        onChange={e => setEditInstitute(e.target.value)}
                                        className="w-full p-1 text-sm border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-bt-blue outline-none bg-white"
                                    >
                                        {COACHING_INSTITUTES.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                                    </select>
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.coachingInstitute}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100">
                            <Calendar size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-bold">Target Exam</p>
                                {isEditing ? (
                                    <select 
                                        value={editTargetYear}
                                        onChange={e => setEditTargetYear(e.target.value)}
                                        className="w-full p-1 text-sm border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-bt-blue outline-none bg-white"
                                    >
                                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.targetYear}</p>
                                )}
                            </div>
                        </div>
                    </>
                 )}
              </div>

              {/* Status / Countdown Card */}
              <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 space-y-4">
                 <h3 className="font-semibold text-blue-900 border-b border-blue-200 pb-2 mb-2">
                     {user.role === 'parent' ? 'Family Access' : 'Exam Countdown'}
                 </h3>
                 
                 {user.role === 'student' && examCountdown ? (
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                            <Timer size={24} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${examCountdown.color}`}>{examCountdown.days}</p>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{examCountdown.label}</p>
                        </div>
                     </div>
                 ) : (
                     <div className="flex items-start gap-3">
                        <ShieldCheck className="text-green-600 mt-1" />
                        <div>
                        <p className="font-bold text-gray-900">Active {user.role === 'parent' ? 'Guardian' : 'Student'} Account</p>
                        <p className="text-sm text-gray-600 mt-1">
                            {user.role === 'parent' 
                                ? "You can connect to a student account to view their academic progress." 
                                : "You have full access to the Syllabus Tracker, Question Bank, and Smart Planner features."}
                        </p>
                        </div>
                     </div>
                 )}
              </div>

           </div>
        </div>
      </div>

      {/* 2. Connection Manager Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex items-center gap-2">
              <LinkIcon className="text-gray-500" />
              <h2 className="text-lg font-bold text-gray-800">
                  {user.role === 'parent' ? 'Student Connection' : 'Parent Connection'}
              </h2>
          </div>
          
          <div className="p-8">
              {/* Scenario A: Already Connected */}
              {linkedUser ? (
                  <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                          <div className="bg-green-100 p-3 rounded-full">
                              {user.role === 'parent' ? <GraduationCap className="text-green-700" size={24} /> : <UserIcon className="text-green-700" size={24} />}
                          </div>
                          <div>
                              <p className="text-green-800 font-bold text-lg">Connected Successfully</p>
                              <p className="text-green-700">
                                  You are linked with <span className="font-semibold">{linkedUser.name}</span>.
                              </p>
                          </div>
                      </div>

                      {/* Detailed Student Info for Parents */}
                      {user.role === 'parent' && (
                          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Student Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <UserIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Name</p>
                                            <p className="text-gray-900 font-medium">{linkedUser.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Institute</p>
                                            <p className="text-gray-900 font-medium">{linkedUser.coachingInstitute || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                            <p className="text-gray-900 font-medium">{linkedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <GraduationCap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Target Exam</p>
                                            <p className="text-gray-900 font-medium">{linkedUser.targetYear || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                          </div>
                      )}
                  </div>
              ) : (
                  // Scenario B: Not Connected
                  <div className="space-y-6">
                      
                      {/* Parent View: Send Request */}
                      {user.role === 'parent' && (
                          <div className="max-w-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Connect to your Child</label>
                              <p className="text-sm text-gray-500 mb-4">Enter the email address your child used to register. They will need to approve the request from their profile.</p>
                              
                              <div className="flex gap-2">
                                  <input 
                                    type="email" 
                                    placeholder="student@example.com"
                                    value={connectEmail}
                                    onChange={(e) => setConnectEmail(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none"
                                  />
                                  <button 
                                    onClick={handleSendRequest}
                                    disabled={loading || !connectEmail}
                                    className="bg-bt-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                                  >
                                      {loading ? 'Sending...' : <><Send size={16} /> Send Request</>}
                                  </button>
                              </div>
                              
                              {/* Message Feedback */}
                              {msg && (
                                  <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                      {msg.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                                      {msg.text}
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Student View: Pending Requests */}
                      {user.role === 'student' && (
                          <div>
                              {user.connectionRequestFrom ? (
                                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                                      <div className="flex items-start gap-4">
                                          <div className="bg-orange-100 p-2 rounded-full">
                                              <LinkIcon className="text-orange-600" />
                                          </div>
                                          <div className="flex-1">
                                              <h3 className="text-lg font-bold text-orange-900">Pending Connection Request</h3>
                                              <p className="text-orange-800 mt-1">
                                                 A parent account is requesting access to your progress stats.
                                              </p>
                                              
                                              <p className="text-sm text-orange-700 mt-2 bg-orange-100/50 p-2 rounded inline-block">
                                                  Request ID: {user.connectionRequestFrom.slice(0, 8)}...
                                              </p>

                                              <div className="flex gap-3 mt-4">
                                                  <button 
                                                    onClick={handleApprove}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                                                  >
                                                      <CheckCircle size={16} /> Approve Access
                                                  </button>
                                                  <button 
                                                    onClick={handleReject}
                                                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                                  >
                                                      <XCircle size={16} /> Decline
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="text-gray-500 italic flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                          <LinkIcon size={14} />
                                      </div>
                                      No active connection requests.
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};
