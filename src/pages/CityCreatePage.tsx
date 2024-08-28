import React from "react";
import { useNavigate } from "react-router-dom";
import CityForm from "../components/Forms/CityForm";
import Page from "../components/Page";

const CityCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create City">
      <CityForm onSuccess={() => navigate("/dashboard/city")} />
    </Page>
  );
};

export default CityCreatePage;
