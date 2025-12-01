// src/pages/Auth.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

// Login / register screen backed by Supabase auth
function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // 'error' | 'success' | null
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // Handle sign in or sign up depending on isLogin
  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus(null);
    setBusy(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setStatus("success");
        setMessage("✅ Logged in successfully.");
        navigate("/", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        setStatus("success");
        setMessage(
          "✅ Account created! Please check your email to confirm your account."
        );
      }
    } catch (err) {
      setStatus("error");
      setMessage(`❌ ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  // Switch between login and register modes
  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setMessage("");
    setStatus(null);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Sign In" : "Create your FormFit account"}
        </h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Sign in to track your workouts, sleep, and daily reflections."
            : "Create an account to start saving your FormFit data securely."}
        </p>

        {/* Email + password form */}
        <form className="auth-form" onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />

          <button type="submit" disabled={busy}>
            {busy
              ? isLogin
                ? "Signing in…"
                : "Creating account…"
              : isLogin
              ? "Sign In"
              : "Register"}
          </button>
        </form>

        {/* Toggle login/register */}
        <p className="switch-text" onClick={toggleMode}>
          {isLogin ? (
            <>
              No account? <span>Register here</span>
            </>
          ) : (
            <>
              Already have an account? <span>Sign in</span>
            </>
          )}
        </p>

        {/* Status message area */}
        {message && (
          <p
            className={`auth-message ${
              status === "error" ? "error" : "success"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
