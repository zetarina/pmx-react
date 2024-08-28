import React from "react";
import { useNavigate } from "react-router-dom";
import WarehouseForm from "../components/Forms/WarehouseForm";
import Page from "../components/Page";

const WarehouseCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create Warehouse">
      <WarehouseForm onSuccess={() => navigate("/dashboard/warehouse")} />
    </Page>
  );
};

export default WarehouseCreatePage;
