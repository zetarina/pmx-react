import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PermissionsList } from "../models/permissions";
import ErrorComponent from "../components/ErrorComponent";

interface PermissionsCheckerProps {
  requiredPermissions?: PermissionsList[];
  children?: React.ReactNode;
}

const PermissionsChecker: React.FC<PermissionsCheckerProps> = ({
  requiredPermissions = [],
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  if (requiredPermissions.length > 0 && user) {
    const hasRequiredPermissions = requiredPermissions.every(
      (permission) => user.role?.permissions[permission]
    );

    if (!hasRequiredPermissions) {
      return (
        <ErrorComponent
          error={{
            status: 403,
            message: "You do not have permission to view this page.",
            name: "PermissionError",
          }}
        />
      );
    }
  }

  return <>{children}</>;
};

export default PermissionsChecker;
