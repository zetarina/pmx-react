import React from "react";
import { TrackingHistory } from "../models/Parcel";

interface TrackingHistoryProps {
  trackingHistory: TrackingHistory[] | undefined;
}

const TrackingHistoryComponent: React.FC<TrackingHistoryProps> = ({
  trackingHistory,
}) => {
  if (!trackingHistory || trackingHistory.length === 0) {
    return (
      <h4 className="text-2xl font-bold text-red-500 mb-6">Tracking Error</h4>
    );
  }

  return (
    <div className="mt-8 bg-white border border-gray-500 rounded-lg p-6">
      <h4 className="text-2xl font-bold text-gray-800 mb-6">
        Tracking History
      </h4>
      <ul className="relative border-l-4 border-blue-600 pl-4 space-y-6">
        {trackingHistory.map((history, index) => (
          <li key={index} className="relative">
            <div className="absolute left-0 top-1.5 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
            <div className="ml-8">
              <p className="text-lg text-gray-700">
                <span className="font-medium">Status:</span> {history.status}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Date:</span>{" "}
                {new Date(history.timestamp).toLocaleString()}
              </p>
              {history.warehouse && (
                <p className="text-lg text-gray-700">
                  <span className="font-medium">Warehouse:</span>{" "}
                  {history.warehouse.name} (
                  {history.warehouse.location.city?.name},{" "}
                  {history.warehouse.location.country?.name})
                </p>
              )}
              {history.driver && (
                <p className="text-lg text-gray-700">
                  <span className="font-medium">Driver:</span>{" "}
                  {history.driver.username}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackingHistoryComponent;
