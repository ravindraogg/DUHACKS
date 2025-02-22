import { useState } from "react";
import "./expense.css"

const ExpenseTracker = () => {
  interface Expense {
    id: number;
    amount: number;
    category: string;
    description: string;
    date: string;
  }

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const addExpense = () => {
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
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
  };

  const getTotalExpense = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div className="expense-tracker-container">
      <h1>Expense Tracker</h1>

      {/* Expense Input Form */}
      <div className="expense-form">
        <input
          type="number"
          placeholder="Amount"
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

      {/* Expense Table */}
      <div className="expense-list">
        <h2>Expenses</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total Expense: ${getTotalExpense().toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default ExpenseTracker;
