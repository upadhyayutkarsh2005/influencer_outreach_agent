import React, { useState, useEffect } from 'react';
import { authAPI } from '../service/api';

const Dashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUserData(response.data);
      } catch (error) {
        console.error('Token verification failed:', error);
        onLogout();
      }
    };

    if (!userData) {
      verifyToken();
    }
  }, [userData, onLogout]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {userData.first_name}!</h2>
      <div>
        {userData.profile_picture && (
          <img 
            src={userData.profile_picture} 
            alt="Profile" 
            style={{ width: '100px', borderRadius: '50%' }}
          />
        )}
        <p>Email: {userData.email}</p>
        <p>Name: {userData.first_name} {userData.last_name}</p>
      </div>
      <button onClick={onLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;