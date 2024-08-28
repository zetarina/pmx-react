import React from "react";

const MaintenancePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
      <p className="text-lg text-gray-600">
        This page is currently under maintenance. Please check back later.
      </p>
    </div>
  );
};

export default MaintenancePage;
