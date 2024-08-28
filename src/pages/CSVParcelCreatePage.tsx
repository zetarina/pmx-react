import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Papa from "papaparse";
import Page from "../components/Page";
import CSVParcelGrid from "../components/CSVParcelGrid";
import { ColDef } from "ag-grid-community";
import { PaymentType, Parcel, DiscountType, TaxType } from "../models/Parcel";
import { City } from "../models/City";
import { Country } from "../models/Country";
import { Formik, Form, Field } from "formik";
import WarehouseSelector from "../components/inputs/WarehouseSelector";
import ShipperSelector from "../components/inputs/ShipperSelector";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

interface ValidatedData {
  countries: Country[];
  cities: City[];
}

interface EnhancedParcel extends Parcel {
  receiverCountryValidation: string;
  receiverCityValidation: string;
  paymentTypeValidation: string;
  hasErrors: boolean;
}

const CSVParcelCreatePage: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [validatedData, setValidatedData] = useState<ValidatedData | null>(
    null
  );
  const [processedData, setProcessedData] = useState<EnhancedParcel[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const navigate = useNavigate();

  const validateUniqueValues = async (uniqueValues: any) => {
    try {
      const response = await axiosInstance.post(
        "/csv/validate-entities",
        uniqueValues
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Validation error", error);
      return null;
    }
  };
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsProcessing(true);
      try {
        const parsedData = await parseCSVFile(file);
        console.log("Parsed CSV Data:", parsedData);

        const filteredData = parsedData.filter((row) => {
          return (
            row["Receiver Name"] ||
            row["Receiver Phone Number"] ||
            row["Receiver Address"]
          );
        });

        setCsvData(filteredData);

        const uniqueValues = extractUniqueValuesFromCSV(filteredData);
        const validationResults = await validateUniqueValues(uniqueValues);

        setValidatedData(validationResults);

        const processed = prepareDataForSubmission(
          filteredData,
          validationResults
        );

        setProcessedData(processed);
      } catch (error) {
        console.error("Error processing CSV file:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [validateUniqueValues]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"], // Specify MIME type and extensions
    },
  });

  const prepareDataForSubmission = (
    csvData: any[],
    validationResults: ValidatedData
  ): EnhancedParcel[] => {
    const processed = csvData.map((row) => {
      let receiverCountry = validationResults.countries.find(
        (country) => country._id === row["Receiver Country"]
      );
      if (!receiverCountry) {
        receiverCountry = validationResults.countries.find(
          (country) =>
            country.name.toLowerCase() === row["Receiver Country"].toLowerCase()
        );
      }

      let receiverCity = validationResults.cities.find(
        (city) =>
          city._id === row["Receiver City"] &&
          city.countryId === receiverCountry?._id
      );
      if (!receiverCity && receiverCountry) {
        receiverCity = validationResults.cities.find(
          (city) =>
            city.name.toLowerCase() === row["Receiver City"].toLowerCase() &&
            city.countryId === receiverCountry?._id
        );
      }

      const paymentTypeValid = Object.values(PaymentType).includes(
        row["Payment Type"] as PaymentType
      );

      const discountTypeValid = Object.values(DiscountType).includes(
        row["Discount Type"] as DiscountType
      );

      const taxTypeValid = Object.values(TaxType).includes(
        row["Tax Type"] as TaxType
      );

      const paymentType = paymentTypeValid
        ? (row["Payment Type"] as PaymentType)
        : PaymentType.PayBySender;

      const discountType = discountTypeValid
        ? (row["Discount Type"] as DiscountType)
        : DiscountType.Percentage; // Or choose a default value

      const taxType = taxTypeValid
        ? (row["Tax Type"] as TaxType)
        : TaxType.Percentage; // Or choose a default value
      const receiverCountryValidation = receiverCountry
        ? receiverCountry.name
        : `${row["Receiver Country"]} (Country Not Found)`;

      const receiverCityValidation = receiverCity
        ? receiverCity.name
        : `${row["Receiver City"]} (City Not Found)`;

      const paymentTypeValidation = paymentTypeValid
        ? row["Payment Type"]
        : `${row["Payment Type"]} (Invalid Payment Type)`;

      const discountTypeValidation = discountTypeValid
        ? row["Discount Type"]
        : `${row["Discount Type"]} (Invalid Discount Type)`;

      const taxTypeValidation = taxTypeValid
        ? row["Tax Type"]
        : `${row["Tax Type"]} (Invalid Tax Type)`;

      const rowHasErrors =
        receiverCountryValidation.includes("Not Found") ||
        receiverCityValidation.includes("Not Found") ||
        paymentTypeValidation.includes("Invalid Payment Type") ||
        discountTypeValidation.includes("Invalid Discount Type") ||
        taxTypeValidation.includes("Invalid Tax Type");

      return {
        receiver: {
          name: row["Receiver Name"] || "",
          phoneNumber: row["Receiver Phone Number"] || "",
          address: row["Receiver Address"] || "",
          countryId: receiverCountry?._id || "",
          cityId: receiverCity?._id || "",
          zip: row["Receiver Zip"] || "",
        },
        deliveryFees: parseFloat(row["Delivery Fees"]) || 0,
        weight: parseFloat(row["Weight"]) || 0,
        size: parseFloat(row["Size"]) || 0,
        discountValue: parseFloat(row["Discount Value"]) || 0,
        taxValue: parseFloat(row["Tax Value"]) || 0,
        paymentType: paymentType,
        discountType: discountType,
        taxType: taxType,
        creditDueDate:
          paymentType === PaymentType.CreditTerms
            ? new Date(row["Credit Due Date"]).toISOString()
            : undefined,
        remark: row["Remark"] || "",
        paymentTypeValidation,
        receiverCountryValidation,
        receiverCityValidation,
        hasErrors: rowHasErrors,
      } as EnhancedParcel;
    });

    setHasErrors(processed.some((row) => row.hasErrors));

    return processed;
  };

  const parseCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error.message),
      });
    });
  };

  const extractUniqueValuesFromCSV = (csvData: any[]) => {
    const uniqueValues = {
      countries: new Set<string>(),
      cities: new Set<string>(),
    };

    csvData.forEach((row) => {
      if (row["Receiver Country"])
        uniqueValues.countries.add(row["Receiver Country"]);
      if (row["Receiver City"]) uniqueValues.cities.add(row["Receiver City"]);
    });

    return {
      countries: Array.from(uniqueValues.countries),
      cities: Array.from(uniqueValues.cities),
    };
  };

  const handleSubmit = async (values: any) => {
    if (!validatedData) {
      toast.error("Please upload and validate a CSV file first.");
      return;
    }
    console.log("Values", values);
    if (!values.shipper) {
      toast.error("Please select a Shipper.");
      return;
    }

    if (!values.initialWarehouse) {
      toast.error("Please select an Initial Warehouse.");
      return;
    }

    const parcels = prepareDataForSubmission(csvData, validatedData);

    const sanitizedParcels = parcels.map(
      ({
        paymentTypeValidation,
        receiverCountryValidation,
        receiverCityValidation,
        hasErrors,
        discountType,
        taxType,
        ...rest
      }) => rest
    );

    console.log("Sanitized parcels:", sanitizedParcels);

    const hasInvalidData = parcels.some((parcel) => {
      return (
        !parcel.receiver.countryId ||
        !parcel.receiver.cityId ||
        parcel.paymentTypeValidation.includes("Invalid Payment Type")
      );
    });

    if (hasInvalidData) {
      toast.error(
        "Submission failed: Some parcels have missing or invalid data, including Payment Type, country, or city."
      );
      return;
    }

    try {
      const response = await axiosInstance.post("/csv/create-parcels", {
        parcels: sanitizedParcels,
        initialWarehouseId: values.initialWarehouse,
        shipperId: values.shipper,
      });
      if (response.status === 200) {
        toast.success("Parcels created successfully!");
        navigate("/dashboard/parcel");
      }
    } catch (error) {
      console.error("Error submitting parcels", error);
      toast.error("Failed to create parcels. Please try again.");
    }
  };

  const handleReupload = () => {
    setCsvData([]);
    setValidatedData(null);
    setProcessedData([]);
    setHasErrors(false);
  };

  const downloadCSVWithErrors = () => {
    const csvErrors = processedData.map((row) => ({
      "Receiver Name": row.receiver.name,
      "Receiver Phone Number": row.receiver.phoneNumber,
      "Receiver Address": row.receiver.address,
      "Receiver City": row.receiverCityValidation,
      "Receiver Country": row.receiverCountryValidation,
      "Receiver Zip": row.receiver.zip,
      "Delivery Fees": row.deliveryFees,
      Weight: row.weight,
      Size: row.size,
      "Discount Value": row.discountValue,
      "Discount Type": row.discountType,
      "Tax Value": row.taxValue,
      "Tax Type": row.taxType,
      "Payment Type": row.paymentTypeValidation,
    }));

    const csvContent = Papa.unparse(csvErrors);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "processed_data_with_errors.csv");
    link.click();
  };

  return (
    <Page title="CSV Parcel Create Page">
      <div className="w-full mx-auto p-4">
        {!csvData.length && (
          <div
            {...getRootProps()}
            className={`border-4 border-dashed p-6 rounded-md cursor-pointer text-center ${
              isDragActive ? "border-green-600" : "border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop a CSV file here, or click to select a file</p>
            )}
          </div>
        )}
        {isProcessing && <div className="text-center">Processing...</div>}
        {hasErrors && (
          <div className="text-red-500 text-center mb-4">
            There are errors with the CSV file. Please review the highlighted
            rows.
          </div>
        )}
        {processedData.length > 0 && !isProcessing && validatedData && (
          <Formik
            initialValues={{ shipper: "", initialWarehouse: "" }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  name="shipper"
                  as={ShipperSelector}
                  label="Select Shipper"
                  className="mb-4"
                />
                <Field
                  name="initialWarehouse"
                  as={WarehouseSelector}
                  label="Select Initial Warehouse"
                  className="mb-4"
                />
                <CSVParcelGrid
                  preparedData={processedData}
                  validatedData={validatedData}
                  columnDefs={getColumnDefs()}
                  rowStyle={getRowStyle}
                />
                <div className="flex justify-between mt-4">
                  {!hasErrors && (
                    <button
                      type="submit"
                      disabled={isSubmitting || !csvData.length}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      {isSubmitting ? "Processing..." : "Submit"}
                    </button>
                  )}
                  {hasErrors && (
                    <button
                      type="button"
                      onClick={downloadCSVWithErrors}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Download CSV with Errors
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReupload}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 ml-2"
                  >
                    Re-upload CSV
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Page>
  );
};

// Define the row style function to highlight rows with errors
const getRowStyle = (params: any) => {
  if (params.data && params.data.hasErrors) {
    return { backgroundColor: "#f8d7da" }; // Light red background
  }
  return null;
};

const getColumnDefs = (): ColDef<any>[] => {
  return [
    { headerName: "Receiver Name", field: "receiver.name" },
    { headerName: "Phone Number", field: "receiver.phoneNumber" },
    { headerName: "Address", field: "receiver.address" },
    {
      headerName: "City",
      field: "receiverCityValidation",
      cellStyle: (params: any) =>
        params.value.includes("Not Found") ? { color: "red" } : null,
    },
    {
      headerName: "Country",
      field: "receiverCountryValidation",
      cellStyle: (params: any) =>
        params.value.includes("Not Found") ? { color: "red" } : null,
    },
    { headerName: "Zip", field: "receiver.zip" },
    { headerName: "Delivery Fees", field: "deliveryFees" },
    { headerName: "Weight", field: "weight" },
    { headerName: "Size", field: "size" },
    { headerName: "Discount Value", field: "discountValue" },
    { headerName: "Tax Value", field: "taxValue" },
    {
      headerName: "Payment Type",
      field: "paymentTypeValidation",
      cellStyle: (params: any) =>
        params.value.includes("Invalid Payment Type") ? { color: "red" } : null,
    },
  ];
};

export default CSVParcelCreatePage;
