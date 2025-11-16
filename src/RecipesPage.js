// src/pages/RecipesPage.js
import React, { useState } from "react";
import "./RecipesPage.css";

// Recipe data
const recipes = [
  {
    id: 1,
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta with meat sauce.",
    image: "/Assets/Recipe1.jpg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Fresh romaine with Caesar dressing and croutons.",
    image: "/Assets/Recipe2.JPG",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Margherita Pizza",
    description: "Tomato, mozzarella, and fresh basil.",
    image: "/Assets/Recipe3.jpg",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Sushi Platter",
    description: "Variety of fresh sushi rolls.",
    image: "/Assets/Recipe4.jpg",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Chicken Tikka Masala",
    description: "Spicy and creamy Indian chicken curry.",
    image: "/Assets/Recipe5.jpg",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Beef Burger",
    description: "Juicy beef patty with cheese and veggies.",
    image: "/Assets/Recipe6.jpg",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Pancakes",
    description: "Fluffy pancakes with maple syrup.",
    image: "/Assets/Recipe7.jpg",
    rating: 4.7,
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "Rich and moist chocolate delight.",
    image: "/Assets/Recipe8.jpg",
    rating: 4.9,
  },
  {
    id: 9,
    name: "Grilled Salmon",
    description: "Perfectly grilled salmon with herbs.",
    image: "/Assets/Recipe9.jpg",
    rating: 4.8,
  },
];

const RecipesPage = () => {
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipes-page">
      <h1>Discover Delicious Recipes</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <div className="recipe-image">
              <img src={recipe.image} alt={recipe.name} />
            </div>
            <div className="recipe-info">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <div className="rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.floor(recipe.rating) ? "filled" : ""}>
                    ★
                  </span>
                ))}
                <span className="rating-number">{recipe.rating.toFixed(1)}</span>
              </div>
              <button>View Recipe</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
