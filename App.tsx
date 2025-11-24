
import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { AboutUs } from './components/AboutUs';
import { BlogPage } from './components/BlogPage';
import { authService } from './services/authService';
import { User } from './types';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [publicView, setPublicView] = useState<'login' | 'about' | 'blogs'>('login');

  useEffect(() => {
    // Check for a persisting session
    const session = authService.getSession();
    if (session) {
      setCurrentUser(session);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setPublicView('login');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  // Public View Wrapper
  const renderPublicHeader = () => (
      <button 
        onClick={() => setPublicView('login')}
        className="flex items-center gap-2 text-gray-600 hover:text-bt-blue font-bold mb-6 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 sticky top-4 z-50"
      >
          <ArrowLeft size={20} /> Back to Login
      </button>
  );

  // Public View: About Us
  if (publicView === 'about' && !currentUser) {
      return (
          <div className="min-h-screen bg-slate-50 overflow-auto">
              <div className="max-w-5xl mx-auto px-4 py-6">
                  {renderPublicHeader()}
                  <AboutUs />
              </div>
          </div>
      );
  }

  // Public View: Blogs
  if (publicView === 'blogs' && !currentUser) {
      return (
          <div className="min-h-screen bg-slate-50 overflow-auto">
              <div className="max-w-6xl mx-auto px-4 py-6">
                  {renderPublicHeader()}
                  <BlogPage />
              </div>
          </div>
      );
  }

  if (!currentUser) {
    return (
        <LoginPage 
            onLogin={handleLogin} 
            onAboutClick={() => setPublicView('about')} 
            onBlogsClick={() => setPublicView('blogs')}
        />
    );
  }

  return (
    <Dashboard 
      key={currentUser.id} 
      userId={currentUser.email} 
      userName={currentUser.name}
      userCoaching={currentUser.coachingInstitute}
      userTargetYear={currentUser.targetYear} 
      userRole={currentUser.role} 
      onLogout={handleLogout} 
    />
  );
}

export default App;
