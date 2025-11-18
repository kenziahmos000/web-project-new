// src/pages/HomePage.js
import React from "react";
import "../styles/HomePage.css";

const HomePage = () => {
  const handleGetStarted = () => {
    const featuresSection = document.querySelector(".features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>Discover Delicious Recipes & Local Restaurants</h1>
        <p>
          Find your next favorite meal, save recipes, and explore nearby
          restaurants!
        </p>
        <button onClick={handleGetStarted}>Get Started</button>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="feature-card">
          <img
            src="https://t4.ftcdn.net/jpg/03/57/91/11/240_F_357911175_lUNZj0iZx0B6UEj3JyJwhKnJQv1jT1i4.jpg"
            alt="Browse Recipes"
          />
          <h3>Browse Recipes</h3>
          <p>Search, filter, and explore hundreds of recipes.</p>
        </div>
        <div className="feature-card">
          <img
            src="https://media.istockphoto.com/id/1081422898/photo/pan-fried-duck.jpg?s=612x612&w=0&k=20&c=kzlrX7KJivvufQx9mLd-gMiMHR6lC2cgX009k9XO6VA="
            alt="Save Favorites"
          />
          <h3>Save Favorites</h3>
          <p>Create your personal recipe collection with your login.</p>
        </div>
        <div className="feature-card">
          <img
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80"
            alt="Find Restaurants"
          />
          <h3>Find Restaurants</h3>
          <p>Discover local restaurants with ratings and reviews.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <p>© 2025 FoodieFind | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;
