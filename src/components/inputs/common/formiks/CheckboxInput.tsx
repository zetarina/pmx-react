import React, { ChangeEvent } from "react";
import { useField } from "formik";
import { cssConfig } from "../../../core/cssConfig";

interface CheckboxInputProps {
  label: string;
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  name,
  className = "w-1/2",
  disabled = false,
  required = false,
  handleChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(e.target.checked);
    if (handleChange) {
      handleChange(e);
    }
  };

  return (
    <div className={`p-1 ${className}`}>
      <div className="flex items-center space-x-2 border p-2 rounded">
        <input
          type="checkbox"
          id={name}
          {...field}
          className={`rounded ${cssConfig.baseClasses}`}
          disabled={disabled}
          checked={Boolean(field.value)}
          onChange={handleInputChange}
        />
        <div className="flex-1">
          <label
            htmlFor={name}
            className="text-gray-700 text-sm font-bold break-words w-full"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      </div>
      {meta.touched && meta.error && (
        <span className={cssConfig.errorClass}>
          {typeof meta.error === "string" ? meta.error : JSON.stringify(meta.error)}
        </span>
      )}
    </div>
  );
};

export default CheckboxInput;
