import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchUserById } from "../store/slices/userSlice";
import { fetchWarehouses } from "../store/slices/warehouseSlice";
import axiosInstance from "../api/axiosInstance";
import Page from "../components/Page";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import DriverInfo from "../components/DriverInfo";
import { User } from "../models/User";
import { Parcel } from "../models/Parcel";
import { useNavigate } from "react-router-dom";

const DriverReception: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { warehouses } = useSelector((state: RootState) => state.warehouses);
  const [selectedDriver, setSelectedDriver] = useState<User | null>(null);
  const [driverParcels, setDriverParcels] = useState<Parcel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [canClickYes, setCanClickYes] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivId = "html5qr-code-full-region";
  const isInitialized = useRef(false);
  const [loadingState, setLoadingState] = useState(false);
  const [scannedQrString, setScannedQrString] = useState<string | null>(null);

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  useEffect(() => {
    dispatch(fetchWarehouses({ page: 1, limit: 100, query }));
  }, [dispatch, query]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setCanClickYes(true);
      }, 5000);
    } else {
      setCanClickYes(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (scannedQrString) {
      const [userId, expirationTimeStr] = scannedQrString
        .split("|")
        .map((str) => str.trim());
      const expirationTime = new Date(expirationTimeStr);

      // Add a 15-second buffer to the expiration time
      expirationTime.setSeconds(expirationTime.getSeconds() + 15);

      // Get the current time
      const currentTime = new Date();

      // Check if the expirationTime is valid and hasn't passed
      if (
        !userId ||
        isNaN(expirationTime.getTime()) ||
        currentTime > expirationTime
      ) {
        toast.error("Driver QR code has expired or is invalid");
        setScannedQrString(null); // Reset to allow new scans
        return;
      }

      const handleApiCall = async () => {
        setLoadingState(true);

        try {
          const response = await dispatch(fetchUserById(userId));

          if (fetchUserById.fulfilled.match(response)) {
            setSelectedDriver(response.payload.data);
            const parcelsResponse = await axiosInstance.get(
              `/reception/driver/${userId}`
            );
            setDriverParcels(parcelsResponse.data.parcels || []);
            toast.success("Driver information loaded successfully.");
          } else {
            toast.error("Driver not found.");
          }
        } catch (error) {
          toast.error("Error fetching driver.");
          console.error("Error:", error);
        }

        setLoadingState(false);
      };

      handleApiCall();
    }
  }, [scannedQrString, dispatch]);

  const onNewScanResult = useCallback(
    (decodedText: string) => {
      if (selectedDriver) return;

      if (decodedText !== scannedQrString) {
        setScannedQrString(decodedText); // Update the state with the new QR string
      } else {
        console.log("Duplicate scan ignored");
      }
    },
    [selectedDriver, scannedQrString]
  );

  useEffect(() => {
    if (
      !scannerRef.current &&
      document.getElementById(scannerDivId) &&
      !isInitialized.current &&
      !selectedDriver
    ) {
      const config = {
        rememberLastUsedCamera: true,
        fps: 10,
        qrbox: 250,
        disableFlip: false,
      };
      scannerRef.current = new Html5QrcodeScanner(scannerDivId, config, false);
      scannerRef.current.render(onNewScanResult, qrCodeErrorCallback);
      isInitialized.current = true;
    }
  }, [onNewScanResult, selectedDriver]);

  const qrCodeErrorCallback = (errorMessage: string) => {
    const ignoredErrors = [
      "QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.",
      "QR code parse error, error = FormatException: Could not decode QR Code",
    ];
    if (!ignoredErrors.includes(errorMessage)) {
      console.error(`QR Code error: ${errorMessage}`);
    }
  };

  const handleWarehouseChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleSearchWarehouses = (query: string) => {
    setQuery(query);
  };

  const handleCheckout = () => {
    if (!selectedWarehouse) {
      toast.error("Please select a warehouse.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedWarehouse) {
      toast.error("No warehouse selected.");
      return;
    }

    const packageIds = driverParcels.map((pkg) => pkg._id);

    try {
      await axiosInstance.post(
        `/reception/driver/${selectedDriver?._id}/process`,
        {
          packageIds,
          warehouseId: selectedWarehouse,
        }
      );
      toast.success("Successfully processed driver deliveries.");
      handleRescan();
    } catch (error: any) {
      toast.error(
        `Error submitting driver data: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    setLoadingState(false);
    handleModalClose();
  };

  const handleRescan = () => {
    window.location.reload();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsCheckboxChecked(false);
    setCanClickYes(false);
  };

  return (
    <Page title="Driver Reception">
      <div className="flex flex-col lg:flex-row w-full h-[85vh]">
        {!selectedDriver && (
          <div className="w-full flex flex-col items-center justify-center p-4 h-full">
            <div
              id={scannerDivId}
              className="bg-white shadow-lg rounded-lg"
            ></div>
          </div>
        )}
        {selectedDriver && (
          <>
            <div className="lg:w-1/3 w-full flex flex-col p-4 h-full">
              <div className="shadow-lg rounded-lg w-full p-4 mb-6">
                <input
                  type="text"
                  placeholder="Search warehouses..."
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => handleSearchWarehouses(e.target.value)}
                />
                <select
                  value={selectedWarehouse || ""}
                  onChange={handleWarehouseChange}
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="shadow-lg rounded-lg w-full p-4 mb-6">
                <button
                  onClick={handleRescan}
                  className="bg-gray-500 text-white px-4 w-full py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Rescan Driver Qr
                </button>
              </div>
            </div>
            <div className="lg:w-2/3 w-full p-4 h-full flex flex-col">
              <div className="shadow-lg rounded-lg border w-full h-full flex flex-col justify-between">
                <DriverInfo
                  driver={selectedDriver}
                  parcels={driverParcels}
                  loadingState={loadingState}
                  onSubmit={handleCheckout}
                  disabledSubmit={
                    loadingState || !selectedWarehouse || !selectedDriver
                  }
                  submitClassName={`bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ${
                    loadingState || !selectedWarehouse || !selectedDriver
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal title="Confirm Submission" onClose={handleModalClose}>
          <p>Are you sure you want to submit these parcels?</p>
          <div className="mt-4">
            <label>
              <input
                type="checkbox"
                checked={isCheckboxChecked}
                onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
              />{" "}
              I confirm the details are correct.
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={!isCheckboxChecked || !canClickYes}
              className={`bg-green-500 text-white py-2 px-4 rounded ${
                !isCheckboxChecked || !canClickYes
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
              }`}
            >
              {canClickYes ? "Yes, Submit" : "Please wait..."}
            </button>
            <button
              onClick={handleModalClose}
              className="bg-gray-500 text-white py-2 px-4 rounded ml-2 hover:bg-gray-600"
            >
              No, Cancel
            </button>
          </div>
        </Modal>
      )}
    </Page>
  );
};

export default DriverReception;
