import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

interface Expense {
  category: string;
  amount: number;
}

interface Recommendation {
  suggestion: string;
  impact: string;
}

const AfterLoginPage = () => {
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [personalExpenses, setPersonalExpenses] = useState<Expense[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<Expense[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    setExpenseData([
      { category: "Marketing", amount: 1200 },
      { category: "Operations", amount: 800 },
      { category: "IT Services", amount: 1500 },
      { category: "HR", amount: 600 },
    ]);
    setPersonalExpenses([
      { category: "Groceries", amount: 300 },
      { category: "Rent", amount: 1000 },
    ]);
    setDailyExpenses([
      { category: "Transport", amount: 50 },
      { category: "Coffee", amount: 5 },
    ]);

    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get("https://api.example.com/cost-cutting-ai");
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([
        "Switch to a budget supplier",
        "Automate repetitive tasks",
        "Negotiate bulk discounts",
      ]);
    }
  };

  return (
    <div className="after-login-container">
      <h1 className="page-title">Welcome to Du Hacks</h1>

      {/* Business Expenses Section */}
      <div className="section">
        <h2 className="section-title">Business Expenses</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={expenseData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personal Expenses Section */}
      <div className="section">
        <h2 className="section-title">Personal Expenses</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={personalExpenses}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#E53E3E" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Expenses Section */}
      <div className="section">
        <h2 className="section-title">Daily Expenses</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyExpenses}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#38A169" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="section">
        <h2 className="section-title">AI Cost-Saving Recommendations</h2>
        <ul className="recommendations-list">
          {recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AfterLoginPage;