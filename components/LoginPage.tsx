
import React, { useState, useEffect } from 'react';
import { LogIn, GraduationCap, User, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [inputName, setInputName] = useState('');
  const [existingUsers, setExistingUsers] = useState<string[]>([]);

  useEffect(() => {
    const users: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('bt-jee-tracker-progress-')) {
        const username = key.replace('bt-jee-tracker-progress-', '');
        if (username) users.push(username);
      }
    }
    setExistingUsers(users.sort());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      onLogin(inputName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-bt-blue p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">JEE PrepTracker</h1>
          <p className="text-blue-100 text-sm">Your personal path to IIT success</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none transition-all"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full bg-bt-blue hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Preparing <ArrowRight size={18} />
            </button>
          </form>

          {existingUsers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Continue as
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {existingUsers.map((user) => (
                  <button
                    key={user}
                    onClick={() => onLogin(user)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between group"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      {user}
                    </span>
                    <LogIn size={16} className="text-gray-300 group-hover:text-bt-blue" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
