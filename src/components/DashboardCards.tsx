import React from "react";

interface DashboardCardsProps {
  onTheWayTotal: number;
  deliveredTotal: number;
  inWarehouseTotal: number;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  onTheWayTotal,
  deliveredTotal,
  inWarehouseTotal,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          On The Way
        </h2>
        <p className="text-gray-700 text-lg">Total: {onTheWayTotal}</p>
      </div>
      <div className="bg-green-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-green-500">Delivered</h2>
        <p className="text-gray-700 text-lg">Total: {deliveredTotal}</p>
      </div>
      <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-500">
          In Warehouse
        </h2>
        <p className="text-gray-700 text-lg">Total: {inWarehouseTotal}</p>
      </div>
    </div>
  );
};

export default DashboardCards;
