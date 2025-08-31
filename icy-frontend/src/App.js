import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import { authAPI } from './service/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, verify it
      verifyAuthToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAuthToken = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;