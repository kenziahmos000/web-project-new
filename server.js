const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/auth",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

// Schema & Model
const userSchema = new mongoose.Schema({ name: String, email: String, password: String });
const User = mongoose.model("User", userSchema);

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (user) {
      if (password === user.password) {
        res.send({ message: "login success.", user: user });
      } else {
        res.send({ message: "Login failed, wrong credentials." });
      }
    } else {
      res.send({ message: "User not found." });
    }
  });
});

// Register route
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (user) {
      res.send({ message: "User already exist." });
    } else {
      const newUser = new User({ name, email, password });
      newUser.save(err => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "User registered successfully." });
        }
      });
    }
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

