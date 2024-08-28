import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { Warehouse } from "../../models/Warehouse";
import { WarehouseEvent } from "../../enums/Events";
import socketService from "../../class/socketService";

interface WarehouseSelectorProps {
  name: string;
  className?: string;
}

const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
  name,
  className,
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWarehouses = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/warehouses?page=1&limit=100&query=${query}`
      );
      setWarehouses(response.data.warehouses);
    } catch (error) {
      console.error("Failed to fetch warehouses", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchWarehouses();

    const handleWarehouseUpdated = (data: Warehouse) => {
      setWarehouses((prevWarehouses) => {
        const existingWarehouse = prevWarehouses.find(
          (warehouse) => warehouse._id === data._id
        );
        if (existingWarehouse) {
          return prevWarehouses.map((warehouse) =>
            warehouse._id === data._id ? data : warehouse
          );
        } else {
          return [...prevWarehouses, data];
        }
      });
    };

    const handleWarehouseDeleted = (data: string) => {
      setWarehouses((prevWarehouses) =>
        prevWarehouses.filter((warehouse) => warehouse._id !== data)
      );
    };

    socketService.onMessage(WarehouseEvent.Updated, handleWarehouseUpdated);
    socketService.onMessage(WarehouseEvent.Deleted, handleWarehouseDeleted);

    return () => {
      socketService.socket?.off(WarehouseEvent.Updated, handleWarehouseUpdated);
      socketService.socket?.off(WarehouseEvent.Deleted, handleWarehouseDeleted);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    fetchWarehouses(value);
  };

  return (
    <CustomFormikInputBox
      type="datalist"
      label="Warehouse"
      name={name}
      options={warehouses.map((warehouse) => ({
        value: warehouse._id as string,
        name: warehouse.name,
      }))}
      handleChange={handleInputChange}
      isLoading={loading}
      className={className}
    />
  );
};

export default WarehouseSelector;
