import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { Warehouse } from "../../models/Warehouse";
import {
  updateWarehouse,
  createWarehouse,
} from "../../store/slices/warehouseSlice";
import CustomForm from "./CustomForm";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import CountryCitySelector from "../inputs/CountryCitySelector";
import { AppDispatch } from "../../store";

interface WarehouseFormProps {
  currentWarehouse?: Warehouse;
  onSuccess: () => void;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({
  currentWarehouse,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: Warehouse = {
    name: currentWarehouse ? currentWarehouse.name : "",
    location: {
      address: currentWarehouse ? currentWarehouse.location.address : "",
      cityId: currentWarehouse ? currentWarehouse.location.cityId : "",
      countryId: currentWarehouse ? currentWarehouse.location.countryId : "",
    },
    capacity: currentWarehouse ? currentWarehouse.capacity : 0,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    location: Yup.object().shape({
      address: Yup.string().required("Address is required"),
      cityId: Yup.string().required("City is required"),
      countryId: Yup.string().required("Country is required"),
    }),
    capacity: Yup.number()
      .required("Capacity is required")
      .min(0, "Capacity must be at least 0"),
  });

  const handleSubmit = async (
    values: Warehouse,
    { setSubmitting }: FormikHelpers<Warehouse>
  ) => {
    try {
      if (currentWarehouse && currentWarehouse._id) {
        const result = await dispatch(
          updateWarehouse({ ...values, _id: currentWarehouse._id })
        );
        if (updateWarehouse.fulfilled.match(result)) {
          toast.success("Warehouse updated successfully");
          onSuccess();
        } else if (updateWarehouse.rejected.match(result)) {
          toast.error("Failed to update warehouse");
        }
      } else {
        const createResult = await dispatch(createWarehouse(values));
        if (createWarehouse.fulfilled.match(createResult)) {
          toast.success("Warehouse created successfully");
          onSuccess();
        } else if (createWarehouse.rejected.match(createResult)) {
          toast.error("Failed to create warehouse");
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
      title={currentWarehouse ? "Update Warehouse" : "Create Warehouse"}
      buttonText={currentWarehouse ? "Update" : "Create"}
      handleSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <>
          <CustomFormikInputBox type="text" label="Name" name="name" required />
          <CustomFormikInputBox
            type="number"
            label="Capacity"
            name="capacity"
            required
          />
          <CustomFormikInputBox
            className="w-full"
            type="textarea"
            label="Address"
            name="location.address"
            required
          />
          <CountryCitySelector
            countryField="location.countryId"
            cityField="location.cityId"
          />
        </>
      )}
    </CustomForm>
  );
};

export default WarehouseForm;
