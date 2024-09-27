import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import unauthenticatedAxiosInstance from "../api/unauthenticatedAxiosInstance";
import { Parcel } from "../models/Parcel";
import TrackingHistoryComponent from "../components/TrackingHistoryComponent";
import ParcelDetailComponent from "../components/ParcelDetailComponent";

const ParcelSearchPage: React.FC = () => {
  const [parcelId, setParcelId] = useState("");
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [isFetching, setIsFetching] = useState(false); // Add fetching state to prevent duplicate requests
  const { parcelId: paramParcelId } = useParams<{ parcelId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (paramParcelId && !isFetching) {
      setParcelId(paramParcelId);
      fetchParcel(paramParcelId);
    }
  }, [paramParcelId]);

  const fetchParcel = async (id: string) => {
    if (isFetching) return;
    
    setIsFetching(true); // Start fetching
    try {
      const response = await unauthenticatedAxiosInstance.get(`/parcelId/${id}`);
      setParcel(response.data);
    } catch (error: any) {
      toast.error("Error fetching parcel");
      console.error(error);
    } finally {
      setIsFetching(false); // End fetching
    }
  };

  const handleSearch = () => {
    if (parcelId && !isFetching) {
      navigate(`/tracking/${parcelId}`);
      fetchParcel(parcelId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-black">Tracking</h2>
        <div className="mb-6">
          <input
            type="text"
            value={parcelId}
            onChange={(e) => setParcelId(e.target.value)}
            placeholder="Enter Parcel ID"
            onKeyPress={handleKeyPress}
            className="border p-3 w-full text-lg rounded text-black"
          />
          <button
            onClick={handleSearch}
            className="mt-3 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isFetching} // Disable button while fetching
          >
            Search
          </button>
        </div>
        <ParcelDetailComponent parcel={parcel} />
      </div>
    </div>
  );
};

export default ParcelSearchPage;
