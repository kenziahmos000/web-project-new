import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import RestaurantsPage from "./pages/RestaurantsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
