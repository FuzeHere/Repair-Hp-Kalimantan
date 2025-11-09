
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { USERS } from './mockData';
import type { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    try {
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
        return null;
    }
  });

  const handleLogin = useCallback((username: string, password: string): boolean => {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardPage user={currentUser} onLogout={handleLogout} />;
};

export default App;