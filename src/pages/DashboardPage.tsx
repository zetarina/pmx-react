import React from "react";
import { Helmet } from "react-helmet-async";
import Page from "../components/Page";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import { FaFileAlt, FaUserPlus, FaBoxOpen } from "react-icons/fa"; // Updated import from react-icons/fa

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  // Dummy data for the line chart
  const lineChartData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1), // Days 1 to 31
    datasets: [
      {
        label: "Delivered",
        data: [
          5, 10, 15, 20, 10, 5, 25, 30, 25, 20, 15, 10, 15, 20, 25, 30, 25, 20,
          15, 10, 15, 20, 25, 30, 25, 20, 15, 10, 5, 10, 15,
        ],
        borderColor: "#4A90E2", // Blue
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Rescheduled",
        data: [
          3, 5, 7, 9, 5, 3, 10, 15, 12, 9, 7, 5, 7, 9, 11, 15, 12, 9, 7, 5, 7,
          9, 11, 15, 12, 9, 7, 5, 3, 5, 7,
        ],
        borderColor: "#F5A623", // Orange
        backgroundColor: "rgba(245, 166, 35, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Canceled",
        data: [
          2, 3, 4, 3, 2, 2, 5, 7, 6, 4, 3, 2, 4, 3, 4, 7, 6, 4, 3, 2, 4, 3, 4,
          7, 6, 4, 3, 2, 2, 3, 4,
        ],
        borderColor: "#E74C3C", // Red
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Parcel Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Page title="Dashboard">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="mb-8 fixed bottom-0 right-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/report"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-center flex items-center justify-center"
          >
            <FaFileAlt className="mr-2" />
          </Link>
          <Link
            to="/dashboard/user/create"
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-center flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" />
          </Link>
          <Link
            to="/dashboard/parcel"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 text-center flex items-center justify-center"
          >
            <FaBoxOpen className="mr-2" />
          </Link>
        </div>
      </div>
      <div className="w-full container overflow-hidden p-8">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-4xl font-semibold mb-6 text-gray-900">
            Dashboard
          </h1>

          {/* Second UI: Completed, Delivered, In Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-green-800">
                On The Way
              </h2>
              <p className="text-gray-700 text-lg">Total: 567</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                Delivered
              </h2>
              <p className="text-gray-700 text-lg">Total: 678</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
                In Warehouse
              </h2>
              <p className="text-gray-700 text-lg">Total: 234</p>
            </div>
          </div>

          {/* Graphical Representation */}
          <div className="bg-white border p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">
              Parcel Delivery Status
            </h2>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>

          {/* Blank Section for Future UI */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Future Data Placeholder
            </h2>
            <p className="text-gray-700">Content coming soon...</p>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DashboardPage;
