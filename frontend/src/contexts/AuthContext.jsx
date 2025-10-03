import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // In a real app, you'd verify the token with the backend
        // For now, we'll just assume a token means a logged-in user
        // and fetch user details if needed.
        // For this simplified auth, we'll just set a dummy user.
        setUser({ email: 'user@example.com' }); // Replace with actual user data if available from token
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.accessToken);
      setUser({ email }); // Set user based on successful login
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, phone, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { email, phone, password });
      localStorage.setItem('accessToken', response.accessToken);
      setUser({ email }); // Set user based on successful registration
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

