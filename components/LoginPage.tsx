
import React, { useState } from 'react';
import { LogIn, GraduationCap, User as UserIcon, ArrowRight, Lock, Mail, Building2, Calendar, RotateCcw, AlertTriangle } from 'lucide-react';
import { authService } from '../services/authService';
import { User, COACHING_INSTITUTES } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Generate next 4 years for dropdown
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3].map(y => `IIT JEE ${y}`);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coaching, setCoaching] = useState(COACHING_INSTITUTES[0]);
  const [targetYear, setTargetYear] = useState(years[0]);
  
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (isSignUp) {
        const result = authService.register(name, email, password, coaching, targetYear);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          if (result.message === 'Email already registered.') {
            setError(
              <span className="flex items-center gap-2">
                 Email exists. 
                 <button 
                   type="button" 
                   onClick={() => setIsSignUp(false)} 
                   className="underline font-bold hover:text-red-800"
                 >
                   Log In instead?
                 </button>
              </span>
            );
          } else {
            setError(result.message || 'Registration failed');
          }
          setLoading(false);
        }
      } else {
        const result = authService.login(email, password);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.message || 'Login failed');
          setLoading(false);
        }
      }
    }, 600);
  };

  const handleReset = () => {
    if (confirm("FACTORY RESET: This will delete ALL users, progress, and settings. Are you sure?")) {
        localStorage.clear();
        window.location.reload();
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
            
            {/* Toggle Header */}
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-gray-800">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-4 animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Institute</label>
                    <div className="relative">
                      <Building2 className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <select
                        value={coaching}
                        onChange={(e) => setCoaching(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none bg-white appearance-none text-ellipsis overflow-hidden"
                      >
                        {COACHING_INSTITUTES.map((inst) => (
                          <option key={inst} value={inst}>{inst.split(' ')[0]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Target Year</label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <select
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none bg-white appearance-none"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bt-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button 
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                className="ml-2 font-semibold text-bt-blue hover:underline focus:outline-none"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-center gap-2">
             <p className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
               Admin Demo: vikas.00@gmail.com / Ishika@123
             </p>
             <button 
                onClick={handleReset}
                className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-1 mt-2 opacity-60 hover:opacity-100 transition-opacity"
             >
                <AlertTriangle size={10} /> Reset App Data
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};