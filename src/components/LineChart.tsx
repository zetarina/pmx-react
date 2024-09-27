import React from "react";
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

interface LineChartProps {
  data: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  };
  height?: number; // Optional prop to set the height
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 400 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart takes up the full width
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
    <div style={{ height: `${height}px`, width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
