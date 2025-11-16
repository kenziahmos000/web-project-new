const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/auth");
const upload = require("../config/upload");

// Get all recipes (public - no auth required)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipes",
      error: error.message,
    });
  }
});

// Get a single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipe",
      error: error.message,
    });
  }
});

// Create a new recipe (requires authentication)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Determine image path - either uploaded file or URL
    let imagePath = "/assets/default-recipe.jpg";
    if (req.file) {
      // If file was uploaded, use the uploaded file path
      imagePath = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      // If URL was provided, use the URL
      imagePath = imageUrl;
    }

    // Create new recipe
    const recipe = new Recipe({
      title,
      description,
      image: imagePath,
      userId: req.user.userId,
      userEmail: req.user.email,
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error creating recipe",
      error: error.message,
    });
  }
});

// Update a recipe (requires authentication and ownership)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, imageUrl, removeImage } = req.body;
    const fs = require("fs");
    const path = require("path");

    // Find the recipe
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Check if user owns this recipe
    if (recipe.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own recipes",
      });
    }

    // Update recipe fields
    if (title) recipe.title = title;
    if (description) recipe.description = description;

    // Handle image update/removal
    const oldImage = recipe.image;

    if (removeImage === "true") {
      // User wants to remove the image - set to default
      recipe.image = "/assets/default-recipe.jpg";

      // Delete old uploaded image file if it exists
      if (oldImage && oldImage.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "..", oldImage);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } else if (req.file) {
      // New file uploaded
      recipe.image = `/uploads/${req.file.filename}`;

      // Delete old uploaded image file if it exists
      if (oldImage && oldImage.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "..", oldImage);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } else if (imageUrl) {
      // URL provided
      recipe.image = imageUrl;

      // Delete old uploaded image file if it exists
      if (oldImage && oldImage.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "..", oldImage);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await recipe.save();

    res.json({
      success: true,
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error updating recipe",
      error: error.message,
    });
  }
});

// Delete a recipe (requires authentication and ownership)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    // Find the recipe
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Check if user owns this recipe
    if (recipe.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own recipes",
      });
    }

    // Delete uploaded image file if it exists
    if (recipe.image && recipe.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", recipe.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting recipe",
      error: error.message,
    });
  }
});

module.exports = router;
