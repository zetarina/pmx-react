import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import { CustomError } from "../api/axiosInstance";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

// Define reusable class names
const classes = {
  input:
    "border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500",
  buttonPrimary: "bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600",
  buttonSecondary: "bg-gray-500 hover:bg-gray-600 p-2 rounded text-white",
  buttonDisabled: "bg-gray-300 cursor-not-allowed",
  buttonBase: "px-2 py-1 rounded-lg border", // Common base for buttons
  viewButton:
    "bg-white text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-white hover:border-transparent", // Blue variant
  editButton:
    "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white hover:border-transparent", // Blue variant
  deleteButton:
    "bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent", // Red variant
  flexCenter: "flex items-center space-x-2 h-full",
  flexSpaceBetween: "mb-4 flex justify-between items-center",
  textMuted: "text-gray-700",
};

interface PaginatedTableApiProps<T> {
  title: string;
  data: T[];
  total: number;
  loading: boolean;
  error: CustomError | null;
  fetchAction: any;
  deleteAction: any;
  columns: ColDef<T>[];
  createLink: string;
  updateLink: (id: string) => string;
  viewLink?: (id: string) => string;
}

const PaginatedTableApiPage = <T extends { _id?: string }>({
  title,
  data,
  total,
  loading,
  error,
  fetchAction,
  deleteAction,
  columns,
  createLink,
  updateLink,
  viewLink,
}: PaginatedTableApiProps<T>) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchAction({ page: currentPage, limit: pageSize, query: searchTerm })
    );
  }, [dispatch, fetchAction, currentPage, pageSize, searchTerm]);

  const handleDelete = (id: string) => {
    dispatch(deleteAction(id));
    toast.success(`${title.slice(0, -1)} deleted successfully`);
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
      pinned: "right",

      cellRenderer: (params: any) => (
        <div className={classes.flexCenter}>
          {viewLink && (
            <Link
              to={viewLink(params.data._id)}
              className={`${classes.buttonBase} ${classes.viewButton}`}
            >
              <FaEye /> {/* View icon */}
            </Link>
          )}
          <Link
            to={updateLink(params.data._id)}
            className={`${classes.buttonBase} ${classes.editButton}`}
          >
            <FaEdit /> {/* Edit icon */}
          </Link>
          <button
            onClick={() => handleDelete(params.data._id)}
            className={`${classes.buttonBase} ${classes.deleteButton}`}
          >
            <FaTrash /> {/* Delete icon */}
          </button>
        </div>
      ),
    },
  ];

  const maxPage = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <Page title={title}>
      <div className={classes.flexSpaceBetween}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.input}
        />
        <Link to={createLink} className={classes.buttonPrimary}>
          Create {title.slice(0, -1)}
        </Link>
      </div>
      {loading && <Loading />}
      {error && <TableError message={error.message} />}
      {!loading && !error && (
        <div className="ag-theme-alpine rounded-lg shadow-md overflow-hidden">
          <AgGridReact
            rowData={filteredData}
            columnDefs={modifiedColumns}
            pagination={true}
            paginationPageSize={pageSize}
            onPaginationChanged={(params) => {
              setCurrentPage(params.api.paginationGetCurrentPage() + 1);
              setPageSize(params.api.paginationGetPageSize());
            }}
            paginationNumberFormatter={(params) =>
              `[${params.value.toLocaleString()}]`
            }
            domLayout="autoHeight"
            suppressPaginationPanel={true}
           
          />
        </div>
      )}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || error !== null}
          className={`${classes.buttonSecondary} ${
            currentPage === 1 || error !== null ? classes.buttonDisabled : ""
          }`}
        >
          Previous
        </button>
        <span className={classes.textMuted}>
          Page {error ? 0 : currentPage} of {error ? 0 : maxPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, maxPage))}
          disabled={currentPage === maxPage || error !== null}
          className={`${classes.buttonSecondary} ${
            currentPage === maxPage || error !== null
              ? classes.buttonDisabled
              : ""
          }`}
        >
          Next
        </button>
      </div>
    </Page>
  );
};

export default PaginatedTableApiPage;
