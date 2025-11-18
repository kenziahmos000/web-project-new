const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/auth");

// Helper to fetch the user with populated favorites to keep responses consistent
const getUserWithFavorites = async (userId) => {
  return await User.findById(userId).populate({
    path: "favorites",
    select: "title description image rating userEmail userId createdAt",
  });
};

// Require authentication for every favorites route
router.use(authMiddleware);

// GET /api/favorites - return the logged-in user's favorites with recipe info
router.get("/", async (req, res) => {
  try {
    const user = await getUserWithFavorites(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
      },
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching favorites",
      error: error.message,
    });
  }
});

// POST /api/favorites/:recipeId - add a recipe to the user's favorites
router.post("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyFavorite = user.favorites.some(
      (fav) => fav.toString() === recipeId
    );

    if (alreadyFavorite) {
      const populatedUser = await getUserWithFavorites(req.user.userId);
      return res.status(200).json({
        success: true,
        message: "Recipe already in favorites",
        user: {
          id: populatedUser._id,
          email: populatedUser.email,
        },
        favorites: populatedUser.favorites,
      });
    }

    user.favorites.push(recipeId);
    await user.save();

    const updatedUser = await getUserWithFavorites(req.user.userId);

    res.status(201).json({
      success: true,
      message: "Recipe added to favorites",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
      },
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error adding favorite",
      error: error.message,
    });
  }
});

// DELETE /api/favorites/:recipeId - remove a recipe from favorites
router.delete("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const initialCount = user.favorites.length;
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== recipeId
    );

    if (user.favorites.length === initialCount) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found in favorites",
      });
    }

    await user.save();
    const updatedUser = await getUserWithFavorites(req.user.userId);

    res.json({
      success: true,
      message: "Recipe removed from favorites",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
      },
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error removing favorite",
      error: error.message,
    });
  }
});

module.exports = router;
