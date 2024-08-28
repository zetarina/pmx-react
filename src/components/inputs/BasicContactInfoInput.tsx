import React from "react";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import CountryCitySelector from "./CountryCitySelector";
import { Field, FieldProps } from "formik";

interface BasicContactInfoInputProps extends FieldProps {
  phoneNumberField: string;
  addressField: string;
  zipField: string;
  countryField: string;
  cityField: string;
  className?: string;
}

const BasicContactInfoInput: React.FC<BasicContactInfoInputProps> = ({
  phoneNumberField,
  addressField,
  zipField,
  countryField,
  cityField,
  className,
}) => {
  return (
    <>
      <Field
        as={CustomFormikInputBox}
        type="text"
        label="Phone Number"
        name={phoneNumberField}
        required
        className={className}
      />

      <Field
        as={CustomFormikInputBox}
        type="text"
        label="Address"
        name={addressField}
        required
        className={className}
      />

      <Field
        as={CustomFormikInputBox}
        type="text"
        label="Zip Code"
        name={zipField}
        required
        className={className}
      />

      <Field
        component={CountryCitySelector}
        countryField={countryField}
        cityField={cityField}
        className={className}
      />
    </>
  );
};

export default BasicContactInfoInput;
