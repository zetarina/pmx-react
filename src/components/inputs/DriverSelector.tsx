import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { User } from "../../models/User";
import { UserEvent, RoleEvent } from "../../enums/Events";
import socketService from "../../class/socketService";

interface DriverSelectorProps {
  name: string;
  className?: string;
}

const DriverSelector: React.FC<DriverSelectorProps> = ({ name, className }) => {
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDrivers = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/users?role=driver&page=1&limit=100&query=${query}`
      );
      setDrivers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      const driver = response.data;
      setDrivers((prevDrivers) => [...prevDrivers, driver]);
    } catch (error) {
      console.error("Failed to fetch driver", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();

    const handleUserUpdated = (data: User) => {
      if (data.role && data.role.isDriver === true) {
        setDrivers((prevDrivers) => {
          const existingDriver = prevDrivers.find(
            (driver) => driver._id === data._id
          );
          if (existingDriver) {
            return prevDrivers.map((driver) =>
              driver._id === data._id ? data : driver
            );
          } else {
            return [...prevDrivers, data];
          }
        });
      } else {
        setDrivers((prevDrivers) =>
          prevDrivers.filter((driver) => driver._id !== data._id)
        );
      }
    };

    const handleUserDeleted = (data: string) => {
      setDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => driver._id !== data)
      );
    };

    const handleRoleUpdated = (data: any) => {
      fetchDrivers();
    };

    const handleRoleDeleted = (data: any) => {
      fetchDrivers();
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
    fetchDrivers(value);
  };

  return (
    <CustomFormikInputBox
      type="datalist"
      label="Driver"
      name={name}
      options={drivers.map((driver) => ({
        value: driver._id as string,
        name: driver.username,
      }))}
      handleChange={handleInputChange}
      isLoading={loading}
      className={className}
    />
  );
};

export default DriverSelector;
