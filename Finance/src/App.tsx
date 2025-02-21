import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register"; // Import the Register component
import Login from "./pages/Login";
import Home from "./pages/home";
import AfterLoginPage from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<AfterLoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
