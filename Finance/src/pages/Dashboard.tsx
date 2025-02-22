import { useState } from "react";
import "./Dashboard.css";

const AfterLoginPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="after-login-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="website-name">Du Hacks</h1>
        </div>
        <div className="navbar-right ">
          <button className="hamburger-button" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </nav>

      {/* Floating Sidebar */}
      <div className={`floating-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <li>Full Expense Tracker</li>
          <li>Business Expense Tracker</li>
          <li>Personal Expense Tracker</li>
          <li>Daily Expense Tracker</li>
          <li>AI Recommendations</li>
          <li>Other Expenses</li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="main-section">
        <div className="analysis-icon">
          <img src="analysis-icon.png" alt="Analysis Icon" />
        </div>
        <div className="feature-cards">
          <div className="feature-card">
            <img src="expense-tracker.jpg" alt="Expense Tracker" className="card-image" />
            <h2>Full Expense Tracker</h2>
            <p>Track all your expenses in one place.</p>
          </div>
          <div className="feature-card">
            <img src="business-expense.jpg" alt="Business Expense" className="card-image" />
            <h2>Business Expense Tracker</h2>
            <p>Manage and analyze business expenses.</p>
          </div>
          <div className="feature-card">
            <img src="personal-expense.jpg" alt="Personal Expense" className="card-image" />
            <h2>Personal Expense Tracker</h2>
            <p>Keep track of your personal spending.</p>
          </div>
          <div className="feature-card">
            <img src="daily-expense.jpg" alt="Daily Expense" className="card-image" />
            <h2>Daily Expense Tracker</h2>
            <p>Monitor your daily expenses.</p>
          </div>
          <div className="feature-card">
            <img src="ai-recommendations.jpg" alt="AI Recommendations" className="card-image" />
            <h2>AI Recommendations</h2>
            <p>Get AI-driven cost-saving tips.</p>
          </div>
          <div className="feature-card">
            <img src="other-expenses.jpg" alt="Other Expenses" className="card-image" />
            <h2>Other Expenses</h2>
            <p>Track miscellaneous expenses.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterLoginPage;