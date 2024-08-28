import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { Country } from "../../models/Country";

interface CountrySelectorProps {
  name: string;
  onCountryChange?: (countryId: string) => void;
  onCountryDelete?: () => void;
  className?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  name,
  onCountryChange,
  onCountryDelete,
  className,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCountries = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/countries?page=1&limit=100&query=${query}`
      );
      setCountries(response.data.countries);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    fetchCountries(value);
  };

  return (
    <CustomFormikInputBox
      type="datalist"
      label="Country"
      name={name}
      options={countries.map((country) => ({
        value: country._id as string,
        name: country.name,
      }))}
      handleChange={handleInputChange}
      isLoading={loading}
      onDatalistFinalSelection={(selectedValue) => {
        if (onCountryChange) {
          onCountryChange(selectedValue);
        }
      }}
      onDeleteSelection={onCountryDelete}
      className={className}
    />
  );
};

export default CountrySelector;
