import React from "react";
import { useNavigate } from "react-router-dom";
import RoleForm from "../components/Forms/RoleForm";
import Page from "../components/Page";

const RoleCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create Role">
      <RoleForm onSuccess={() => navigate("/dashboard/role")} />
    </Page>
  );
};

export default RoleCreatePage;
