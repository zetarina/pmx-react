import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import Auth from "../class/Auth";
import CustomFormikInputBox from "../components/inputs/common/CustomFormikInputBox";
import CustomForm from "../components/Forms/CustomForm";

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: "system@example.com",
  password: "SystemPassword",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      await Auth.login(values.email, values.password);
      navigate("/dashboard");
    } catch (error: any) {
      // Use the error message from Auth.login or set a default one
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <CustomForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={handleSubmit}
          title="Sign in to your account"
          buttonText="Sign in"
          loadingText="Signing In"
        >
          {(formikProps) => (
            <div className="space-y-6 w-full">
              <CustomFormikInputBox
                type="email"
                label="Email address"
                name="email"
                required
                className="w-full"
              />
              <CustomFormikInputBox
                type="password"
                label="Password"
                name="password"
                required
                className="w-full"
              />
            </div>
          )}
        </CustomForm>
      </div>
    </div>
  );
};

export default LoginPage;
