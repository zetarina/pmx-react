import React from "react";
import { Parcel } from "../models/Parcel";

interface DriverParcelTableProps {
  parcels: Parcel[];
}

const DriverParcelTable: React.FC<DriverParcelTableProps> = ({ parcels }) => {
  return (
    <div className="w-full flex flex-col items-center overflow-y-auto text-sm border border-gray-300 grow mb-4">
      {parcels.length > 0 ? (
        parcels.map((item: Parcel, index) => (
          <div
            key={index}
            className="w-full border-t border-gray-100 text-gray-600 py-4 px-6 block hover:bg-gray-100 transition duration-150"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-lg mr-1">
                  Package ID: {item.parcelId}
                </span>
              </div>
              <div>
                {item.paymentType === "Pay by Sender" &&
                  item.status === "Delivered" && (
                    <span className="font-semibold text-lg text-green-500">
                      {item.deliveryFees} MMK
                    </span>
                  )}
              </div>
            </div>
            <div className="w-full">
              <p className="text-gray-500 mb-2">
                Receiver: {item.receiver.name}
              </p>
              <p className="text-gray-500 mb-2">
                Payment Type: {item.paymentType}
              </p>
              <p className="text-gray-500 mb-2">Status: {item.status}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center text-center py-5 w-full h-full">
          <h3 className="font-medium text-gray-900">No Packages Found</h3>
        </div>
      )}
    </div>
  );
};

export default DriverParcelTable;
