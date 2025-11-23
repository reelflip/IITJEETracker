
import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { authService } from './services/authService';
import { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      key={currentUser.id} 
      userId={currentUser.email} 
      userName={currentUser.name}
      userCoaching={currentUser.coachingInstitute}
      userRole={currentUser.role} // Pass role
      onLogout={handleLogout} 
    />
  );
}

export default App;
