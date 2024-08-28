import React, { ChangeEvent } from "react";
import { useField } from "formik";
import { cssConfig } from "../../../core/cssConfig";
interface TextAreaInputProps {
  label: string;
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  handleChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  name,
  className = "w-1/2",
  disabled = false,
  required = false,
  handleChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const inputClasses = `${cssConfig.baseClasses}`;

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    helpers.setValue(e.target.value);
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

      <textarea
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
  );
};

export default TextAreaInput;
