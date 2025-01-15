// src/routes/ProtectedRoute.jsx

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("ProtectedRoute rendering. Checking token...");
        // Call a protected endpoint to verify authentication
        await axiosInstance.get(
          "/auth/verify",
          { headers: { Authorization: `Bearer ${accessToken}` } },
          { withCredentials: true }
        ); // Implement this endpoint on the backend
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    // Optionally, return a loading indicator
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
