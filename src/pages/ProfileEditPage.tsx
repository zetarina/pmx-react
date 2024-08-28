import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ProfileForm from "../components/Forms/ProfileForm";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";
import { useNavigate } from "react-router-dom";

const ProfileEditPage: React.FC = () => {
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!user) {
    const notFoundError = {
      message: "User not found",
      name: "NotFoundError",
      status: 404,
      code: "USER_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} showLogoutButton={true} />;
  }

  return (
    <Page title="Edit Profile">
      <ProfileForm
        currentUser={user}
        onSuccess={() => navigate("/dashboard/profile")}
      />
    </Page>
  );
};

export default ProfileEditPage;
