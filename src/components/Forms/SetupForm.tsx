import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";

interface SetupFormProps {
  onSuccess: () => void;
}

interface SetupFormValues {
  countryCode: string;
  countryName: string;
  cityName: string;
  superAdminUsername: string;
  superAdminEmail: string;
  superAdminPassword: string;
  systemUsername: string;
  systemEmail: string;
  systemPassword: string;
}

const SetupForm: React.FC<SetupFormProps> = ({ onSuccess }) => {
  const initialValues: SetupFormValues = {
    countryCode: "",
    countryName: "",
    cityName: "",
    superAdminUsername: "",
    superAdminEmail: "",
    superAdminPassword: "",
    systemUsername: "",
    systemEmail: "",
    systemPassword: "",
  };

  const validationSchema = Yup.object().shape({
    countryCode: Yup.string().required("Country Code is required"),
    countryName: Yup.string().required("Country Name is required"),
    cityName: Yup.string().required("City Name is required"),
    superAdminUsername: Yup.string().required("Super Admin Username is required"),
    superAdminEmail: Yup.string()
      .email("Invalid email")
      .required("Super Admin Email is required"),
    superAdminPassword: Yup.string().required("Super Admin Password is required"),
    systemUsername: Yup.string().required("System Username is required"),
    systemEmail: Yup.string()
      .email("Invalid email")
      .required("System Email is required"),
    systemPassword: Yup.string().required("System Password is required"),
  });

  const handleSubmit = async (
    values: SetupFormValues,
    { setSubmitting }: FormikHelpers<SetupFormValues>
  ) => {
    try {
      const response = await axios.post("/api/setup", values);
      if (response.status === 201) {
        toast.success("Setup completed successfully");
        onSuccess();
      } else {
        toast.error("Failed to complete setup");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="p-6 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-4">System Setup</h2>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="Country Code"
              name="countryCode"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="Country Name"
              name="countryName"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="City Name"
              name="cityName"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="Super Admin Username"
              name="superAdminUsername"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="Super Admin Email"
              name="superAdminEmail"
              type="email"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="Super Admin Password"
              name="superAdminPassword"
              type="password"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="System Username"
              name="systemUsername"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="System Email"
              name="systemEmail"
              type="email"
              required
            />
          </div>
          <div className="mb-4">
            <Field
              as={CustomFormikInputBox}
              label="System Password"
              name="systemPassword"
              type="password"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isSubmitting ? "Setting up..." : "Complete Setup"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SetupForm;
