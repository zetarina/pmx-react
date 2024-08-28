import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchRoles, deleteRole } from "../store/slices/roleSlice";
import PaginatedTableApiPage from "../components/PaginatedTable";
import { Role } from "../models/Role";
import { ColDef } from "ag-grid-community";

const RoleListPage: React.FC = () => {
  const { roles, loading, error } = useSelector(
    (state: RootState) => state.roles
  );

  const columns: ColDef<Role>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true, filter: true },
  ];

  return (
    <PaginatedTableApiPage<Role>
      title="Roles"
      data={roles}
      loading={loading}
      error={error}
      fetchAction={fetchRoles}
      deleteAction={deleteRole}
      columns={columns}
      createLink="/dashboard/role/create"
      updateLink={(id: string) => `/dashboard/role/update/${id}`}
      total={roles.length}
    />
  );
};

export default RoleListPage;
