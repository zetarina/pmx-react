import React from "react";
import { useNavigate } from "react-router-dom";
import ExchangeRateForm from "../components/Forms/ExchangeRateForm";
import Page from "../components/Page";

const ExchangeRateCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create Exchange Rate">
      <ExchangeRateForm
        onSuccess={() => navigate("/dashboard/exchange-rate")}
      />
    </Page>
  );
};

export default ExchangeRateCreatePage;
