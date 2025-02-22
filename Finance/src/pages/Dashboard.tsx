import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AfterLoginPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goToExpenseTracker = (featureName: string) => {
    const formattedFeature = featureName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/expense/${formattedFeature}`);
  };

  return (
    <div className="after-login-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="website-name">Cost-Sage</h1>
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
        <div className="feature-cards">
          {[
            { name: "Full Expense Tracker", img: "src/assets/expense-tracker.png" ,},
            { name: "Business Expense Tracker", img: "src/assets/business-expense.png" },
            { name: "Personal Expense Tracker", img: "src/assets/personal-expense.png" },
            { name: "Daily Expense Tracker", img: "src/assets/daily-expense.png" },
            { name: "Other Expenses", img: "src/assets/other-expenses.png" },
          ].map((feature) => (
            <div className="feature-card" key={feature.name} onClick={() => goToExpenseTracker(feature.name)}>
  <img src={feature.img} alt={feature.name} className="card-image" />
  <div className="card-content">
    <h2>{feature.name}</h2>
    <p>Track and analyze your {feature.name.toLowerCase()}.</p>
  </div>
</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AfterLoginPage;