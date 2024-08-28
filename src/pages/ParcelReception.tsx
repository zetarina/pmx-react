import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  removeParcelFromCart,
  selectWarehouse,
  submitCart,
  addParcelToCart,
  clearCart,
} from "../store/slices/cartSlice";
import { fetchParcelByParcelId } from "../store/slices/parcelSlice";
import { fetchWarehouses } from "../store/slices/warehouseSlice";
import Page from "../components/Page";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const ParcelReception: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { parcels, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  const { warehouses } = useSelector((state: RootState) => state.warehouses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [canClickYes, setCanClickYes] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivId = "html5qr-code-full-region";
  const isInitialized = useRef(false);
  const [loadingState, setLoadingState] = useState(false);
  const [scannedParcelId, setScannedParcelId] = useState<string | null>(null);
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

  // Trigger the API call when scannedParcelId changes
  useEffect(() => {
    if (scannedParcelId) {
      const handleApiCall = async () => {
        setLoadingState(true);

        try {
          const response = await dispatch(
            fetchParcelByParcelId(scannedParcelId)
          );

          if (fetchParcelByParcelId.fulfilled.match(response)) {
            dispatch(addParcelToCart(response.payload.data));
            toast.success("Parcel added to cart successfully.");
          } else {
            toast.error("Parcel not found.");
          }
        } catch (error) {
          toast.error("Error fetching parcel.");
          console.error("Error:", error);
        }

        setLoadingState(false);
      };

      handleApiCall();
    }
  }, [scannedParcelId, dispatch]);

  const onNewScanResult = useCallback(
    (decodedText: string) => {
      const parcelId = decodedText.split("/").pop() || "";

      if (parcelId.length !== 8) {
        toast.error("Invalid QR.");
        return;
      }

      if (parcelId !== scannedParcelId) {
        setScannedParcelId(parcelId); // Update the state with the new Parcel ID
      } else {
        console.log("Duplicate scan ignored");
      }
    },
    [scannedParcelId]
  );

  useEffect(() => {
    if (
      !scannerRef.current &&
      document.getElementById(scannerDivId) &&
      !isInitialized.current
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
  }, [onNewScanResult]);

  const qrCodeErrorCallback = (errorMessage: string) => {
    const ignoredErrors = [
      "QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.",
      "QR code parse error, error = FormatException: Could not decode QR Code",
    ];
    if (!ignoredErrors.includes(errorMessage)) {
      console.error(`QR Code error: ${errorMessage}`);
    }
  };

  const handleRemove = (parcelId: string) => {
    dispatch(removeParcelFromCart(parcelId));
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

  const handleConfirm = () => {
    if (!selectedWarehouse) {
      toast.error("No warehouse selected.");
      return;
    }

    const parcelIds = parcels.map((parcel) => parcel._id as string);

    dispatch(
      submitCart({ parcels: parcelIds, warehouseId: selectedWarehouse! })
    )
      .unwrap()
      .then(() => {
        setTimeout(() => {
          toast.success("Parcels submitted successfully.");
          handleModalClose();
        }, 1000);
      })
      .catch((err) => {
        setTimeout(() => {
          toast.error("Failed to submit parcels.");
          console.error("Submission Error:", err);
        }, 1000);
      });
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsCheckboxChecked(false);
    setCanClickYes(false);
  };

  return (
    <Page title="Parcel Reception">
      <div className="flex flex-col lg:flex-row w-full h-[85vh]">
        <div className="lg:w-1/3 w-full flex flex-col items-stretch justify-center p-4 h-full">
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
          <div
            id={scannerDivId}
            className="bg-white shadow-lg rounded-lg w-full h-auto"
          ></div>
        </div>
        <div className="lg:w-2/3 w-full p-4 h-full flex flex-col">
          <div className="shadow-lg rounded-lg border w-full h-full flex flex-col justify-between">
            {parcels.length === 0 ? (
              <div className="flex items-center justify-center p-4 w-full h-full">
                <p className="text-gray-600">No parcels in cart.</p>
              </div>
            ) : (
              <div className="flex flex-col p-4 overflow-y-auto">
                <ul className="mb-4">
                  {parcels.map((parcel) => {
                    if (!parcel) {
                      return null;
                    }

                    return (
                      <li
                        key={parcel._id}
                        className="flex justify-between items-center p-2 bg-white shadow mb-2 rounded"
                      >
                        <div className="flex flex-col">
                          <span>
                            {parcel.parcelId} -{" "}
                            {parcel.receiver?.name || "Unknown Receiver"}
                          </span>
                          <span className="text-gray-500">
                            Delivery Fees: {parcel.deliveryFees} MMK
                          </span>
                          <span className="text-gray-500">
                            Payment Type: {parcel.paymentType}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemove(parcel._id as string)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="flex flex-col border-t border-gray-300 p-4 mt-4 bg-white shadow-md rounded-lg">
              <div className="w-full text-lg font-semibold text-gray-700 mb-2">
                Total Parcels: {parcels.length}
              </div>
              <div className="w-full flex justify-between items-center">
                <button
                  onClick={handleClearCart}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading || parcels.length === 0}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ${
                    loading || parcels.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
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

export default ParcelReception;
