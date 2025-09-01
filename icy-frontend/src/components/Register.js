import React, { useState } from 'react';
import GoogleAuth from './auth';
import { authAPI } from '../service/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.access_token);
      onRegister(response.data.user);
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    onRegister(user);
  };

  const handleGoogleFailure = (error) => {
    setError('Google registration failed');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '28rem',
    padding: '2rem',
    borderRadius: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    marginBottom: '0.5rem'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: '600',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div className="glass animate-fade-in" style={formContainerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>ICY</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Join us and explore amazing features</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #f87171',
            color: '#fecaca',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            marginBottom: '1rem'
          }} className="animate-slide-up">
            <p style={{ fontSize: '0.875rem', margin: 0 }}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.3)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.3)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.3)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.3)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.3)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={buttonStyle}
            onMouseOver={(e) => !isLoading && (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseOut={(e) => (e.target.style.background = isLoading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)')}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ animation: 'spin 1s linear infinite', marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}></div>
          <span style={{ padding: '0 1rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>or continue with</span>
          <div style={{ flex: 1, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}></div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <GoogleAuth
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            buttonText="Sign up with Google"
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Already have an account? </span>
          <button 
            onClick={onSwitchToLogin} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontWeight: '600', 
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            onMouseOut={(e) => e.target.style.color = 'white'}
          >
            Sign in here
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Register;