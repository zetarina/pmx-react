import React from "react";
import TrackingHistoryComponent from "./TrackingHistoryComponent";
import { Parcel } from "../models/Parcel";

interface ParcelDetailComponentProps {
  parcel: Parcel | null;
}

const ParcelDetailComponent: React.FC<ParcelDetailComponentProps> = ({
  parcel,
}) => {
  if (!parcel) {
    return (
      <p className="text-lg text-gray-500">
        No parcel found. Please try again.
      </p>
    );
  }

  return (
    <div className="bg-white shadow-md border border-gray-500 rounded-lg p-6 mb-6">
      {parcel.parcelId && (
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Parcel ID: {parcel.parcelId}
        </h3>
      )}
      <div className="space-y-4">
        <p className="text-lg text-gray-700">
          <span className="font-medium">Current Status: </span>
          {parcel.status}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Receiver: </span>
          {parcel.receiver.name}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Receiver Phone Number: </span>
          {parcel.receiver.phoneNumber}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Receiver Address: </span>
          {parcel.receiver.address}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Delivery Fees: </span>
          {parcel.deliveryFees} MMK
        </p>
      </div>
      <TrackingHistoryComponent trackingHistory={parcel.trackingHistory} />
    </div>
  );
};

export default ParcelDetailComponent;
