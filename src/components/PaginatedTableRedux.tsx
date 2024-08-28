import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ColDef } from "ag-grid-community";
import Loading from "./Loading";
import TableError from "./TableError";
import Page from "./Page";
import { Link } from "react-router-dom";
import { AppDispatch } from "../store";

const classes = {
  input:
    "border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500",
  buttonPrimary: "bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600",
  buttonSecondary: "bg-gray-500 hover:bg-gray-600 p-2 rounded text-white",
  buttonDisabled: "bg-gray-300 cursor-not-allowed",
  editButton: "text-blue-500 hover:underline",
  deleteButton: "text-red-500 hover:underline",
  flexCenter: "flex items-center space-x-2",
  flexSpaceBetween: "mb-4 flex justify-between items-center",
  textMuted: "text-gray-700",
};

interface PaginatedTableProps<T> {
  title: string;
  data: T[];
  loading: boolean;
  error: string | null;
  fetchAction: any;
  deleteAction: any;
  dispatch: AppDispatch;
  columns: ColDef<T>[];
  createLink: string;
  updateLink: (id: string) => string;
}

const PaginatedTableReduxPage = <T extends { _id?: string }>({
  title,
  data,
  loading,
  error,
  fetchAction,
  deleteAction,
  dispatch,
  columns,
  createLink,
  updateLink,
}: PaginatedTableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch, fetchAction]);

  const handleDelete = (id: string) => {
    dispatch(deleteAction(id));
    toast.success(`${title.slice(0, -1)} deleted successfully`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData =
    data && data.length > 0
      ? data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : [];

  const modifiedColumns: ColDef<T>[] = [
    ...columns,
    {
      headerName: "Actions",
      field: "actions" as any,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <Link
            to={updateLink(params.data._id)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(params.data._id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Page title={title}>
      <div className={classes.flexSpaceBetween}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={classes.input}
        />
        <Link to={createLink} className={classes.buttonPrimary}>
          Create {title.slice(0, -1)}
        </Link>
      </div>
      {loading && <Loading />}
      {error && <TableError message={error} />}
      {!loading && !error && (
        <div className="ag-theme-alpine rounded-lg shadow-md overflow-hidden">
          <AgGridReact
            rowData={filteredData}
            columnDefs={modifiedColumns}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
            suppressPaginationPanel={true}
          />
        </div>
      )}
    </Page>
  );
};

export default PaginatedTableReduxPage;
