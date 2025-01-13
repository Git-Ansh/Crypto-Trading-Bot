// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1) Check some form of auth: e.g., token in localStorage
  const isAuthenticated = !!localStorage.getItem('accessToken');

  // 2) If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3) Otherwise, render the nested routes (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
