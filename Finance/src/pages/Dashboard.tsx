import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Dashboard.css";

const AfterLoginPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle navigation to ExpenseTracker
  const goToExpenseTracker = (featureName: string) => {
    // Convert feature name into a URL-friendly format
    const formattedFeature = featureName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/expense/${formattedFeature}`);
  };

  return (
    <div className="after-login-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="website-name">Du Hacks</h1>
        </div>
        <div className="navbar-right">
          <button className="hamburger-button" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </nav>

      {/* Floating Sidebar */}
      <div className={`floating-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          {[
            "Full Expense Tracker",
            "Business Expense Tracker",
            "Personal Expense Tracker",
            "Daily Expense Tracker",
            "AI Recommendations",
            "Other Expenses",
          ].map((feature) => (
            <li key={feature} onClick={() => goToExpenseTracker(feature)}>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Section */}
      <div className="main-section">
        <div className="analysis-icon">
          <img src="analysis-icon.png" alt="Analysis Icon" />
        </div>
        <div className="feature-cards">
          {[
            { name: "Full Expense Tracker", img: "expense-tracker.jpg" },
            { name: "Business Expense Tracker", img: "business-expense.jpg" },
            { name: "Personal Expense Tracker", img: "personal-expense.jpg" },
            { name: "Daily Expense Tracker", img: "daily-expense.jpg" },
            { name: "AI Recommendations", img: "ai-recommendations.jpg" },
            { name: "Other Expenses", img: "other-expenses.jpg" },
          ].map((feature) => (
            <div
              className="feature-card"
              key={feature.name}
              onClick={() => goToExpenseTracker(feature.name)}
            >
              <img src={feature.img} alt={feature.name} className="card-image" />
              <h2>{feature.name}</h2>
              <p>Track and analyze your {feature.name.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AfterLoginPage;