import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
  expenseType: string;
}

const AfterLoginPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();

  const expenseTypes = [
    {
      name: "Full Expense Tracker",
      img: "src/assets/expense-tracker.png",
      description: "Track all your expenses in one place",
    },
    {
      name: "Business Expense Tracker",
      img: "src/assets/business-expense.png",
      description: "Manage your business-related expenses",
    },
    {
      name: "Personal Expense Tracker",
      img: "src/assets/personal-expense.png",
      description: "Keep track of your personal spending",
    },
    {
      name: "Daily Expense Tracker",
      img: "src/assets/daily-expense.png",
      description: "Monitor your daily expenditures",
    },
    {
      name: "Other Expenses",
      img: "src/assets/other-expenses.png",
      description: "Track miscellaneous expenses",
    },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchRecentExpenses();
  }, []);

  const fetchRecentExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/expenses/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setExpenses(response.data.expenses);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goToExpenseTracker = (featureName: string) => {
    const formattedFeature = featureName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/expense/${formattedFeature}`);
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="website-name">Cost-Sage</h1>
        </div>
        <div className="navbar-center">
          <span className="welcome-message">Welcome, {username}!</span>
        </div>
        <div className="navbar-right">
          <button className="hamburger-button" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </nav>

      <div className={`floating-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          {expenseTypes.map((feature) => (
            <li key={feature.name} onClick={() => goToExpenseTracker(feature.name)}>
              {feature.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-section">
        <div className="feature-cards">
          {expenseTypes.map((feature) => (
            <div
              className="feature-card"
              key={feature.name}
              onClick={() => goToExpenseTracker(feature.name)}
            >
              <img src={feature.img} alt={feature.name} className="card-image" />
              <div className="card-content">
                <h2>{feature.name}</h2>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-expenses">
          <h2>Recent Expenses Across All Categories</h2>
          <div className="expense-history">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map((expense, index) => (
                  <tr key={index}>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.expenseType}</td>
                    <td>{expense.description}</td>
                    <td>₹{expense.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterLoginPage;