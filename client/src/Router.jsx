// src/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute"; // your new file
import App from "./App";
import {
  Login,
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public route for login */}
      <Route path="/" element={<Login />} />
      <Route path="/form" element={<Form />} />

      {/* A protected wrapper route for everything else */}
      <Route element={<ProtectedRoute />}>
        {/* These routes are only accessible if isAuthenticated === true */}
        <Route path="/" element={<App />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/bar" element={<Bar />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/line" element={<Line />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/geography" element={<Geography />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
