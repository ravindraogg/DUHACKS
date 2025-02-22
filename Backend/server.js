require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust for frontend URL
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  industry: String,
});

// Expense Schema (Updated to include `username`)
const ExpenseSchema = new mongoose.Schema({
  username: String, // Added username field
  amount: Number,
  category: String,
  description: String,
  date: String,
});

const User = mongoose.model("User", UserSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, companyName, industry } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ name, email, password, companyName, industry });
    await newUser.save();

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ success: false, message: "User not found" });
  
      // Check password (no hashing, just direct comparison)
      if (user.password !== password) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      // Store user session
      req.session.user = { id: user._id, email: user.email, name: user.name };
  
      // Send username along with success response
      res.json({ success: true, message: "Login successful", username: user.name });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

// Logout Route
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Check Session
app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, message: "Not logged in" });
  }
});

// API Route to Add Expense (Now saves expenses with username)
app.post("/api/expenses", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { expenses } = req.body;
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid expenses data" });
    }

    // Attach the logged-in username to each expense
    const userExpenses = expenses.map(expense => ({
      ...expense,
      username: req.session.user.name,
    }));

    await Expense.insertMany(userExpenses);
    res.status(201).json({ success: true, message: "Expenses added successfully" });
  } catch (err) {
    console.error("Error adding expenses:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API Route to Fetch User's Expenses (Now fetches only logged-in user's expenses)
app.get("/api/expenses", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const expenses = await Expense.find({ username: req.session.user.name });
    res.json({ success: true, expenses });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
