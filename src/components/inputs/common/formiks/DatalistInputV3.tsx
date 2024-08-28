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
  const [inputValue, setInputValue] = useState<string>(field.value || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const inputClasses = `${cssConfig.baseClasses}`;

  useEffect(() => {
    setInputValue(field.value || "");
  }, [field.value]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (handleDatalistChange) {
      handleDatalistChange(value);
    }
  };

  const handleOptionClick = (option: Option) => {
    setInputValue(option.name);
    helpers.setValue(option.value);
    setSearchTerm("");
    if (onDatalistFinalSelection) {
      onDatalistFinalSelection(option.value);
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

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === field.value);

  return (
    <div className={`p-1 ${className}`}>
      <label htmlFor={name} className={cssConfig.labelClass}>
        {label}
        {required && <span className="text-red-500">*</span>}:
      </label>

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
        <>
          <div className="relative">
            <input
              type="text"
              id={name}
              {...field}
              value={inputValue}
              className={inputClasses}
              disabled={disabled}
              required={required}
              readOnly={true}
            />
            {meta.touched && meta.error && (
              <span className={cssConfig.errorClass}>
                {typeof meta.error === "string"
                  ? meta.error
                  : JSON.stringify(meta.error)}
              </span>
            )}
          </div>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={inputClasses}
            />
            {isLoading && (
              <div className="absolute right-0 h-full flex items-center">
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
            <div className="absolute w-full bg-white border rounded mt-1 z-10">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatalistInput;
