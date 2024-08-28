import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchWarehouses,
  deleteWarehouse,
} from "../store/slices/warehouseSlice";
import { fetchCities } from "../store/slices/citySlice";
import { fetchCountries } from "../store/slices/countrySlice";
import PaginatedTableApiPage from "../components/PaginatedTable";
import { ColDef } from "ag-grid-community";
import { Warehouse } from "../models/Warehouse";

const WarehouseListPage: React.FC = () => {
  const { warehouses, loading, error } = useSelector(
    (state: RootState) => state.warehouses
  );

  const columns: ColDef<Warehouse>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true, filter: true },
    {
      headerName: "Address",
      field: "location.address",
      sortable: true,
      filter: true,
    },
    {
      headerName: "City",
      field: "location.city.name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Country",
      field: "location.country.name",
      sortable: true,
      filter: true,
    },
    { headerName: "Capacity", field: "capacity", sortable: true, filter: true },
  ];

  return (
    <PaginatedTableApiPage<Warehouse>
      title="Warehouses"
      data={warehouses}
      loading={loading}
      error={error}
      fetchAction={fetchWarehouses}
      deleteAction={deleteWarehouse}
      columns={columns}
      createLink="/dashboard/warehouse/create"
      updateLink={(id: string) => `/dashboard/warehouse/update/${id}`}
      total={warehouses.length}
    />
  );
};

export default WarehouseListPage;
