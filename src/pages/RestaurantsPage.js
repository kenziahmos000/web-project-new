import React, { useState, useEffect } from "react";
import "../styles/RestaurantsPage.css";

export default function RestaurantsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch("http://localhost:5001/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsLoggedIn(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="restaurants-page">
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
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/recipes">Recipes</a>
          </li>
          <li>
            <a href="/restaurants" className="active">
              Restaurants
            </a>
          </li>
          {isLoggedIn ? (
            <>
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

      <div className="content">
        <h1>Restaurants</h1>
        <p>Coming soon! Find amazing restaurants near you.</p>
      </div>
    </div>
  );
}
