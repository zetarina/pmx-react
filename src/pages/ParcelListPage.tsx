import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { deleteParcel, fetchParcels } from "../store/slices/parcelSlice";
import PaginatedTableApiPage from "../components/PaginatedTable";
import { Parcel, ParcelStatus, SenderType } from "../models/Parcel";
import { ColDef } from "ag-grid-community";

const ParcelListPage: React.FC = () => {
  const { parcels, loading, error, total } = useSelector(
    (state: RootState) => state.parcels
  );
  const columns: ColDef<Parcel>[] = [
    { headerName: "Id", field: "_id", sortable: true, filter: true },
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
        if (sender.type === SenderType.Shipper) {
          return sender.shipper
            ? `${sender.shipper.username}, ${sender.shipper.city?.name}, ${sender.shipper.country?.name}`
            : "Unknown Shipper";
        } else if (sender.type === SenderType.Guest) {
          return sender.guest
            ? `${sender.guest.name}, ${sender.guest.city?.name}, ${sender.guest.country?.name}`
            : "Unknown Guest";
        }
        return "Unknown Sender";
      },
    },
    {
      headerName: "Receiver",
      field: "receiver.name",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const { receiver } = params.data;
        return receiver
          ? `${receiver.name}, ${receiver.city?.name}, ${receiver.country?.name}`
          : "Unknown Receiver";
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
        const latestTracking = trackingHistory?.[trackingHistory.length - 1];

        if (
          latestTracking &&
          latestTracking.status === ParcelStatus.InWarehouse
        ) {
          const warehouseName =
            latestTracking.warehouse?.name || "Unknown Warehouse";
          return `In ${warehouseName}`;
        }
        return latestTracking ? latestTracking.status : "No Status";
      },
    },
  ];

  return (
    <PaginatedTableApiPage<Parcel>
      title="Parcels"
      data={parcels}
      loading={loading}
      error={error}
      fetchAction={fetchParcels}
      deleteAction={deleteParcel}
      columns={columns}
      createLink="/dashboard/parcel/create"
      updateLink={(id: string) => `/dashboard/parcel/update/${id}`}
      viewLink={(id: string) => `/dashboard/parcel/${id}`}
      total={total}
    />
  );
};

export default ParcelListPage;
