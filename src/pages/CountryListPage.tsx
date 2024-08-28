import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCountries, deleteCountry } from "../store/slices/countrySlice";
import PaginatedTableApiPage from "../components/PaginatedTable";
import { Country } from "../models/Country";
import { ColDef } from "ag-grid-community";

const CountryListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries, loading, error } = useSelector(
    (state: RootState) => state.countries
  );

  const columns: ColDef<Country>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Code", field: "code", sortable: true, filter: true },
  ];

  return (
    <PaginatedTableApiPage<Country>
      title="Countries"
      data={countries}
      loading={loading}
      error={error}
      fetchAction={fetchCountries}
      deleteAction={deleteCountry}
      columns={columns}
      createLink="/dashboard/country/create"
      updateLink={(id: string) => `/dashboard/country/update/${id}`}
      total={countries.length}
    />
  );
};

export default CountryListPage;
