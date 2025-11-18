const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const favoritesRoutes = require("./routes/favorites");

const app = express();
const PORT = 5001;

// MongoDB Configuration - Update this with your MongoDB connection string
const MONGODB_URI =
  "mongodb+srv://muhamedhatem1_db_user:Vk332UabADgVx1cA@cluster0.3k1xn74.mongodb.net/?appName=Cluster0";
const JWT_SECRET =
  "571046f0eebe65d2263e36e3b306286bbb0803bac672af4257089a245055c56d13f289a04d77ae202bdf9f2dcdf3795bea997013307e0b8b5334df0729084cda";

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
      },
      recipes: {
        getAll: "GET /api/recipes",
        getOne: "GET /api/recipes/:id",
        create: "POST /api/recipes (requires auth)",
        update: "PUT /api/recipes/:id (requires auth)",
        delete: "DELETE /api/recipes/:id (requires auth)",
      },
      favorites: {
        getAll: "GET /api/favorites (requires auth)",
        add: "POST /api/favorites/:recipeId (requires auth)",
        remove: "DELETE /api/favorites/:recipeId (requires auth)",
      },
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoritesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
