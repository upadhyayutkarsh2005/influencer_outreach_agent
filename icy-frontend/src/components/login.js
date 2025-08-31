import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../service/api';

const Login = ({ onLogin }) => {
  const responseGoogle = async (credentialResponse) => {
    console.log('Google OAuth Response:', credentialResponse);
    try {
      console.log('Sending credential to backend:', credentialResponse.credential);
      const result = await authAPI.googleLogin(credentialResponse.credential);
      console.log('Backend response:', result);
      
      localStorage.setItem('token', result.data.access_token);
      onLogin(result.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.detail || error.response.statusText || errorMessage;
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        console.error('No response received:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
        console.error('Error message:', error.message);
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Welcome to ICY</h2>
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => {
            console.log('Login Failed');
            alert('Login failed. Please try again.');
          }}
        />
      </div>
    </div>
  );
};

export default Login;