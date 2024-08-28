import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ErrorComponent from "../components/ErrorComponent";
import Loading from "../components/Loading";

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { token, user, error, loading, fetchingCurrentUser } = useSelector(
    (state: RootState) => state.auth
  );

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (error) {
    return <ErrorComponent error={error} showLogoutButton={true} />;
  }

  if (loading || fetchingCurrentUser) {
    return <Loading text="Loading..." />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
