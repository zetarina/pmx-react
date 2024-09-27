import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Page from "../components/Page";
import { Link } from "react-router-dom";
import { FaFileAlt, FaUserPlus, FaBoxOpen } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axiosInstance from "../api/axiosInstance";
import LineChart from "../components/LineChart";
import DashboardCards from "../components/DashboardCards";

// Define types for monthly data and totals
interface MonthlyData {
  day: number;
  delivered: number;
  rescheduled: number;
  warehouse: number;
}

interface Totals {
  onTheWay: number;
  delivered: number;
  inWarehouse: number;
}

// Define types for the chart data
interface ChartData {
  labels: number[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

const DashboardPage: React.FC = () => {
  const [lineChartData, setLineChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [onTheWayTotal, setOnTheWayTotal] = useState(0);
  const [deliveredTotal, setDeliveredTotal] = useState(0);
  const [inWarehouseTotal, setInWarehouseTotal] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get<{
          monthlyData: MonthlyData[];
          totals: Totals;
        }>("/dashboard");

        const { monthlyData, totals } = response.data;

        // Extract data for the line chart
        const labels = monthlyData.map((day) => day.day);
        const deliveredData = monthlyData.map((day) => day.delivered);
        const rescheduledData = monthlyData.map((day) => day.rescheduled);
        const warehouseData = monthlyData.map((day) => day.warehouse);

        setLineChartData({
          labels,
          datasets: [
            {
              label: "Delivered",
              data: deliveredData,
              borderColor: "#55CC55",
              backgroundColor: "rgba(74, 144, 226, 0.2)",
              fill: true,
              tension: 0.6,
            },
            {
              label: "Rescheduled",
              data: rescheduledData,
              borderColor: "#F5A623",
              backgroundColor: "rgba(245, 166, 35, 0.2)",
              fill: true,
              tension: 0.6,
            },
            {
              label: "Warehouse",
              data: warehouseData,
              borderColor: "#4A90E2",
              backgroundColor: "rgba(231, 76, 60, 0.2)",
              fill: true,
              tension: 0.6,
            },
          ],
        });

        // Set the totals
        setOnTheWayTotal(totals.onTheWay);
        setDeliveredTotal(totals.delivered);
        setInWarehouseTotal(totals.inWarehouse);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Page title="Dashboard">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="mb-8 fixed bottom-0 right-0 max-w-md w-full mx-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Link
            to="/dashboard/report"
            className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-center flex items-center justify-center"
            data-tooltip-id="report-tooltip"
          >
            <FaFileAlt />
          </Link>
          <Link
            to="/dashboard/user/create"
            className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-center flex items-center justify-center"
            data-tooltip-id="user-tooltip"
          >
            <FaUserPlus />
          </Link>
          <Link
            to="/dashboard/parcel"
            className="bg-yellow-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 text-center flex items-center justify-center"
            data-tooltip-id="parcel-tooltip"
          >
            <FaBoxOpen />
          </Link>
        </div>
        <ReactTooltip id="report-tooltip" place="top">
          Go to Reports
        </ReactTooltip>
        <ReactTooltip id="user-tooltip" place="top">
          Create a New User
        </ReactTooltip>
        <ReactTooltip id="parcel-tooltip" place="top">
          Manage Parcels
        </ReactTooltip>
      </div>

      <div className="w-full container mx-auto overflow-hidden p-8">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-4xl font-semibold mb-6 text-gray-900">
            Dashboard
          </h1>

          {/* Dashboard Cards */}
          <DashboardCards
            onTheWayTotal={onTheWayTotal}
            deliveredTotal={deliveredTotal}
            inWarehouseTotal={inWarehouseTotal}
          />

          {/* Line Chart */}
          <div className="bg-white border p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">
              Parcel Delivery Status
            </h2>
            <LineChart data={lineChartData} height={400} />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DashboardPage;
