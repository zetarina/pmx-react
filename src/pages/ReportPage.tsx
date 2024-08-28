import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Page from "../components/Page";
import axiosInstance from "../api/axiosInstance";
import { Parcel } from "../models/Parcel";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import Papa from "papaparse";

const ReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);

    // Fetch data when the component is mounted
    fetchParcels(firstDayOfMonth, lastDayOfMonth);
  }, []);

  const fetchParcels = async (start?: Date, end?: Date) => {
    if (start && end) {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/report/data", {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
        });
        setParcels(response.data);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFetchData = () => {
    if (startDate && endDate) {
      fetchParcels(startDate, endDate);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchParcels(startDate, endDate);
    }
  }, [startDate, endDate]);
  
  const downloadReport = async () => {
    if (startDate && endDate) {
      try {
        const response = await axiosInstance.get("/report/download", {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          responseType: "text", // Ensure you get the raw response text
        });

        // Check if the response is CSV formatted data
        if (typeof response.data === "string" && response.data.includes(",")) {
          // Parse the CSV string into an array of objects
          const parsedData = Papa.parse(response.data, {
            header: true,
            dynamicTyping: true,
          }).data;

          const formattedData = parsedData.map((parcel: any) => ({
            parcelId: parcel.parcelId ?? "",
            status: parcel.status ?? "",
            receiverName: parcel.receiver?.name || "",
            deliveryFees: parcel.deliveryFees,
            paymentType: parcel.paymentType,
          }));

          // Convert to CSV
          const csvData = convertToCSV(formattedData);

          const blob = new Blob([csvData], { type: "text/csv" });
          saveAs(blob, `parcel-report-${startDate}-to-${endDate}.csv`);
        } else {
          console.error("Error: Expected CSV data but got:", response.data);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
      }
    }
  };

  // Utility function to convert JSON to CSV
  const convertToCSV = (
    data: Array<{ [key: string]: string | number }>
  ): string => {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    return [header, ...rows].join("\n");
  };

  const columnDefs: ColDef<Parcel>[] = [
    {
      headerName: "Parcel ID",
      field: "parcelId",
      sortable: true,
      filter: true,
    },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    {
      headerName: "Receiver",
      field: "receiver.name", // Nested field path
      sortable: true,
      filter: true,
    },
    {
      headerName: "Delivery Fees",
      field: "deliveryFees",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Payment Type",
      field: "paymentType",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <Page title={"Customer Report"}>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Report</h2>
        <div className="mb-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date ?? undefined)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border p-2 rounded"
            placeholderText="Select start date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date ?? undefined)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border p-2 rounded ml-2"
            placeholderText="Select end date"
          />
          <button
            onClick={handleFetchData}
            className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Fetch Data
          </button>
          <button
            onClick={downloadReport}
            className="ml-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Download CSV
          </button>
        </div>
        {loading && <p>Loading data...</p>}
        {!loading && parcels.length > 0 && (
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact<Parcel>
              rowData={parcels}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    </Page>
  );
};

export default ReportPage;
