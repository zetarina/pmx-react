import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { Role } from "../../models/Role";
import { RoleEvent } from "../../enums/Events";
import socketService from "../../class/socketService";

interface RoleSelectorProps {
  name: string;
  className?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ name, className }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/roles?page=1&limit=100&query=${query}`
      );
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/roles/${id}`);
      const role = response.data;
      setRoles((prevRoles) => [...prevRoles, role]);
    } catch (error) {
      console.error("Failed to fetch role", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();

    const handleRoleUpdated = (data: Role) => {
      setRoles((prevRoles) => {
        const existingRole = prevRoles.find((role) => role._id === data._id);
        if (existingRole) {
          return prevRoles.map((role) => (role._id === data._id ? data : role));
        } else {
          return [...prevRoles, data];
        }
      });
    };

    const handleRoleDeleted = (data: string) => {
      setRoles((prevRoles) => prevRoles.filter((role) => role._id !== data));
    };

    socketService.onMessage(RoleEvent.Updated, handleRoleUpdated);
    socketService.onMessage(RoleEvent.Deleted, handleRoleDeleted);

    return () => {
      socketService.socket?.off(RoleEvent.Updated, handleRoleUpdated);
      socketService.socket?.off(RoleEvent.Deleted, handleRoleDeleted);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    fetchRoles(value);
  };

  return (
    <CustomFormikInputBox
      type="datalist"
      label="Role"
      name={name}
      options={roles.map((role) => ({
        value: role._id as string,
        name: role.name,
      }))}
      handleChange={handleInputChange}
      isLoading={loading}
      className={className}
    />
  );
};

export default RoleSelector;
