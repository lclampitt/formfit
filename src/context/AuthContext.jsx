// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

// Wraps the app and exposes Supabase auth session/user
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Grab initial session on page load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    // Subscribe to login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Simple hook so components can read auth state
export function useAuth() {
  return useContext(AuthContext);
}
