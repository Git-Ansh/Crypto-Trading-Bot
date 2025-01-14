// src/components/LogoutButton.jsx

import React from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { blue, lightBlue } from '@mui/material/colors';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      // Optionally, clear localStorage or any other client-side data
      localStorage.removeItem('refreshToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button variant="contained"
  sx={{
    bgcolor: blue,
    color: "#fcfcfc",
    fontSize: "10px",
    fontWeight: "bold",
    p: "10px 20px",
    mt: "18px",
    transition: ".3s ease",
    ":hover": {
      bgcolor: lightBlue,
    },
  }}
   onClick={handleLogout}>logout</button>;
};

export default LogoutButton;
