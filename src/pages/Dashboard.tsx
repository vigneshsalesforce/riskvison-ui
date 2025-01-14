import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSpinner } from "../context/SpinnerContext";

type Metric = {
  name: string;
  value: string;
};

type ChartData = {
  name: string;
  value: number;
};

const Dashboard = () => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      showSpinner(); // Show spinner while data is being fetched

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Set dynamic data (could be fetched from an API)
        setMetrics([
          { name: "Total Accounts", value: "120" },
          { name: "Active Assessments", value: "25" },
          { name: "Pending Actions", value: "8" },
          { name: "Completed This Month", value: "45" },
        ]);

        setChartData([
          { name: "Jan", value: 400 },
          { name: "Feb", value: 300 },
          { name: "Mar", value: 600 },
          { name: "Apr", value: 800 },
          { name: "May", value: 500 },
          { name: "Jun", value: 700 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        hideSpinner(); // Ensure spinner is hidden after data is loaded
      }
    };

    fetchData();
  }, [showSpinner, hideSpinner]); // Safe dependency array with stable references

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <section
        aria-labelledby="metrics-section"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            key={metric.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                {metric.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {metric.value}
              </dd>
            </div>
          </article>
        ))}
      </section>

      {/* Bar Chart Section */}
      <section
        aria-labelledby="assessment-trends-section"
        className="bg-white shadow rounded-lg p-6"
      >
        <h3
          id="assessment-trends-section"
          className="text-lg font-medium text-gray-900 mb-4"
        >
          Assessment Trends
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;