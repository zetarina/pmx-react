import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { User } from "../../models/User";
import { updateUser } from "../../store/slices/userSlice";
import CustomForm from "./CustomForm";
import BasicContactInfoInput from "../inputs/BasicContactInfoInput";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import { AppDispatch } from "../../store";

interface ProfileFormProps {
  currentUser: User;
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  currentUser,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: User = {
    username: currentUser.username,
    email: currentUser.email,
    roleId: currentUser.roleId,
    phoneNumber: currentUser.phoneNumber,
    address: currentUser.address,
    zip: currentUser.zip,
    cityId: currentUser.cityId,
    countryId: currentUser.countryId,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    zip: Yup.string().required("ZIP code is required"),
    cityId: Yup.string().required("City is required"),
    countryId: Yup.string().required("Country is required"),
  });

  const handleSubmit = async (
    values: User,
    { setSubmitting }: FormikHelpers<User>
  ) => {
    try {
      await dispatch(updateUser({ id: currentUser._id!, user: values }));
      toast.success("Profile updated successfully");
      onSuccess();
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
      title="Update Profile"
      buttonText="Update"
    >
      {(formikProps) => (
        <>
          <Field
            as={CustomFormikInputBox}
            type="text"
            label="Username"
            name="username"
            required
          />
          <Field
            component={BasicContactInfoInput}
            phoneNumberField="phoneNumber"
            addressField="address"
            zipField="zip"
            countryField="countryId"
            cityField="cityId"
          />
        </>
      )}
    </CustomForm>
  );
};

export default ProfileForm;
