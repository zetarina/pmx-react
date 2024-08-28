import React from "react";
import { User } from "../models/User";
import DriverParcelTable from "./DriverParcelTable";
import { Parcel } from "../models/Parcel";

interface DriverInfoProps {
  driver: User;
  parcels: Parcel[];
  loadingState: boolean;
  onSubmit: () => void;
  disabledSubmit: boolean;
  submitClassName: string;
}

const DriverInfo: React.FC<DriverInfoProps> = ({
  driver,
  parcels,
  loadingState,
  onSubmit,
  disabledSubmit,
  submitClassName,
}) => {
  const totalFees = parcels
    .filter(
      (parcel) =>
        parcel.paymentType === "Pay by Sender" && parcel.status === "Delivered"
    )
    .reduce((total, parcel) => total + parcel.deliveryFees, 0);

  return (
    <div className="bg-white shadow-lg border border-gray-400 rounded-lg w-full h-full p-4 flex flex-col">
      <div className="w-full flex flex-wrap mb-8">
        <p className="text-lg font-semibold w-full">
          Driver: {driver.username}
        </p>
        <p className="text-sm text-gray-600 w-full">Email: {driver.email}</p>
      </div>

      <DriverParcelTable parcels={parcels} />

      <div className="flex justify-between items-center p-4">
        {totalFees > 0 && (
          <>
            <span className="font-semibold text-lg">
              Total Fees:
              <span className="font-semibold text-lg text-green-500 ml-2">
                {totalFees} MMK
              </span>
            </span>
          </>
        )}
        <button
          disabled={disabledSubmit}
          onClick={onSubmit}
          className={submitClassName}
        >
          {loadingState ? "Processing..." : "Submit"}
        </button>
      </div>

      {loadingState && (
        <p className="text-red-500 text-sm mt-2">Processing...</p>
      )}
    </div>
  );
};

export default DriverInfo;
