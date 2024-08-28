import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { updateUserPassword } from "../../store/slices/userSlice";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import { AppDispatch } from "../../store";

interface PasswordUpdateFormProps {
  userId: string;
  onSuccess: () => void;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({
  userId,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues = { password: "" };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values: { password: string },
    { setSubmitting }: FormikHelpers<{ password: string }>
  ) => {
    try {
      await dispatch(
        updateUserPassword({ id: userId, password: values.password })
      );
      toast.success("Password updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("An error occurred");
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
        <Form>
          <Field
            as={CustomFormikInputBox}
            type="password"
            label="Password"
            name="password"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            Update Password
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordUpdateForm;
