// src/App.jsx
import React, { useEffect } from 'react';
import axiosInstance, { getCsrfToken } from './axiosConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  useEffect(() => {
    // Fetch CSRF token on mount
    getCsrfToken();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
