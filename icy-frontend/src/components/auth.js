import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../service/api';

const GoogleAuth = ({ onSuccess, onFailure, buttonText }) => {
  const responseGoogle = async (credentialResponse) => {
    console.log('Google OAuth Response:', credentialResponse);
    try {
      console.log('Sending credential to backend:', credentialResponse.credential);
      const result = await authAPI.googleLogin(credentialResponse.credential);
      console.log('Backend response:', result);
      
      localStorage.setItem('token', result.data.access_token);
      onSuccess(result.data.user);
    } catch (error) {
      console.error('Google login failed:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Google login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.statusText || errorMessage;
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
        console.error('No response received:', error.request);
      } else {
        errorMessage = error.message || errorMessage;
        console.error('Error message:', error.message);
      }
      
      onFailure(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => {
          console.log('Google OAuth Failed');
          onFailure('Google authentication failed');
        }}
        useOneTap={false}
        theme="filled_black"
        size="large"
        width="100%"
        text={buttonText?.includes('Sign in') ? 'signin_with' : 'signup_with'}
      />
    </div>
  );
};

export default GoogleAuth;