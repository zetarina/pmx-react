import React from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/Forms/UserForm";
import Page from "../components/Page";

const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Create User">
      <UserForm onSuccess={() => navigate("/dashboard/user")} />
    </Page>
  );
};

export default UserCreatePage;
