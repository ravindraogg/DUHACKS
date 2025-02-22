import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register"; // Import the Register component
import Login from "./pages/Login";
import Home from "./pages/Home";
import AfterLoginPage from "./pages/Dashboard";
import ExpenseTrackingPage from "./pages/expense";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<AfterLoginPage />} />
        <Route path="/expense/:feature" element={<ExpenseTrackingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
