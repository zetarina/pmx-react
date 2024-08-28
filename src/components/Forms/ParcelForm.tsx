import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { fetchWarehouses } from "../../store/slices/warehouseSlice";
import { createParcel, updateParcel } from "../../store/slices/parcelSlice";
import CustomForm from "./CustomForm";
import ShipperSelector from "../inputs/ShipperSelector";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import BasicContactInfoInput from "../inputs/BasicContactInfoInput";
import WarehouseSelector from "../inputs/WarehouseSelector";
import PaymentTypeSelector from "../inputs/PaymentTypeSelector";
import SenderTypeSelector from "../inputs/SenderTypeSelector";
import {
  Parcel,
  SenderType,
  PaymentType,
  DiscountType,
  TaxType,
} from "../../models/Parcel";
import { AppDispatch } from "../../store";

interface ParcelFormProps {
  currentParcel?: Parcel;
  onSuccess: () => void;
}

const ParcelForm: React.FC<ParcelFormProps> = ({
  currentParcel,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: Parcel & { initialWarehouseId: string } = {
    sender: {
      type: currentParcel?.sender.type || SenderType.Shipper,
      shipper_id: currentParcel?.sender.shipper_id || "",
      guest: currentParcel?.sender.guest || {
        name: "",
        phoneNumber: "",
        address: "",
        countryId: "",
        cityId: "",
        zip: "",
      },
    },
    receiver: currentParcel?.receiver || {
      name: "",
      phoneNumber: "",
      address: "",
      countryId: "",
      cityId: "",
      zip: "",
    },
    deliveryFees: currentParcel?.deliveryFees || 0,
    weight: currentParcel?.weight || 0,
    size: currentParcel?.size || 0,
    discountValue: currentParcel?.discountValue || 0,
    discountType: currentParcel?.discountType || DiscountType.Flat,
    taxValue: currentParcel?.taxValue || 0,
    taxType: currentParcel?.taxType || TaxType.Flat,
    paymentType: currentParcel?.paymentType || PaymentType.PayBySender,
    creditDueDate: currentParcel?.creditDueDate
      ? new Date(currentParcel.creditDueDate)
      : undefined,
    remark: currentParcel?.remark || "",
    initialWarehouseId: "",
  };

  const validationSchema = Yup.object().shape({
    sender: Yup.object().shape({
      type: Yup.string().required("Required"),
      shipper_id: Yup.string().when("type", {
        is: (value: any) => value === SenderType.Shipper,
        then: (schema) => schema.required("Required for Shipper"),
        otherwise: (schema) => schema.notRequired(),
      }),
      guest: Yup.object().shape({
        name: Yup.string().when("type", {
          is: SenderType.Guest,
          then: (schema) => schema.required("Guest name is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        phoneNumber: Yup.string().when("type", {
          is: SenderType.Guest,
          then: (schema) => schema.required("Guest phone number is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        address: Yup.string().when("type", {
          is: SenderType.Guest,
          then: (schema) => schema.required("Guest address is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        countryId: Yup.string().when("type", {
          is: SenderType.Guest,
          then: (schema) => schema.required("Guest country is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        cityId: Yup.string().when("type", {
          is: SenderType.Guest,
          then: (schema) => schema.required("Guest city is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        zip: Yup.string().when("type", {
          is: SenderType.Guest,
          then: (schema) => schema.required("Guest ZIP code is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
    }),
    receiver: Yup.object().shape({
      name: Yup.string().required("Receiver name is required"),
      phoneNumber: Yup.string().required("Receiver phone number is required"),
      address: Yup.string().required("Receiver address is required"),
      countryId: Yup.string().required("Receiver country is required"),
      cityId: Yup.string().required("Receiver city is required"),
      zip: Yup.string().required("Receiver ZIP code is required"),
    }),
    deliveryFees: Yup.number().required("Delivery fees is required"),
    weight: Yup.number().required("Weight is required"),
    size: Yup.number().required("Size is required"),
    discountValue: Yup.number().required("Discount value is required"),
    discountType: Yup.string().required("Discount type is required"),
    taxValue: Yup.number().required("Tax value is required"),
    taxType: Yup.string().required("Tax type is required"),
    paymentType: Yup.string().required("Payment type is required"),
    creditDueDate: Yup.date().when("paymentType", {
      is: (value: any) => value === PaymentType.CreditTerms,
      then: (schema) =>
        schema.required("Credit due date is required for Credit Terms"),
      otherwise: (schema) => schema.notRequired(),
    }),
    remark: Yup.string(),
    initialWarehouseId: Yup.string().when([], {
      is: () => !currentParcel,
      then: (schema) => schema.required("Initial warehouse is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleFormSubmit = async (
    values: Parcel & { initialWarehouseId: string },
    { setSubmitting }: FormikHelpers<Parcel & { initialWarehouseId: string }>
  ) => {
    try {
      const { initialWarehouseId, ...parcelValues } = values;
      if (currentParcel && currentParcel._id) {
        const result = await dispatch(
          updateParcel({ ...parcelValues, _id: currentParcel._id })
        );
        if (updateParcel.fulfilled.match(result)) {
          // Handle successful update
          console.log("Parcel updated successfully", result.payload.data);
          toast.success("Parcel updated successfully!");
          onSuccess();
        } else if (updateParcel.rejected.match(result)) {
          // Handle error
          console.error("Error updating parcel", result.payload);
          toast.error("Failed to update parcel!");
        }
      } else {
        const createResult = await dispatch(
          createParcel({
            parcel: parcelValues,
            initialWarehouseId: initialWarehouseId,
          })
        );
        if (createParcel.fulfilled.match(createResult)) {
          toast.success("Parcel created successfully!");
          onSuccess();
        } else if (createParcel.rejected.match(createResult)) {
          toast.error("Failed to create parcel!");
        }
      }
    } catch (error) {
      toast.error("Failed to save parcel!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={handleFormSubmit}
      title={currentParcel ? "Update Parcel" : "Create Parcel"}
      buttonText={currentParcel ? "Update Parcel" : "Create Parcel"}
      debug={false}
    >
      {(formikProps) => (
        <>
          <div className="w-full flex flex-wrap border shadow-md my-2 rounded p-2">
            {!currentParcel && (
              <Field
                name="initialWarehouseId"
                as={WarehouseSelector}
                className="w-full md:w-1/2"
              />
            )}
            <Field
              name="sender.type"
              as={SenderTypeSelector}
              className="w-full md:w-1/2"
            />
          </div>

          <div className="w-full flex flex-wrap border shadow-md my-2 rounded p-2">
            {formikProps.values.sender.type === SenderType.Shipper ? (
              <Field
                name="sender.shipper_id"
                as={ShipperSelector}
                className="w-full"
              />
            ) : (
              <>
                <Field
                  as={CustomFormikInputBox}
                  type="text"
                  label="Guest Name"
                  name="sender.guest.name"
                  required
                  className="w-full md:w-1/2"
                />
                <Field
                  component={BasicContactInfoInput}
                  phoneNumberField="sender.guest.phoneNumber"
                  addressField="sender.guest.address"
                  countryField="sender.guest.countryId"
                  cityField="sender.guest.cityId"
                  zipField="sender.guest.zip"
                />
              </>
            )}
          </div>
          <div className="w-full flex flex-wrap border shadow-md my-2 rounded p-2">
            <Field
              as={CustomFormikInputBox}
              type="text"
              label="Receiver Name"
              name="receiver.name"
              required
              className="w-full md:w-1/3"
            />
            <Field
              component={BasicContactInfoInput}
              phoneNumberField="receiver.phoneNumber"
              addressField="receiver.address"
              zipField="receiver.zip"
              countryField="receiver.countryId"
              cityField="receiver.cityId"
            />
          </div>
          <div className="w-full flex flex-wrap border shadow-md my-2 rounded p-2">
            <Field
              as={CustomFormikInputBox}
              type="number"
              label="Weight"
              name="weight"
              className="w-full md:w-1/5"
              required
            />
            <Field
              as={CustomFormikInputBox}
              type="number"
              label="Size"
              name="size"
              className="w-full md:w-1/5"
              required
            />
            <Field
              as={CustomFormikInputBox}
              type="number"
              label="Delivery Fees"
              name="deliveryFees"
              className="w-full md:w-1/5"
              required
            />
            <Field
              name="paymentType"
              className="w-full md:w-1/5"
              as={PaymentTypeSelector}
            />

            {formikProps.values.paymentType === PaymentType.CreditTerms && (
              <Field
                as={CustomFormikInputBox}
                type="date"
                className="w-full md:w-1/5"
                label="Credit Due Date"
                name="creditDueDate"
                required
              />
            )}
            <div className="w-full flex flex-wrap">
              <Field
                as={CustomFormikInputBox}
                type="number"
                label="Discount Value"
                name="discountValue"
                className="w-full md:w-1/2"
                required
              />
              <Field
                as={CustomFormikInputBox}
                type="select"
                label="Discount Type"
                name="discountType"
                className="w-full md:w-1/2"
                options={[
                  { value: DiscountType.Flat, name: "Flat" },
                  { value: DiscountType.Percentage, name: "Percentage" },
                ]}
              />
            </div>

            <div className="w-full flex flex-wrap">
              <Field
                as={CustomFormikInputBox}
                type="number"
                label="Tax Value"
                name="taxValue"
                className="w-full md:w-1/2"
                required
              />
              <Field
                as={CustomFormikInputBox}
                type="select"
                label="Tax Type"
                name="taxType"
                className="w-full md:w-1/2"
                options={[
                  { value: TaxType.Flat, name: "Flat" },
                  { value: TaxType.Percentage, name: "Percentage" },
                ]}
              />
            </div>

            <Field
              as={CustomFormikInputBox}
              type="textarea"
              label="Remark"
              name="remark"
              className="w-full"
            />
          </div>
        </>
      )}
    </CustomForm>
  );
};

export default ParcelForm;
