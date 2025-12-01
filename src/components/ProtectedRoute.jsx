// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
        Checking session…
      </div>
    );
  }

  if (!session) {
    // Not logged in → go to auth page
    return <Navigate to="/auth" replace />;
  }

  // Logged in → render the child routes
  return <Outlet />;
}
