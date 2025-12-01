// src/components/NavBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/formfit.png";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function NavBar() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="navbar">
      {/* NEW inner container so we can center the whole cluster */}
      <div className="navbar-inner">
        <div className="navbar-logo">
          <img
            src={logoImg}
            alt="FormFit logo"
            className="navbar-logo-img"
          />
          <span className="navbar-logo-text">FormFit</span>
        </div>

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
