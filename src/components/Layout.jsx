import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-root">
      <NavBar />
      {/* key forces main to remount on every route change, triggering animation */}
      <main className="app-main" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
