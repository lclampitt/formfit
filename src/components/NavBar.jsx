// src/components/NavBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/formfit.png";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

// Top navigation: logo, page links, and auth button
export default function NavBar() {
  const { session } = useAuth();
  const navigate = useNavigate();

  // Sign out via Supabase and send user back to auth page
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="navbar">
      {/* Centered inner band (matches app-main width) */}
      <div className="navbar-inner">
        {/* Brand logo + text */}
        <div className="navbar-logo">
          <img
            src={logoImg}
            alt="FormFit logo"
            className="navbar-logo-img"
          />
          <span className="navbar-logo-text">FormFit</span>
        </div>

        {/* Navigation links + auth button */}
        <nav className="navbar-links">
          {session && (
            <>
              <NavLink to="/" end>
                Dashboard
              </NavLink>
              <NavLink to="/workouts">Workouts</NavLink>
              <NavLink to="/sleep">Sleep</NavLink>
              <NavLink to="/journal">Journal</NavLink>
              <NavLink to="/progress">Progress</NavLink>
            </>
          )}

          {session ? (
            <button
              type="button"
              className="nav-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/auth">Sign In</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
