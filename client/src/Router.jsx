// src/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute"; // your new file
import App from "./App";
import {
  Login,
  Dashboard,
  SignUP
} from "./scenes";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public route for login */}
      <Route path="/" element={<Login />} />
      <Route path="/form" element={<SignUP />} />

      {/* A protected wrapper route for everything else */}
      <Route element={<ProtectedRoute />}>
        {/* These routes are only accessible if isAuthenticated === true */}
        <Route path="/" element={<App />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
