// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Try to get user info
      fetch("http://localhost:5001/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsLoggedIn(true);
            setUserEmail(data.user.email);
          }
        })
        .catch(() => {
          // Token invalid
          localStorage.removeItem("authToken");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserEmail("");
    window.location.reload();
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <h1
          onClick={() => (window.location.href = "/")}
          style={{ cursor: "pointer" }}
        >
          FoodieFind
        </h1>
        <ul>
          <li>
            <a href="/" className="active">
              Home
            </a>
          </li>
          <li>
            <a href="/recipes">Recipes</a>
          </li>
          <li>
            <a href="/restaurants">Restaurants</a>
          </li>
          {isLoggedIn ? (
            <>
              <li className="user-email">{userEmail}</li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <a href="/login">Login / Register</a>
            </li>
          )}
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2>Discover Delicious Recipes & Local Restaurants</h2>
        <p>
          Find your next favorite meal, save recipes, and explore nearby
          restaurants!
        </p>
        <button>Get Started</button>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>Browse Recipes</h3>
          <p>Search, filter, and explore hundreds of recipes.</p>
        </div>
        <div className="feature-card">
          <h3>Save Favorites</h3>
          <p>Create your personal recipe collection with your login.</p>
        </div>
        <div className="feature-card">
          <h3>Find Restaurants</h3>
          <p>Discover local restaurants with ratings and reviews.</p>
        </div>
      </section>

      {/* Extras Section */}
      <section className="extras">
        <h2>Extra Features</h2>
        <p>
          Upload recipe images, filter by category, and integrate public
          restaurant APIs.
        </p>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 FoodieFind | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;
