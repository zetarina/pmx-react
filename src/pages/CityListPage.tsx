import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCities, deleteCity } from "../store/slices/citySlice";
import { fetchCountries } from "../store/slices/countrySlice";
import { ColDef } from "ag-grid-community";
import { City } from "../models/City";
import PaginatedTableApiPage from "../components/PaginatedTable";

const CityListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, loading, error } = useSelector(
    (state: RootState) => state.cities
  );

  const columns: ColDef<City>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true, filter: true },
    {
      headerName: "Country",
      field: "country.name",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <PaginatedTableApiPage<City>
      title="Cities"
      data={cities}
      loading={loading}
      error={error}
      fetchAction={fetchCities}
      deleteAction={deleteCity}
      columns={columns}
      createLink="/dashboard/city/create"
      updateLink={(id: string) => `/dashboard/city/update/${id}`}
      total={cities.length}
    />
  );
};

export default CityListPage;
