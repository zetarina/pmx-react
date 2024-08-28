import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchParcelById } from "../store/slices/parcelSlice";
import { Parcel } from "../models/Parcel";
import { RootState, AppDispatch } from "../store";
import axiosInstance from "../api/axiosInstance";
import PDFViewer from "../components/PDFViewer";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";
import TrackingHistoryComponent from "../components/TrackingHistoryComponent";
import ParcelDetailComponent from "../components/ParcelDetailComponent";

const ParcelWaybillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parcel, setParcel] = useState<Parcel | undefined>(undefined);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const { parcels, loading, error } = useSelector(
    (state: RootState) => state.parcels
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axiosInstance.get(`/parcels/${id}/waybill-pdf`, {
          responseType: "blob",
        });

        const pdfUrl = URL.createObjectURL(response.data);
        setPdfData(pdfUrl);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const fetchParcelData = async () => {
      const foundParcel = parcels.find((p) => p._id === id);
      if (foundParcel) {
        setParcel(foundParcel);
      } else {
        const response = await dispatch(fetchParcelById(id!));
        if (fetchParcelById.fulfilled.match(response)) {
          setParcel(response.payload.data);
        }
      }
    };

    fetchPdf();
    fetchParcelData();
  }, [id, parcels, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!parcel) {
    const notFoundError = {
      message: "Parcel not found",
      name: "NotFoundError",
      status: 404,
      code: "PARCEL_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title={"Parcel View"}>
      <div className="flex flex-col md:flex-row gap-8 p-4 min-h-screen">
        <div className="md:w-2/3 bg-white shadow-md border border-gray-500 rounded-lg p-4 flex flex-col h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Parcel Waybill
          </h2>
          <div className="flex-grow">
            {pdfData ? (
              <PDFViewer fileUrl={pdfData} />
            ) : (
              <div className="text-lg text-gray-500">Loading PDF...</div>
            )}
          </div>
        </div>

        <div className="md:w-1/3 bg-white overflow-y-auto">
          <ParcelDetailComponent parcel={parcel} />
        </div>
      </div>
    </Page>
  );
};

export default ParcelWaybillPage;
