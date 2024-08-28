import React from "react";
import { useNavigate } from "react-router-dom";
import CountryForm from "../components/Forms/CountryForm";
import Page from "../components/Page";

const CountryCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create Country">
      <CountryForm onSuccess={() => navigate("/dashboard/country")} />
    </Page>
  );
};

export default CountryCreatePage;
