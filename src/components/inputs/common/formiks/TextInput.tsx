import React, { ChangeEvent } from "react";
import { useField } from "formik";
import { cssConfig } from "../../../core/cssConfig";


interface TextInputProps {
  label: string;
  name: string;
  type:
    | "text"
    | "password"
    | "number"
    | "email"
    | "date"
    | "time"
    | "datetime-local"
    | "week"
    | "month";
  className?: string;
  disabled?: boolean;
  required?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  type,
  className = "w-1/2",
  disabled = false,
  required = false,
  handleChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const inputClasses = `${cssConfig.baseClasses}`;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (type === "number" && typeof value === "string") {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        helpers.setValue(value);
      }
    } else {
      helpers.setValue(value);
    }
    if (handleChange) {
      handleChange(e);
    }
  };

  return (
    <div className={`p-1 ${className}`}>
      <label htmlFor={name} className={cssConfig.labelClass}>
        {label}
        {required && <span className="text-red-500">*</span>}:
      </label>
      <div>
        <input
          type={type}
          id={name}
          {...field}
          className={inputClasses}
          disabled={disabled}
          required={required}
          onChange={handleInputChange}
        />
        {meta.touched && meta.error && (
          <span className={cssConfig.errorClass}>
            {typeof meta.error === "string"
              ? meta.error
              : JSON.stringify(meta.error)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInput;
