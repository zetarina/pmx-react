import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { User } from "../../models/User";
import {
  updateUser,
  createUser,
  updateUserPassword,
} from "../../store/slices/userSlice";
import CustomForm from "./CustomForm";
import RoleSelector from "../inputs/RoleSelector";
import BasicContactInfoInput from "../inputs/BasicContactInfoInput";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import { AppDispatch } from "../../store";

interface UserFormProps {
  currentUser?: User;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ currentUser, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: User & { password?: string } = {
    username: currentUser ? currentUser.username : "",
    email: currentUser ? currentUser.email : "",
    roleId: currentUser ? currentUser.roleId : "",
    phoneNumber: currentUser ? currentUser.phoneNumber : "",
    address: currentUser ? currentUser.address : "",
    zip: currentUser ? currentUser.zip : "",
    cityId: currentUser ? currentUser.cityId : "",
    countryId: currentUser ? currentUser.countryId : "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    roleId: Yup.string().required("Role is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    zip: Yup.string().required("ZIP code is required"),
    cityId: Yup.string().required("City is required"),
    countryId: Yup.string().required("Country is required"),
    password: Yup.string().when([], {
      is: () => !currentUser,
      then: (schema) => schema.required("Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = async (
    values: User & { password?: string },
    { setSubmitting }: FormikHelpers<User & { password?: string }>
  ) => {
    try {
      if (currentUser && currentUser._id) {
        const result = await dispatch(
          updateUser({ id: currentUser._id, user: values })
        );
        if (updateUser.fulfilled.match(result)) {
          toast.success("User updated successfully");
          onSuccess();
        } else if (updateUser.rejected.match(result)) {
          toast.error("Failed to update user");
        }
      } else {
        const createResult = await dispatch(createUser(values));
        if (createUser.fulfilled.match(createResult)) {
          toast.success("User created successfully");
          onSuccess();
        } else if (createUser.rejected.match(createResult)) {
          toast.error("Failed to create user");
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
      title={currentUser ? "Update User" : "Create User"}
      buttonText={currentUser ? "Update" : "Create"}
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
            as={CustomFormikInputBox}
            type="email"
            label="Email"
            name="email"
            required
          />
          <Field as={RoleSelector} name="roleId" />
          <Field
            component={BasicContactInfoInput}
            phoneNumberField="phoneNumber"
            addressField="address"
            zipField="zip"
            countryField="countryId"
            cityField="cityId"
          />
          {!currentUser && (
            <Field
              as={CustomFormikInputBox}
              type="password"
              label="Password"
              name="password"
              required
            />
          )}
        </>
      )}
    </CustomForm>
  );
};

export default UserForm;
