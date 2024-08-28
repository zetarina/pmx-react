import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Country } from "../../models/Country";
import { AppDispatch } from "../../store";
import { updateCountry, createCountry } from "../../store/slices/countrySlice";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import CustomForm from "./CustomForm";

interface CountryFormProps {
  currentCountry?: Country;
  onSuccess: () => void;
}

const CountryForm: React.FC<CountryFormProps> = ({
  currentCountry,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const initialValues = {
    code: currentCountry ? currentCountry.code : "",
    name: currentCountry ? currentCountry.name : "",
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (
    values: Country,
    { setSubmitting }: FormikHelpers<Country>
  ) => {
    const newCountry: Country = { code: values.code, name: values.name };
    try {
      if (currentCountry && currentCountry._id) {
        const result = await dispatch(
          updateCountry({ ...newCountry, _id: currentCountry._id })
        );
        if (updateCountry.fulfilled.match(result)) {
          toast.success("Country updated successfully");
          onSuccess();
        } else if (updateCountry.rejected.match(result)) {
          toast.error("Failed to update country");
        }
      } else {
        const createResult = await dispatch(createCountry(newCountry));
        if (createCountry.fulfilled.match(createResult)) {
          toast.success("Country created successfully");
          onSuccess();
        } else if (createCountry.rejected.match(createResult)) {
          toast.error("Failed to create country");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={handleSubmit}
      title="Country Form"
      buttonText={currentCountry ? "Update" : "Create"}
    >
      {(formikProps) => (
        <>
          <Field
            as={CustomFormikInputBox}
            type="text"
            label="Name"
            name="name"
            required
          />
          <Field
            as={CustomFormikInputBox}
            type="text"
            label="Code"
            name="code"
            required
          />
        </>
      )}
    </CustomForm>
  );
};

export default CountryForm;
