import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ParcelForm from "../components/Forms/ParcelForm";
import { Parcel } from "../models/Parcel";
import { RootState, AppDispatch } from "../store";
import { fetchParcelById } from "../store/slices/parcelSlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const ParcelUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parcel, setParcel] = useState<Parcel | undefined>(undefined);
  const { parcels, loading, error } = useSelector(
    (state: RootState) => state.parcels
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcel = async () => {
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

    fetchParcel();
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
    <Page title="Update Parcel">
      <ParcelForm
        currentParcel={parcel}
        onSuccess={() => navigate("/dashboard/parcel")}
      />
    </Page>
  );
};

export default ParcelUpdatePage;
