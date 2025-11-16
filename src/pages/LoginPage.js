import React, { useState, useEffect } from "react";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5001/api/auth";

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Verify token and get user info
      fetchUserInfo(token);
    }
  }, []);

  // Fetch user info from backend
  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        // Token invalid, clear it
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      localStorage.removeItem("authToken");
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user info
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        setSuccess("Registration successful!");

        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(email, password);

      const data = await response.json();

      if (response.ok) {
        // Save token and user info
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        setSuccess("Login successful!");

        // Clear form
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSuccess("Logged out successfully");
  };

  // If user is logged in, show welcome page
  if (isLoggedIn && user) {
    return (
      <div className="auth-container">
        <div className="auth-box logged-in">
          <h1>Welcome, {user.email}! 👋</h1>
          <div className="user-info">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            {user.createdAt && (
              <p>
                <strong>Member since:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="logged-in-actions">
            <button
              onClick={() => (window.location.href = "/")}
              className="btn-primary"
            >
              Go to Home
            </button>
            <button
              onClick={() => (window.location.href = "/recipes")}
              className="btn-primary"
            >
              Browse Recipes
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show login/register form
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>FoodieFind</h1>
        <p className="subtitle">Your favorite recipes and restaurants</p>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            className={isLogin ? "tab active" : "tab"}
            onClick={() => {
              setIsLogin(true);
              setError("");
              setSuccess("");
            }}
          >
            Login
          </button>
          <button
            className={!isLogin ? "tab active" : "tab"}
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
            }}
          >
            Register
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
