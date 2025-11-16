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
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Fresh romaine with Caesar dressing and croutons.",
    image: "/assets/Recipe2.jpg",
  },
  {
    id: 3,
    name: "Margherita Pizza",
    description: "Tomato, mozzarella, and fresh basil.",
    image: "/assets/Recipe3.jpg",
  },
  {
    id: 4,
    name: "Sushi Platter",
    description: "Variety of fresh sushi rolls.",
    image: "/assets/Recipe4.jpg",
  },
  {
    id: 5,
    name: "Chicken Tikka Masala",
    description: "Spicy and creamy Indian chicken curry.",
    image: "/assets/Recipe5.jpg",
  },
  {
    id: 6,
    name: "Beef Burger",
    description: "Juicy beef patty with cheese and veggies.",
    image: "/assets/Recipe6.jpg",
  },
  {
    id: 7,
    name: "Pancakes",
    description: "Fluffy pancakes with maple syrup.",
    image: "/assets/recipe7.jpg",
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "Rich and moist chocolate delight.",
    image: "/assets/Recipe8.jpg",
  },
  {
    id: 9,
    name: "Grilled Salmon",
    description: "Perfectly grilled salmon with herbs.",
    image: "/assets/Recipe9.jpg",
  },
];

const RecipesPage = () => {
  const [search, setSearch] = useState("");

  // Filter recipes based on search
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipes-page">
      <h1>Recipes</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* Recipe cards */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
