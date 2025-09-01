import React, { useState, useEffect } from "react";
import { authAPI } from "../service/api";

const Dashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        const response = await authAPI.getCurrentUser();
        setUserData(response.data);
      } catch (error) {
        console.error("Token verification failed:", error);
        onLogout();
      } finally {
        setIsLoading(false);
      }
    };

    if (!userData) {
      verifyToken();
    }
  }, [userData, onLogout]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading || !userData) {
    const loadingContainerStyle = {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const loadingCardStyle = {
      padding: '2rem',
      borderRadius: '1rem'
    };

    return (
      <div style={loadingContainerStyle}>
        <div className="glass animate-fade-in" style={loadingCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg style={{ animation: 'spin 1s linear infinite', height: '2rem', width: '2rem', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p style={{ fontSize: '1.25rem', fontWeight: '500', color: 'white', margin: 0 }}>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)'
  };

  const navStyle = {
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(16px)'
  };

  const navContainerStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const navContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4rem'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const profileSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const profileInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };

  const avatarStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    objectFit: 'cover'
  };

  const avatarFallbackStyle = {
    width: '2.5rem',
    height: '2.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.3)'
  };

  const mainContentStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '2rem 1rem'
  };

  const cardStyle = {
    padding: '1.5rem',
    borderRadius: '1rem',
    marginBottom: '2rem'
  };

  const featureCardStyle = {
    padding: '1.5rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'scale(1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const profileGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  };

  return (
    <div style={containerStyle}>
      {/* Navigation Header with Profile */}
      <nav className="glass" style={navStyle}>
        <div style={navContainerStyle}>
          <div style={navContentStyle}>
            {/* Logo */}
            <div style={logoStyle}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>ICY</h1>
              <span style={{ marginLeft: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Dashboard</span>
            </div>
            
            {/* Profile Section */}
            <div style={profileSectionStyle}>
              <div style={profileInfoStyle}>
                {/* Profile Avatar */}
                {userData.profile_picture ? (
                  <img
                    src={userData.profile_picture}
                    alt="Profile"
                    style={avatarStyle}
                  />
                ) : (
                  <div style={avatarFallbackStyle}>
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>
                      {getInitials(userData.name || `${userData.first_name} ${userData.last_name}` || userData.email)}
                    </span>
                  </div>
                )}
                
                {/* Profile Info */}
                <div style={{ display: window.innerWidth > 640 ? 'block' : 'none' }}>
                  <p style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem', margin: 0 }}>
                    {userData.name || `${userData.first_name} ${userData.last_name}` || 'User'}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', margin: 0 }}>{userData.email}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main style={mainContentStyle}>
        {/* Welcome Section */}
        <div className="glass animate-fade-in" style={cardStyle}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            Welcome back, {userData.first_name || userData.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Ready to explore the amazing features of ICY? Let's get started!
          </p>
        </div>

        {/* User Profile Card */}
        <div className="glass animate-slide-up" style={cardStyle}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>Your Profile</h3>
          <div style={profileGridStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1rem' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                <p style={{ color: 'white', fontWeight: '500', margin: 0 }}>{userData.email}</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1rem' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                <p style={{ color: 'white', fontWeight: '500', margin: 0 }}>
                  {userData.first_name} {userData.last_name}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1rem' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Authentication Method</label>
                <p style={{ color: 'white', fontWeight: '500', margin: 0, textTransform: 'capitalize' }}>{userData.auth_method}</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1rem' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Member Since</label>
                <p style={{ color: 'white', fontWeight: '500', margin: 0 }}>
                  {new Date(userData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards Grid */}
        <div style={gridStyle}>
          {/* ML Analytics Card */}
          <div 
            className="glass animate-slide-up" 
            style={featureCardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginLeft: '0.75rem', margin: 0 }}>ML Analytics</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
              View your machine learning model performance and predictions
            </p>
            <button style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background 0.3s ease' }}>
              View Analytics
            </button>
          </div>
          
          {/* Data Insights Card */}
          <div 
            className="glass animate-slide-up" 
            style={{...featureCardStyle, animationDelay: '0.1s'}}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', background: 'rgba(34, 197, 94, 0.3)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginLeft: '0.75rem', margin: 0 }}>Data Insights</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
              Explore data visualizations and statistical analysis
            </p>
            <button style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background 0.3s ease' }}>
              Explore Data
            </button>
          </div>
          
          {/* Reports Card */}
          <div 
            className="glass animate-slide-up" 
            style={{...featureCardStyle, animationDelay: '0.2s'}}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', background: 'rgba(168, 85, 247, 0.3)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginLeft: '0.75rem', margin: 0 }}>Reports</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
              Generate and download comprehensive reports
            </p>
            <button style={{ background: 'rgba(168, 85, 247, 0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background 0.3s ease' }}>
              View Reports
            </button>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div className="glass animate-fade-in" style={cardStyle}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: '500', margin: '0 0 0.25rem 0' }}>Model training completed</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', margin: 0 }}>Decision Tree model achieved 95% accuracy</p>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>2 hours ago</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', background: 'rgba(34, 197, 94, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: '500', margin: '0 0 0.25rem 0' }}>Data visualization generated</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', margin: 0 }}>Created correlation heatmap and charts</p>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>5 hours ago</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', background: 'rgba(168, 85, 247, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: '500', margin: '0 0 0.25rem 0' }}>Account created successfully</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', margin: 0 }}>Welcome to ICY platform!</p>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>Today</span>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;