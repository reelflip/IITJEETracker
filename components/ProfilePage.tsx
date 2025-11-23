
import React from 'react';
import { User as UserIcon, Mail, Building2, GraduationCap, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
  name: string;
  email: string;
  coaching: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ name, email, coaching }) => {
  // Derive initials
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </div>

        <div className="pt-20 pb-8 px-8">
           <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
           <p className="text-gray-500">JEE Aspirant • {coaching}</p>

           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Account Details Card */}
              <div className="bg-slate-50 rounded-xl p-6 border border-gray-100 space-y-4">
                 <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Account Details</h3>
                 
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100">
                       <UserIcon size={18} />
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Full Name</p>
                       <p className="text-gray-900 font-medium">{name}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100">
                       <Mail size={18} />
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                       <p className="text-gray-900 font-medium">{email}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100">
                       <Building2 size={18} />
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Coaching Institute</p>
                       <p className="text-gray-900 font-medium">{coaching}</p>
                    </div>
                 </div>
              </div>

              {/* Status Card */}
              <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 space-y-4">
                 <h3 className="font-semibold text-blue-900 border-b border-blue-200 pb-2 mb-2">Subscription Status</h3>
                 
                 <div className="flex items-start gap-3">
                    <ShieldCheck className="text-green-600 mt-1" />
                    <div>
                       <p className="font-bold text-gray-900">Active Student Account</p>
                       <p className="text-sm text-gray-600 mt-1">
                          You have full access to the Syllabus Tracker, Question Bank, and Smart Planner features tailored for {coaching}.
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-200">
                    <GraduationCap className="text-bt-blue" size={20} />
                    <span className="text-sm font-medium text-blue-800">Target Exam: JEE Advanced 2025/26</span>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};
