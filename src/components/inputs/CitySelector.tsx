import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { City } from "../../models/City";
import { CityEvent } from "../../enums/Events";
import socketService from "../../class/socketService";

interface CitySelectorProps {
  name: string;
  countryId: string | null | undefined;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  name,
  countryId,
  className,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = async (query: string = "") => {
    if (!countryId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/cities/country/${countryId}?page=1&limit=100&query=${query}`
      );
      setCities(response.data.cities);
    } catch (error) {
      console.error("Failed to fetch cities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryId) {
      fetchCities();
    }
  }, [countryId]);

  useEffect(() => {

    const handleCityUpdated = (data: City) => {
      setCities((prevCities) => {
        const existingCity = prevCities.find((city) => city._id === data._id);
        if (existingCity) {
          return prevCities.map((city) =>
            city._id === data._id ? data : city
          );
        } else {
          return [...prevCities, data];
        }
      });
    };

    const handleCityDeleted = (data: string) => {
      setCities((prevCities) => prevCities.filter((city) => city._id !== data));
    };

    socketService.onMessage(CityEvent.Updated, handleCityUpdated);
    socketService.onMessage(CityEvent.Deleted, handleCityDeleted);

    return () => {
      socketService.socket?.off(CityEvent.Updated, handleCityUpdated);
      socketService.socket?.off(CityEvent.Deleted, handleCityDeleted);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    fetchCities(value);
  };

  return (
    <CustomFormikInputBox
      type="datalist"
      label="City"
      name={name}
      options={cities.map((city) => ({
        value: city._id as string,
        name: city.name,
      }))}
      disabled={countryId === null || countryId === undefined}
      handleChange={handleInputChange}
      isLoading={loading}
      className={className}
    />
  );
};

export default CitySelector;
