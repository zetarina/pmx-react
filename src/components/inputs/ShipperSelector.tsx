import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { User } from "../../models/User";
import { UserEvent, RoleEvent } from "../../enums/Events";
import socketService from "../../class/socketService";

interface ShipperSelectorProps {
  name: string;
  className?: string;
}

const ShipperSelector: React.FC<ShipperSelectorProps> = ({
  name,
  className,
}) => {
  const [shippers, setShippers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShippers = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/users?role=shipper&page=1&limit=100&query=${query}`
      );
      setShippers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippers();

    const handleUserUpdated = (data: User) => {
      if (data.role && data.role.isShipper === true) {
        setShippers((prevShippers) => {
          const existingShipper = prevShippers.find(
            (shipper) => shipper._id === data._id
          );
          if (existingShipper) {
            return prevShippers.map((shipper) =>
              shipper._id === data._id ? data : shipper
            );
          } else {
            return [...prevShippers, data];
          }
        });
      } else {
        setShippers((prevShippers) =>
          prevShippers.filter((shipper) => shipper._id !== data._id)
        );
      }
    };

    const handleUserDeleted = (data: string) => {
      setShippers((prevShippers) =>
        prevShippers.filter((shipper) => shipper._id !== data)
      );
    };

    const handleRoleUpdated = (data: any) => {
      fetchShippers();
    };

    const handleRoleDeleted = (data: any) => {
      fetchShippers();
    };

    socketService.onMessage(UserEvent.Updated, handleUserUpdated);
    socketService.onMessage(UserEvent.Deleted, handleUserDeleted);
    socketService.onMessage(RoleEvent.Updated, handleRoleUpdated);
    socketService.onMessage(RoleEvent.Deleted, handleRoleDeleted);

    return () => {
      socketService.socket?.off(UserEvent.Updated, handleUserUpdated);
      socketService.socket?.off(UserEvent.Deleted, handleUserDeleted);
      socketService.socket?.off(RoleEvent.Updated, handleRoleUpdated);
      socketService.socket?.off(RoleEvent.Deleted, handleRoleDeleted);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    fetchShippers(value);
  };

  return (
    <CustomFormikInputBox
      type="datalist"
      label="Shipper"
      name={name}
      options={shippers.map((shipper) => ({
        value: shipper._id as string,
        name: shipper.username,
      }))}
      handleChange={handleInputChange}
      isLoading={loading}
      className={className}
    />
  );
};

export default ShipperSelector;
