import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"; // make sure file exists
import LoginPage from "./LoginPage";
import RecipesPage from "./RecipesPage";
import RestaurantsPage from "./RestaurantsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
