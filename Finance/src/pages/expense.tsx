import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./expense.css";
import axios from "axios";

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  userEmail?: string;
  expenseType: string;
}

const ExpenseTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Get the expense type from the URL
  const expenseType = location.pathname
    .split("/")[2]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setUserEmail(storedEmail);

    fetchExpenses();
  }, [expenseType]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/expenses/${encodeURIComponent(expenseType)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setExpenses(response.data.expenses);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", (err as Error).message);
    }
  };

  const addExpense = async () => {
    if (!amount || !category || !description || !date) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      userEmail,
      expenseType,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/expenses",
        {
          expenses: [newExpense],
          username,
          userEmail,
          expenseType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setExpenses([...expenses, newExpense]);
        setAmount("");
        setCategory("");
        setDescription("");
        setDate("");
        console.log("Expense added successfully");
      }
    } catch (err) {
      console.error("Expense addition failed:", (err as Error).message);
    }
  };

  const getTotalExpense = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const submitForAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/expenses/analysis",
        {
          username,
          userEmail,
          expenseType,
          expenses: expenses.map((expense) => ({
            ...expense,
            userEmail,
            expenseType,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/analysis");
    } catch (error) {
      console.error("Error submitting data:", (error as Error).message);
    }
  };

  return (
    <div className="expense-container">
      <nav className="navbar">
        <h1 className="title">{expenseType}</h1>
        <span className="username">Welcome, {username}</span>
        <button className="back-button" onClick={() => window.history.back()}>
          ← Go Back
        </button>
      </nav>

      <div className="expense-content">
        <div className="expense-form">
          <h2>Add {expenseType} Expense</h2>
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={addExpense}>Add Expense</button>
        </div>

        <div className="expense-list">
          <h2>{expenseType} Expense List</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-expense">
            <h3>Total {expenseType} Expenses: ₹{getTotalExpense().toFixed(2)}</h3>
          </div>
        </div>
      </div>
      <NavLink to="/analysis">
        <button className="analysis-button" onClick={submitForAnalysis}>
          Analyze Expenses
        </button>
      </NavLink>
    </div>
  );
};

export default ExpenseTracker;