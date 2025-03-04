// src/components/LogoutButton.jsx

import React from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

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

  return (
    <Button
      variant="contained"
      onClick={handleLogout}
      startIcon={<LogoutOutlined />}
      sx={{
        backgroundColor: '#2196f3',
        color: '#ffffff',
        fontSize: "14px",
        fontWeight: "600",
        padding: "8px 16px",
        borderRadius: "8px",
        textTransform: "none",
        boxShadow: '0 2px 4px rgba(33, 150, 243, 0.25)',
        '&:hover': {
          backgroundColor: '#1976d2',
          boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
        },
        '&:active': {
          backgroundColor: '#1565c0',
        }
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
