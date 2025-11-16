// src/pages/RecipeDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecipeDetailsPage.css";

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = "http://localhost:5001/api";

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/recipes/${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setRecipe(data.recipe);
        } else {
          setError(data.message || "Recipe not found");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/default-recipe.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/assets/")) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  if (loading) {
    return (
      <div className="recipe-details-page">
        {/* Navbar */}
        <nav className="navbar">
          <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
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
              <a href="/restaurants">Restaurants</a>
            </li>
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <a href="/login">Login / Register</a>
              </li>
            )}
          </ul>
        </nav>

        {/* Loading Skeleton */}
        <div className="recipe-details-container">
          <div className="recipe-details-content">
            <div className="skeleton skeleton-large-image"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-author"></div>
            <div className="skeleton skeleton-description"></div>
            <div className="skeleton skeleton-description"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-details-page">
        {/* Navbar */}
        <nav className="navbar">
          <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
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
              <a href="/restaurants">Restaurants</a>
            </li>
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <a href="/login">Login / Register</a>
              </li>
            )}
          </ul>
        </nav>

        <div className="recipe-details-container">
          <div className="error-message">
            <h2>😔 {error || "Recipe not found"}</h2>
            <button onClick={() => navigate("/recipes")} className="btn-back">
              Back to Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-details-page">
      {/* Navbar */}
      <nav className="navbar">
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
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
            <a href="/restaurants">Restaurants</a>
          </li>
          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <a href="/login">Login / Register</a>
            </li>
          )}
        </ul>
      </nav>

      {/* Recipe Details */}
      <div className="recipe-details-container">
        <button onClick={() => navigate("/recipes")} className="btn-back">
          ← Back to Recipes
        </button>

        <div className="recipe-details-content">
          <div className="recipe-image-container">
            <img
              src={getImageUrl(recipe.image)}
              alt={recipe.title}
              className="recipe-detail-image"
            />
          </div>

          <div className="recipe-info">
            <h1 className="recipe-title">{recipe.title}</h1>

            <div className="recipe-meta">
              <span className="recipe-author">
                👨‍🍳 By: <strong>{recipe.userEmail}</strong>
              </span>
              <span className="recipe-date">
                📅 {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="recipe-description">
              <h2>Description</h2>
              <p>{recipe.description}</p>
            </div>

            {recipe.updatedAt !== recipe.createdAt && (
              <div className="recipe-updated">
                <small>
                  Last updated:{" "}
                  {new Date(recipe.updatedAt).toLocaleDateString()}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
