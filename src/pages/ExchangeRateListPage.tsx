import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchExchangeRates,
  deleteExchangeRate,
} from "../store/slices/exchangeRateSlice";
import PaginatedTableApiPage from "../components/PaginatedTable";
import { ExchangeRate } from "../models/ExchangeRate";
import { ColDef } from "ag-grid-community";

const ExchangeRateListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exchangeRates, loading, error } = useSelector(
    (state: RootState) => state.exchangeRate
  );

  const columns: ColDef<ExchangeRate>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
    {
      headerName: "Currency Pair",
      field: "currencyPair",
      sortable: true,
      filter: true,
    },
    { headerName: "Rate", field: "rate", sortable: true, filter: true },
    {
      headerName: "Timestamp",
      field: "timestamp",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <PaginatedTableApiPage<ExchangeRate>
      title="Exchange Rates"
      data={exchangeRates}
      loading={loading}
      error={error}
      fetchAction={fetchExchangeRates}
      deleteAction={deleteExchangeRate}
      columns={columns}
      createLink="/dashboard/exchange-rate/create"
      updateLink={(id: string) => `/dashboard/exchange-rate/update/${id}`}
      total={exchangeRates.length}
    />
  );
};

export default ExchangeRateListPage;
