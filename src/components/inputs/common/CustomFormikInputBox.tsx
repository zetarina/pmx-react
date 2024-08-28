import React from "react";
import CheckboxInput from "./formiks/CheckboxInput";
import DatalistInput from "./formiks/DatalistInput";
import SelectInput from "./formiks/SelectInput";
import TextAreaInput from "./formiks/TextAreaInput";
import TextInput from "./formiks/TextInput";


interface Option {
  value: string;
  name: string;
}

interface CustomFormikInputBoxProps {
  type: "text" | "password" | "number" | "email" | "checkbox" | "select" | "textarea" | "date" | "time" | "datetime-local" | "week" | "month" | "datalist";
  label: string;
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  options?: Option[];
  isLoading?: boolean;
  handleChange?: (e: any) => void;
  handleDatalistChange?: (value: string) => void;
  onDatalistFinalSelection?: (selectedValue: string) => void;
  onDeleteSelection?: () => void;
}

const CustomFormikInputBox: React.FC<CustomFormikInputBoxProps> = ({
  type,
  label,
  name,
  className,
  disabled,
  required,
  options,
  isLoading,
  handleChange,
  handleDatalistChange,
  onDatalistFinalSelection,
  onDeleteSelection,
}) => {
  switch (type) {
    case "checkbox":
      return (
        <CheckboxInput
          label={label}
          name={name}
          className={className}
          disabled={disabled}
          required={required}
          handleChange={handleChange}
        />
      );
    case "select":
      return (
        <SelectInput
          label={label}
          name={name}
          options={options || []}
          className={className}
          disabled={disabled}
          required={required}
          handleChange={handleChange}
        />
      );
    case "textarea":
      return (
        <TextAreaInput
          label={label}
          name={name}
          className={className}
          disabled={disabled}
          required={required}
          handleChange={handleChange}
        />
      );
    case "datalist":
      return (
        <DatalistInput
          label={label}
          name={name}
          options={options || []}
          isLoading={isLoading}
          className={className}
          disabled={disabled}
          required={required}
          handleDatalistChange={handleDatalistChange}
          onDatalistFinalSelection={onDatalistFinalSelection}
          onDeleteSelection={onDeleteSelection}
        />
      );
    default:
      return (
        <TextInput
          label={label}
          name={name}
          type={type}
          className={className}
          disabled={disabled}
          required={required}
          handleChange={handleChange}
        />
      );
  }
};

export default CustomFormikInputBox;
