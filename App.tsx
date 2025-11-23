
import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a persisting session (optional, but good UX)
    const lastUser = localStorage.getItem('bt-jee-tracker-last-user');
    if (lastUser) {
      setCurrentUser(lastUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('bt-jee-tracker-last-user', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bt-jee-tracker-last-user');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Passing 'key' forces the Dashboard to fully remount and re-initialize state when user changes
  return (
    <Dashboard 
      key={currentUser} 
      user={currentUser} 
      onLogout={handleLogout} 
    />
  );
}

export default App;
