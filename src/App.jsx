// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Sleep from "./pages/Sleep";
import Journal from "./pages/Journal";
import Progress from "./pages/Progress";
import AuthPage from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

// Top-level router + providers for the whole app
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* Public auth route (still shows navbar + footer) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* All app pages below require login */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/progress" element={<Progress />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
