import React, { ChangeEvent, useState, useEffect } from "react";
import { useField } from "formik";
import { cssConfig } from "../../../core/cssConfig";
import { v4 as uuid } from "uuid";

interface Option {
  value: string;
  name: string;
}

interface DatalistInputProps {
  label: string;
  name: string;
  options: Option[];
  isLoading?: boolean;
  handleDatalistChange?: (value: string) => void;
  onDatalistFinalSelection?: (selectedValue: string) => void;
  onDeleteSelection?: () => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const DatalistInput: React.FC<DatalistInputProps> = ({
  label,
  name,
  options,
  isLoading = false,
  handleDatalistChange,
  onDatalistFinalSelection,
  onDeleteSelection,
  className = "w-1/2",
  disabled = false,
  required = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const uniqueId = uuid();
  const [inputValue, setInputValue] = useState<string>(field.value || "");
  const inputClasses = `${cssConfig.baseClasses}`;

  useEffect(() => {
    setInputValue(field.value || "");
  }, [field.value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    const matchedOptions = options.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    if (matchedOptions.length === 1 && matchedOptions[0].name === value) {
      helpers.setValue(matchedOptions[0].value);
      if (onDatalistFinalSelection) {
        onDatalistFinalSelection(matchedOptions[0].value);
      }
    } else {
      helpers.setValue("");
    }
    if (handleDatalistChange) {
      handleDatalistChange(value);
    }
  };

  const handleBlur = () => {
    const matchedOptions = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    if (matchedOptions.length === 1 && matchedOptions[0].name === inputValue) {
      helpers.setValue(matchedOptions[0].value);
      if (onDatalistFinalSelection) {
        onDatalistFinalSelection(matchedOptions[0].value);
      }
    } else {
      helpers.setValue("");
    }
  };

  const handleDeleteSelection = () => {
    helpers.setValue("");
    setInputValue("");
    if (onDatalistFinalSelection) {
      onDatalistFinalSelection("");
    }
    if (onDeleteSelection) {
      onDeleteSelection();
    }
  };

  const selectedOption = options.find((option) => option.value === field.value);

  return (
    <div className={`p-1 ${className}`}>
      <label htmlFor={name} className={cssConfig.labelClass}>
        {label}
        {required && <span className="text-red-500">*</span>}:
      </label>

      <datalist id={`${uniqueId}-datalist`}>
        {options.map((option) => (
          <option key={option.value} value={option.name} />
        ))}
      </datalist>
      {selectedOption ? (
        <div className="flex items-center border rounded overflow-hidden relative">
          <input
            id={`${name}-V`}
            type="text"
            value={selectedOption.name}
            className={inputClasses + " border-r-0 rounded-none"}
            disabled={true}
          />
          <div className="absolute right-0 h-full flex items-center p-2">
            <button
              type="button"
              onClick={handleDeleteSelection}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            id={name}
            {...field}
            value={inputValue}
            list={`${uniqueId}-datalist`}
            className={inputClasses}
            disabled={disabled}
            required={required}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {isLoading && (
            <div className="absolute right-0 h-full flex items-center p-2">
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      )}
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

export default DatalistInput;
