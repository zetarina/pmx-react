import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { City } from "../../models/City";
import { AppDispatch } from "../../store";
import { updateCity, createCity } from "../../store/slices/citySlice";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import CountrySelector from "../inputs/CountrySelector";
import CustomForm from "./CustomForm";

interface CityFormProps {
  currentCity?: City;
  onSuccess: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ currentCity, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const initialValues = {
    name: currentCity ? currentCity.name : "",
    countryId: currentCity ? currentCity.countryId : "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    countryId: Yup.string().required("Country is required"),
  });

  const handleSubmit = async (
    values: City,
    { setSubmitting }: FormikHelpers<City>
  ) => {
    const newCity: City = { name: values.name, countryId: values.countryId };
    try {
      if (currentCity && currentCity._id) {
        const result = await dispatch(
          updateCity({ ...newCity, _id: currentCity._id })
        );
        if (updateCity.fulfilled.match(result)) {
          toast.success("City updated successfully");
          onSuccess();
        } else if (updateCity.rejected.match(result)) {
          toast.error("Failed to update city");
        }
      } else {
        const createResult = await dispatch(createCity(newCity));
        if (createCity.fulfilled.match(createResult)) {
          toast.success("City created successfully");
          onSuccess();
        } else if (createCity.rejected.match(createResult)) {
          toast.error("Failed to create city");
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
      title="City Form"
      buttonText={currentCity ? "Update" : "Create"}
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
          <Field as={CountrySelector} name="countryId" />
        </>
      )}
    </CustomForm>
  );
};

export default CityForm;
