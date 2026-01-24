import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Restore user data from profile if token exists (runs once on mount)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const restoreUserFromToken = async () => {
        try {
          const response = await api.getProfile();
          const userData = response.data.user || response.data;
          setUser(userData);
        } catch (error) {
          console.error('Failed to restore user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      };
      
      restoreUserFromToken();
    }
  }, []);

  // Store token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const register = async (fullName, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await api.register({ fullName, email, password, confirmPassword });
      const data = response.data;
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      const data = response.data;
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { message: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
