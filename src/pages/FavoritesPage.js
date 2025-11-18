import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/api";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("Please login to see your saved recipes.");
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setFavorites((data.favorites || []).filter(Boolean));
          setUserEmail(data.user?.email || "");
          setMessage("");
        } else if (response.status === 401) {
          setMessage("Please login to see your saved recipes.");
          localStorage.removeItem("authToken");
        } else {
          setMessage(data.message || "Unable to load favorites right now.");
        }
      } catch (err) {
        setMessage("Network error while loading favorites.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/favorites/${recipeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setFavorites((data.favorites || []).filter(Boolean));
        setMessage("");
      } else {
        setMessage(data.message || "Unable to update favorites.");
      }
    } catch (err) {
      setMessage("Network error while updating favorites.");
    }
  };

  const getImageUrl = (imagePath = "") => {
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/assets/")) return imagePath;
    if (imagePath) return `http://localhost:5001${imagePath}`;
    return "/assets/default-recipe.jpg";
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div>
          <h1>Your Favorite Recipes</h1>
          {userEmail && (
            <p className="favorites-subtitle">Saved by {userEmail}</p>
          )}
        </div>
        <button
          className="btn-explore"
          onClick={() => navigate("/recipes")}
          type="button"
        >
          Explore More Recipes
        </button>
      </div>

      {loading && <p className="info-message">Loading favorites...</p>}

      {!loading && message && (
        <div className="info-message">
          <p>{message}</p>
          {!localStorage.getItem("authToken") && (
            <button
              className="btn-login"
              type="button"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          )}
        </div>
      )}

      {!loading && !message && favorites.length === 0 && (
        <p className="info-message">
          You have not saved any recipes yet. Explore recipes and tap the heart
          icon to add them here.
        </p>
      )}

      <div className="favorites-grid">
        {favorites.map((recipe) => (
          <div className="favorite-card" key={recipe._id}>
            <img src={getImageUrl(recipe.image)} alt={recipe.title} />
            <div className="favorite-info">
              <div>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="favorite-meta">
                  <span>Saved by: {userEmail || "You"}</span>
                  <span>Created by: {recipe.userEmail || "FoodieFind Chef"}</span>
                </div>
                <div className="favorite-rating">
                  <strong>{(recipe.rating || 0).toFixed(1)}</strong>
                  <span>/5</span>
                </div>
              </div>
              <div className="favorite-actions">
                <button
                  className="btn-view"
                  type="button"
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                >
                  View Recipe
                </button>
                <button
                  className="btn-remove"
                  type="button"
                  onClick={() => handleRemoveFavorite(recipe._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
