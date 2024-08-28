import React, { useState, useEffect } from "react";
import { Field, useFormikContext, getIn } from "formik";
import CountrySelector from "./CountrySelector";
import CitySelector from "./CitySelector";

interface CountryCitySelectorProps {
  countryField: string;
  cityField: string;
  className?: string;
}

const CountryCitySelector: React.FC<CountryCitySelectorProps> = ({
  countryField,
  cityField,
  className,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const countryValue = getIn(values, countryField);

  const [selectedCountryId, setSelectedCountryId] = useState(
    countryValue || null
  );

  useEffect(() => {
    setSelectedCountryId(countryValue || null);
  }, [countryField, countryValue]);

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    setFieldValue(countryField, countryId);
    setFieldValue(cityField, null);
  };

  const handleCountryDelete = () => {
    setSelectedCountryId(null);
    setFieldValue(countryField, null);
    setFieldValue(cityField, null);
  };

  return (
    <>
      <Field
        as={CountrySelector}
        name={countryField}
        onCountryChange={handleCountryChange}
        onCountryDelete={handleCountryDelete}
        className={className}
      />
      <Field
        as={CitySelector}
        name={cityField}
        countryId={selectedCountryId}
        className={className}
      />
    </>
  );
};

export default CountryCitySelector;
