
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCogs, faRocket, faShieldAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import Footer from "./Footer"
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Cost-Sage</h1>
        </div>
        <div className="navbar-links">
          <button className="login-button" onClick={() => navigate("/login")}>
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
  <h2>Welcome to <span className="brand-highlight">Cost-Sage</span></h2>
  <p>Your ultimate platform for cost-cutting strategies and AI-driven financial planning.</p>
  <button className="get-started-button" onClick={() => navigate("/register")}>
    <FontAwesomeIcon icon={faRocket} /> Get Started
  </button>
</div>

      {/* Features Section */}
      <div className="features-section">
        <h3>Why Choose Cost-Sage?</h3>
        <div className="features-grid">
          <div className="feature">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
            <h4>AI-Powered Insights</h4>
            <p>Get actionable insights to optimize your spending and savings.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faCogs} className="feature-icon" />
            <h4>Streamlined Workflows</h4>
            <p>Automate and simplify your financial processes.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
            <h4>Secure & Reliable</h4>
            <p>Your data is safe with our advanced security measures.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;