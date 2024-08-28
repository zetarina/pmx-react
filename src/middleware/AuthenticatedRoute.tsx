import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const AuthenticatedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children || <Outlet />}</>;
};

export default AuthenticatedRoute;
