import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Fake account
    const fakeUser = {
      email: "admin@test.com",
      password: "123456",
    };

    if (email === fakeUser.email && password === fakeUser.password) {
      setError("");
      navigate("/calendar"); // go to main app
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to continue</p>

        <input
          type="email"
          placeholder="Email"
          className={`auth-input ${error ? 'error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={`auth-input ${error ? 'error' : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-button" onClick={handleLogin}>
          Login
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>

        {/* Demo account info */}
        <div className="demo-info">
          <strong>Demo Account:</strong><br />
          Email: admin@test.com<br />
          Password: 123456
        </div>
      </div>
    </div>
  );
}
