import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import "./analysis.css";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisData {
  _id: string; // Category
  totalAmount: number;
  count: number;
}

const AnalysisPage = () => {
  const { expenseType } = useParams<{ expenseType: string }>();
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie">("bar"); // State for active chart
  const navigate = useNavigate();

  // Handle undefined expenseType
  if (!expenseType) {
    return (
      <div className="analysis-container">
        <h1>Error: Expense Type Not Found</h1>
        <p>Please go back to the dashboard and try again.</p>
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await axios.get(
          `https://duhacks-p6t6.onrender.com/api/expenses/analysis/${encodeURIComponent(expenseType)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAnalysisData(response.data.analysis);
          generateInsights(response.data.analysis); // Generate AI insights
        } else {
          throw new Error("Failed to fetch analysis data");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch analysis data";
        console.error("Failed to fetch analysis data:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [expenseType]);

  const generateInsights = async (data: AnalysisData[]) => {
    try {
      // Prepare data for AI analysis
      const categories = data.map((item) => item._id);
      const amounts = data.map((item) => item.totalAmount);

      // Call an AI API (e.g., OpenAI) to generate insights
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: `Provide financial insights for the following expense categories and amounts: ${categories.join(
          ", "
        )}. Total amounts: ${amounts.join(", ")}.`,
        max_tokens: 100,
      });

      setInsights(response.data.choices[0].text.trim());
    } catch (err) {
      console.error("Error generating insights:", err);
      setInsights("Unable to generate insights at this time.");
    }
  };

  // Generate random colors for each category
  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
  };

  // Data for Bar Chart
  const barChartData = {
    labels: analysisData.map((item) => item._id),
    datasets: [
      {
        label: "Total Amount",
        data: analysisData.map((item) => item.totalAmount),
        backgroundColor: generateColors(analysisData.length), // Unique colors for each category
        borderColor: analysisData.map(() => "rgba(0, 0, 0, 1)"), // Black borders
        borderWidth: 1,
      },
    ],
  };

  // Data for Line Chart
  const lineChartData = {
    labels: analysisData.map((item) => item._id),
    datasets: [
      {
        label: "Total Amount",
        data: analysisData.map((item) => item.totalAmount),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: analysisData.map((item) => item._id),
    datasets: [
      {
        label: "Total Amount",
        data: analysisData.map((item) => item.totalAmount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Expense Analysis for ${expenseType}`,
      },
    },
  };

  return (
    <div className="analysis-container">
      <h1>Expense Analysis: {expenseType}</h1>

      {loading && <p>Loading analysis data...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* Tabs for Chart Selection */}
          <div className="chart-tabs">
            <button
              className={`tab-button ${activeChart === "bar" ? "active" : ""}`}
              onClick={() => setActiveChart("bar")}
            >
              Bar Chart
            </button>
            <button
              className={`tab-button ${activeChart === "line" ? "active" : ""}`}
              onClick={() => setActiveChart("line")}
            >
              Line Chart
            </button>
            <button
              className={`tab-button ${activeChart === "pie" ? "active" : ""}`}
              onClick={() => setActiveChart("pie")}
            >
              Pie Chart
            </button>
          </div>

          {/* Render Active Chart */}
          <div className="chart-container">
            {activeChart === "bar" && <Bar data={barChartData} options={chartOptions} />}
            {activeChart === "line" && <Line data={lineChartData} options={chartOptions} />}
            {activeChart === "pie" && <Pie data={pieChartData} options={chartOptions} />}
          </div>

          {/* AI Insights */}
          <div className="insights-container">
            <h2>AI Insights</h2>
            {insights ? (
              <p>{insights}</p>
            ) : (
              <p>Generating insights...</p>
            )}
          </div>
        </>
      )}

      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default AnalysisPage;