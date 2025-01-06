// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig'; // Import the configured Axios instance

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/dashboard'); // Example endpoint to verify auth
        if (res.data.user) {
          setAuth({
            isAuthenticated: true,
            loading: false,
            user: res.data.user,
          });
        } else {
          setAuth({
            isAuthenticated: false,
            loading: false,
            user: null,
          });
        }
      } catch (err) {
        setAuth({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await axiosInstance.post('/auth/login', { email, password });
      setAuth({
        isAuthenticated: true,
        loading: false,
        user: null, // Fetch user details if needed
      });
    } catch (err) {
      console.error(err);
      // Handle errors appropriately
    }
  };

  const register = async (username, email, password) => {
    try {
      await axiosInstance.post('/auth/register', { username, email, password });
      // Optionally, auto-login after registration
    } catch (err) {
      console.error(err);
      // Handle errors appropriately
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setAuth({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    } catch (err) {
      console.error(err);
      // Handle errors appropriately
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
