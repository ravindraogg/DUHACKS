require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema remains the same
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  industry: String,
  activeToken: {
    token: String,
    createdAt: Date
  }
});

// Updated Expense Schema with expenseType
const ExpenseSchema = new mongoose.Schema({
  username: String,
  userEmail: String,
  amount: Number,
  category: String,
  description: String,
  date: String,
  expenseType: {
    type: String,
    required: true,
    enum: [
      'Full Expense Tracker',
      'Business Expense Tracker',
      'Personal Expense Tracker',
      'Daily Expense Tracker',
      'Other Expenses'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);

// JWT and middleware functions remain the same
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.activeToken.token !== token) {
      return res.status(401).json({ 
        success: false, 
        message: "Token has been invalidated. Please login again." 
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, companyName, industry } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`Registration failed: User already exists (Email: ${email})`);
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ 
      name, 
      email, 
      password, 
      companyName, 
      industry,
      activeToken: { token: null, createdAt: null }
    });
    await newUser.save();

    // Generate new token
    const token = generateToken(newUser);

    // Save the token to user document
    newUser.activeToken = {
      token: token,
      createdAt: new Date()
    };
    await newUser.save();

    console.log(`New user registered: ${email}`);
    res.status(201).json({ 
      success: true, 
      message: "Registration successful",
      token,
      user: { name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found (Email: ${email})`);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      console.log(`Login failed: Invalid credentials (Email: ${email})`);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate new token
    const token = generateToken(user);

    // Invalidate old token and save new one
    user.activeToken = {
      token: token,
      createdAt: new Date()
    };
    await user.save();

    console.log(`User logged in: ${email}`);
    res.json({ 
      success: true, 
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Logout Route
app.post("/api/logout", verifyToken, async (req, res) => {
  try {
    // Invalidate the token
    const user = await User.findById(req.user.id);
    user.activeToken = { token: null, createdAt: null };
    await user.save();

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Check Auth Status
app.get("/api/auth-status", verifyToken, (req, res) => {
  res.json({ 
    success: true, 
    user: { name: req.user.name, email: req.user.email }
  });
});

// Add Expense
app.post("/api/expenses", verifyToken, async (req, res) => {
    try {
      const { expenses, expenseType } = req.body;
      if (!Array.isArray(expenses) || expenses.length === 0 || !expenseType) {
        console.log("Expense addition failed: Invalid expenses data or missing expense type");
        return res.status(400).json({ 
          success: false, 
          message: "Invalid expenses data or missing expense type" 
        });
      }
  
      const userExpenses = expenses.map(expense => ({
        ...expense,
        username: req.user.name,
        userEmail: req.user.email,
        expenseType,
        createdAt: new Date()
      }));
  
      await Expense.insertMany(userExpenses);
      console.log(`${expenseType} expenses added for user: ${req.user.name}`);
      res.status(201).json({ success: true, message: "Expenses added successfully" });
    } catch (err) {
      console.error("Error adding expenses:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  // Fetch Expenses by Type
  app.get("/api/expenses/:expenseType", verifyToken, async (req, res) => {
    try {
      const expenseType = decodeURIComponent(req.params.expenseType);
      const expenses = await Expense.find({ 
        username: req.user.name,
        expenseType: expenseType
      }).sort({ date: -1 });
  
      console.log(`${expenseType} expenses fetched for user: ${req.user.name}`);
      res.json({ success: true, expenses });
    } catch (err) {
      console.error("Error fetching expenses:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  // Fetch Recent Expenses (across all types)
  app.get("/api/expenses/recent", verifyToken, async (req, res) => {
    try {
      const expenses = await Expense.find({ username: req.user.name })
        .sort({ createdAt: -1 })
        .limit(5);
  
      console.log(`Recent expenses fetched for user: ${req.user.name}`);
      res.json({ success: true, expenses });
    } catch (err) {
      console.error("Error fetching recent expenses:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  // Submit Expenses for Analysis
  app.post("/api/expenses/analysis", verifyToken, async (req, res) => {
    try {
      const { expenseType, expenses } = req.body;
      
      // Here you can add your analysis logic
      // For now, we'll just return the expenses grouped by category
      const analysisSummary = await Expense.aggregate([
        {
          $match: {
            username: req.user.name,
            expenseType: expenseType
          }
        },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);
  
      res.json({ 
        success: true, 
        analysis: analysisSummary,
        message: "Analysis completed successfully" 
      });
    } catch (err) {
      console.error("Error analyzing expenses:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));