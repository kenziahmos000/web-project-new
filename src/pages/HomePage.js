// src/pages/HomePage.js
import React from "react";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
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
