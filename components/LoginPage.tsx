
import React, { useState } from 'react';
import { LogIn, GraduationCap, User as UserIcon, ArrowRight, Lock, Mail, Building2, Calendar, AlertTriangle, KeyRound, HelpCircle, Users } from 'lucide-react';
import { authService } from '../services/authService';
import { User, COACHING_INSTITUTES, SECURITY_QUESTIONS } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Generate next 4 years for dropdown
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3].map(y => `IIT JEE ${y}`);

  // Form State
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coaching, setCoaching] = useState(COACHING_INSTITUTES[0]);
  const [targetYear, setTargetYear] = useState(years[0]);
  
  // Security Question State
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [retrievedQuestion, setRetrievedQuestion] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState<React.ReactNode | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setSecurityAnswer('');
    setNewPassword('');
    setForgotStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (view === 'signup') {
        const result = authService.register(name, email, password, coaching, targetYear, securityQuestion, securityAnswer, role);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          if (result.message === 'Email already registered.') {
            setError(
              <span className="flex items-center gap-2">
                 Email exists. 
                 <button 
                   type="button" 
                   onClick={() => setView('login')} 
                   className="underline font-bold hover:text-red-800"
                 >
                   Log In?
                 </button>
              </span>
            );
          } else {
            setError(result.message || 'Registration failed');
          }
          setLoading(false);
        }
      } else if (view === 'login') {
        const result = authService.login(email, password);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.message || 'Login failed');
          setLoading(false);
        }
      } else if (view === 'forgot') {
         if (forgotStep === 1) {
             // Check email and get question
             const result = authService.getSecurityQuestion(email);
             if (result.success && result.question) {
                 setRetrievedQuestion(result.question);
                 setForgotStep(2);
                 setError(null);
             } else {
                 setError(result.message);
             }
             setLoading(false);
         } else {
             // Reset Password
             const result = authService.resetPassword(email, securityAnswer, newPassword);
             if (result.success) {
                 setSuccessMsg("Password reset successful! You can now login.");
                 setTimeout(() => {
                     clearForm();
                     setView('login');
                 }, 2000);
             } else {
                 setError(result.message);
                 setLoading(false);
             }
         }
      }
    }, 600);
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
               <h2 className="text-xl font-bold text-gray-800">
                   {view === 'signup' ? 'Create Account' : view === 'forgot' ? 'Reset Password' : 'Welcome Back'}
               </h2>
               {view !== 'login' && (
                   <button 
                     type="button" 
                     onClick={() => { setView('login'); clearForm(); }}
                     className="text-sm text-bt-blue font-medium hover:underline"
                   >
                       Back to Login
                   </button>
               )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-4 animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 mb-4 animate-in slide-in-from-top-2">
                {successMsg}
              </div>
            )}

            {/* Role Switcher for SignUp */}
            {view === 'signup' && (
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'student' ? 'bg-white shadow text-bt-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        I am a Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('parent')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'parent' ? 'bg-white shadow text-bt-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        I am a Parent
                    </button>
                </div>
            )}

            {view === 'signup' && (
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
                      placeholder={role === 'parent' ? "Parent Name" : "Student Name"}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                    />
                  </div>
                </div>

                {role === 'student' && (
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
                )}
              </>
            )}

            {/* Email Field (Always visible except step 2 of forgot) */}
            {(view !== 'forgot' || forgotStep === 1) && (
                <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'parent' ? "parent@example.com" : "student@example.com"}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                    />
                </div>
                </div>
            )}

            {/* Normal Login Password */}
            {view === 'login' && (
               <div className="space-y-1">
                    <div className="flex justify-between">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                        <button type="button" onClick={() => { setView('forgot'); clearForm(); }} className="text-xs text-bt-blue hover:underline">Forgot?</button>
                    </div>
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
            )}

            {/* Signup Password */}
            {view === 'signup' && (
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Security Question Section (Sign Up) */}
            {view === 'signup' && (
                <div className="p-3 bg-blue-50 rounded-lg space-y-3 border border-blue-100">
                    <p className="text-xs text-blue-800 font-bold flex items-center gap-1">
                        <KeyRound size={12} /> Account Recovery Setup
                    </p>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Security Question</label>
                        <div className="relative">
                            <HelpCircle className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                value={securityQuestion}
                                onChange={(e) => setSecurityQuestion(e.target.value)}
                                className="w-full pl-10 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none bg-white appearance-none"
                            >
                                {SECURITY_QUESTIONS.map((q, idx) => (
                                    <option key={idx} value={q}>{q}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Answer</label>
                        <input
                            type="text"
                            required
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="e.g. Fluffy"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Forgot Password View */}
            {view === 'forgot' && forgotStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Security Question</p>
                        <p className="text-sm text-gray-800 font-medium">{retrievedQuestion}</p>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Your Answer</label>
                        <input
                            type="text"
                            required
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="Type your answer here"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Set new password"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue focus:border-bt-blue outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bt-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              {loading ? 'Processing...' : (
                  view === 'signup' ? (role === 'parent' ? 'Create Parent Account' : 'Create Student Account') : 
                  view === 'forgot' ? (forgotStep === 1 ? 'Find Account' : 'Reset Password') : 
                  'Sign In'
              )} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {view === 'login' && (
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                Don't have an account?
                <button 
                    onClick={() => { setView('signup'); clearForm(); }}
                    className="ml-2 font-semibold text-bt-blue hover:underline focus:outline-none"
                >
                    Sign Up
                </button>
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
