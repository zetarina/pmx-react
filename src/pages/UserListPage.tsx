import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchUsers, deleteUser } from "../store/slices/userSlice";
import PaginatedTableApiPage from "../components/PaginatedTable";
import { User } from "../models/User";
import { ColDef } from "ag-grid-community";

const UserListPage: React.FC = () => {
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const columns: ColDef<User>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
    { headerName: "Username", field: "username", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Role", field: "role.name", sortable: true, filter: true },
    { headerName: "City", field: "city.name", sortable: true, filter: true },
    {
      headerName: "Country",
      field: "country.name",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <PaginatedTableApiPage<User>
      title="Users"
      data={users}
      loading={loading}
      error={error}
      fetchAction={fetchUsers}
      deleteAction={deleteUser}
      columns={columns}
      createLink="/dashboard/user/create"
      updateLink={(id: string) => `/dashboard/user/update/${id}`}
      total={users.length}
    />
  );
};

export default UserListPage;
