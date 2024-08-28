import React from "react";
import { useNavigate } from "react-router-dom";
import ParcelForm from "../components/Forms/ParcelForm";
import Page from "../components/Page";

const ParcelCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create Parcel">
      <ParcelForm onSuccess={() => navigate("/dashboard/parcel")} />
    </Page>
  );
};

export default ParcelCreatePage;
