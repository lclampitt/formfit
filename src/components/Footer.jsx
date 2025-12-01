import React from "react";
import { NavLink } from "react-router-dom";

// Simple footer with navigation + little brand blurb
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        {/* Left side: app name + description */}
        <div className="app-footer-left">
          <div className="footer-brand">FormFit</div>
          <div className="footer-text">
            Simple tracking for workouts, sleep, and daily reflections.
          </div>
          <div className="footer-copy">
            © {year} FormFit. All rights reserved.
          </div>
        </div>

        {/* Right side: app links + stubbed info links */}
        <div className="app-footer-right">
          <div className="footer-column">
            <div className="footer-heading">App</div>
            <NavLink to="/" className="footer-link">
              Dashboard
            </NavLink>
            <NavLink to="/workouts" className="footer-link">
              Workouts
            </NavLink>
            <NavLink to="/sleep" className="footer-link">
              Sleep
            </NavLink>
            <NavLink to="/journal" className="footer-link">
              Journal
            </NavLink>
            <NavLink to="/progress" className="footer-link">
              Progress
            </NavLink>
          </div>

          <div className="footer-column">
            <div className="footer-heading">Info</div>
            <div className="footer-link disabled-link">Contact (demo)</div>
            <div className="footer-link disabled-link">About (demo)</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
