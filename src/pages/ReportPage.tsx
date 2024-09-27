import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Page from "../components/Page";
import axiosInstance from "../api/axiosInstance";
import { Parcel, ParcelStatus, SenderType } from "../models/Parcel";
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
          responseType: "text",
        });

        if (typeof response.data === "string" && response.data.includes(",")) {
          const parsedData = Papa.parse(response.data, {
            header: true,
            dynamicTyping: true,
          }).data;
          console.log(parsedData);
          // Ensure JSON fields are parsed before formatting
          const formattedData = parsedData.map((parcel: any) => {
            const parsedSender = parcel.sender ? JSON.parse(parcel.sender) : {};
            const parsedReceiver = parcel.receiver
              ? JSON.parse(parcel.receiver)
              : {};
            const parsedTrackingHistory = parcel.trackingHistory
              ? JSON.parse(parcel.trackingHistory)
              : [];

            return {
              "Parcel ID": parcel.parcelId ?? "N/A",
              Sender: formatSender(parsedSender),
              Receiver: formatReceiver(parsedReceiver),
              "Delivery Fees": parcel.deliveryFees ?? "N/A",
              "Payment Status": parcel.paymentStatus ?? "N/A",
              Subtotal: parcel.subTotal ?? "N/A",
              "Total Fee": parcel.totalFee ?? "N/A",
              Status: formatStatus(parsedTrackingHistory),

              "Discount Type": parcel.discountType,

              "Discount Value": parcel.discountValue,

              "Tax Type": parcel.taxType,

              "Tax Value": parcel.taxValue,
            };
          });

          const csvData = convertToCSV(formattedData);
          const blob = new Blob([csvData], { type: "text/csv" });
          saveAs(
            blob,
            `parcel-report-${startDate.toISOString()}-to-${endDate.toISOString()}.csv`
          );
        } else {
          console.error("Error: Expected CSV data but got:", response.data);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
      }
    }
  };

  // Utility function to format the sender information
  const formatSender = (sender: any): string => {
    if (sender?.type === SenderType.Shipper) {
      return sender.shipper
        ? `${sender.shipper.username},${sender.shipper.address || "N/A"}, ${
            sender.shipper.city?.name || "N/A"
          }, ${sender.shipper.country?.name || "N/A"}`
        : "Unknown Shipper";
    } else if (sender?.type === SenderType.Guest) {
      return sender.guest
        ? `${sender.guest.name},${sender.guest.address || "N/A"}, ${
            sender.guest.city?.name || "N/A"
          }, ${sender.guest.country?.name || "N/A"}`
        : "Unknown Guest";
    }
    return "Unknown Sender";
  };

  // Utility function to format the receiver information
  const formatReceiver = (receiver: any): string => {
    return receiver
      ? `${receiver.name || "N/A"},${receiver.address || "N/A"}, ${
          receiver.city?.name || "N/A"
        }, ${receiver.country?.name || "N/A"}`
      : "Unknown Receiver";
  };

  // Utility function to format the status based on tracking history
  const formatStatus = (trackingHistory: any): string => {
    const latestTracking = trackingHistory?.[trackingHistory.length - 1];
    if (latestTracking && latestTracking.status === ParcelStatus.InWarehouse) {
      const warehouseName =
        latestTracking.warehouse?.name || "Unknown Warehouse";
      return `In ${warehouseName}`;
    }
    return latestTracking ? latestTracking.status : "No Status";
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
    {
      headerName: "Sender",
      field: "sender",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const { sender } = params.data;
        return formatSender(sender);
      },
    },
    {
      headerName: "Receiver",
      field: "receiver.name",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const { receiver } = params.data;
        return formatReceiver(receiver);
      },
    },
    {
      headerName: "Delivery Fees",
      field: "deliveryFees",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Payment Status",
      field: "paymentStatus",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Subtotal",
      field: "subTotal",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Total Fee",
      field: "totalFee",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const { trackingHistory } = params.data;
        return formatStatus(trackingHistory);
      },
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
