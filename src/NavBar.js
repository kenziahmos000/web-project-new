// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = "http://localhost:5001/api";

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsLoggedIn(true);
            setUserEmail(data.user.email);
            setIsAdmin(data.user.isAdmin || false);
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
    setUserEmail("");
    setIsAdmin(false);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        FoodieFind
      </h1>
      <ul>
        <li>
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/recipes" className={isActive("/recipes")}>
            Recipes
          </Link>
        </li>
        <li>
          <Link to="/restaurants" className={isActive("/restaurants")}>
            Restaurants
          </Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to="/favorites" className={isActive("/favorites")}>
              Favorites
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link to="/admin" className={isActive("/admin")}>
              Admin Portal
            </Link>
          </li>
        )}
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
            <Link to="/login">Login / Register</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
