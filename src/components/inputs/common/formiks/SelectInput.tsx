import React, { ChangeEvent } from "react";
import { useField } from "formik";
import { cssConfig } from "../../../core/cssConfig";

interface Option {
  value: string;
  name: string;
}

interface SelectInputProps {
  label: string;
  name: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  handleChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  className = "w-1/2",
  disabled = false,
  required = false,
  handleChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const inputClasses = `${cssConfig.baseClasses}`;

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    helpers.setValue(e.target.value);
    if (handleChange) {
      handleChange(e);
    }
  };

  return (
    <div className={`mb-4 p-1 ${className}`}>
      <label htmlFor={name} className={cssConfig.labelClass}>
        {label}
        {required && <span className="text-red-500">*</span>}:
      </label>
      <select
        id={name}
        {...field}
        className={inputClasses}
        disabled={disabled}
        required={required}
        onChange={handleInputChange}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <span className={cssConfig.errorClass}>
          {typeof meta.error === "string"
            ? meta.error
            : JSON.stringify(meta.error)}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
