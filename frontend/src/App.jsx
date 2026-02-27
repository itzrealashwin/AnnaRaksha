import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/" element={<Landing />} />

      {/* ── Guest only (redirect to /dashboard if logged in) ─ */}
      <Route element={<GuestRoute />}>
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* ── Protected (redirect to /login if not logged in) ── */}
      <Route element={<ProtectedRoute />}>
        {/* add protected pages here, e.g.: */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>
    </Routes>
  );
}

export default App;

