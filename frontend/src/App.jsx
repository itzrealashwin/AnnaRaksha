import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Warehouse from "./pages/Warehouse.jsx";
import Batches from "./pages/Batches.jsx";
import Alerts from "./pages/Alerts.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import { Toaster } from "@/components/ui/sonner";

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
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/warehouses" element={<Warehouse />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/alerts" element={<Alerts />} />
        </Route>
      </Route>
    </Routes>
  );
}

// Separate component to include Toaster alongside Routes if needed, 
// or just put Toaster outside Routes in main.jsx but since App is inside BrowserRouter in main.jsx we can put it here?
// Actually Toaster should be outside Routes but inside BrowserRouter usually.
// Or just adding it at the end of App component return.

function AppWithToaster() {
   return (
     <>
        <App />
        <Toaster />
     </>
   )
}

export default AppWithToaster;

