// src/pages/RecipesPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecipesPage.css";

const RecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const API_URL = "http://localhost:5001/api";

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsLoggedIn(true);
            setCurrentUserId(data.user.id);
          }
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        });
    }
  }, []);

  // Fetch recipes from backend
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`);
      const data = await response.json();
      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  // Filter recipes based on search
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  // Open modal for adding new recipe
  const handleAddRecipe = () => {
    setIsEditing(false);
    setFormData({ id: "", title: "", description: "", imageUrl: "" });
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(false);
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  // Open modal for editing recipe
  const handleEditRecipe = (recipe) => {
    setIsEditing(true);

    // Construct full image URL for preview
    let imageUrl;
    if (recipe.image.startsWith("http")) {
      // External URL
      imageUrl = recipe.image;
    } else if (recipe.image.startsWith("/assets/")) {
      // Default image from frontend public folder
      imageUrl = recipe.image;
    } else {
      // Uploaded image from backend
      imageUrl = `http://localhost:5001${recipe.image}`;
    }

    setFormData({
      id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.image.startsWith("http") ? recipe.image : "",
      currentImage: recipe.image,
    });
    setImageFile(null);
    setImagePreview(imageUrl);
    setRemoveImage(false);
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: "" }); // Clear URL when file is selected
      setRemoveImage(false); // Reset remove flag when new file is selected
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const url = isEditing
        ? `${API_URL}/recipes/${formData.id}`
        : `${API_URL}/recipes`;
      const method = isEditing ? "PUT" : "POST";

      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);

      // Handle image removal/update
      if (removeImage) {
        formDataToSend.append("removeImage", "true");
      } else if (imageFile) {
        formDataToSend.append("image", imageFile);
      } else if (formData.imageUrl) {
        formDataToSend.append("imageUrl", formData.imageUrl);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          isEditing
            ? "Recipe updated successfully!"
            : "Recipe created successfully!"
        );
        fetchRecipes(); // Refresh the list
        setTimeout(() => {
          setShowModal(false);
          setFormData({ id: "", title: "", description: "", imageUrl: "" });
          setImageFile(null);
          setImagePreview("");
        }, 1500);
      } else {
        setError(data.message || "Failed to save recipe");
      }
    } catch (err) {
      setError("Network error. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Delete recipe
  const handleDelete = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        fetchRecipes(); // Refresh the list
      } else {
        alert(data.message || "Failed to delete recipe");
      }
    } catch (err) {
      alert("Network error. Please check if the backend is running.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setCurrentUserId(null);
    window.location.href = "/";
  };

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>Recipes</h1>
        {isLoggedIn && (
          <button className="btn-add-recipe" onClick={handleAddRecipe}>
            + Add Your Recipe
          </button>
        )}
      </div>

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
        {/* Skeleton loader while saving */}
        {loading && (
          <div className="recipe-card skeleton-card">
            <div className="skeleton skeleton-image"></div>
            <div className="recipe-content">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-author"></div>
            </div>
          </div>
        )}

        {filteredRecipes.map((recipe) => {
          // Construct full image URL
          let imageUrl;
          if (recipe.image.startsWith("http")) {
            // External URL
            imageUrl = recipe.image;
          } else if (recipe.image.startsWith("/assets/")) {
            // Default image from frontend public folder
            imageUrl = recipe.image;
          } else {
            // Uploaded image from backend
            imageUrl = `http://localhost:5001${recipe.image}`;
          }

          return (
            <div
              className="recipe-card"
              key={recipe._id}
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={imageUrl} alt={recipe.title} />
              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <small className="recipe-author">By: {recipe.userEmail}</small>

                {/* Show edit/delete buttons only for user's own recipes */}
                {isLoggedIn && recipe.userId === currentUserId && (
                  <div className="recipe-actions">
                    <button
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRecipe(recipe);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(recipe._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <p className="no-recipes">
          {search
            ? "No recipes found matching your search"
            : "No recipes yet. Be the first to add one!"}
        </p>
      )}

      {/* Modal for Add/Edit Recipe */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Recipe" : "Add New Recipe"}</h2>

            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Recipe Title *</label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g., Chocolate Chip Cookies"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  placeholder="Describe your recipe..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageFile">Upload Image</label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <small>Upload from your computer (max 5MB)</small>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setFormData({ ...formData, imageUrl: "" });
                      setRemoveImage(true);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <div className="form-divider">
                <span>OR</span>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input
                  type="text"
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                      setImageFile(null);
                      setRemoveImage(false);
                    }
                  }}
                />
                <small>Or paste an image URL</small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Recipe"
                    : "Add Recipe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
