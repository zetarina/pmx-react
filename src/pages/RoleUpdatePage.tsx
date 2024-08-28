import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import RoleForm from "../components/Forms/RoleForm";
import { Role } from "../models/Role";
import { RootState, AppDispatch } from "../store";
import { fetchRoleById } from "../store/slices/roleSlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const RoleUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<Role | undefined>(undefined);
  const { roles, loading, error } = useSelector(
    (state: RootState) => state.roles
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const foundRole = roles.find((r) => r._id === id);
      if (foundRole) {
        setRole(foundRole);
      } else {
        const response = await dispatch(fetchRoleById(id!));
        if (fetchRoleById.fulfilled.match(response)) {
          setRole(response.payload.data);
        }
      }
    };

    fetchRole();
  }, [id, roles, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!role) {
    const notFoundError = {
      message: "Role not found",
      name: "NotFoundError",
      status: 404,
      code: "ROLE_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title="Update Role">
      <RoleForm
        currentRole={role}
        onSuccess={() => navigate("/dashboard/role")}
      />
    </Page>
  );
};

export default RoleUpdatePage;
