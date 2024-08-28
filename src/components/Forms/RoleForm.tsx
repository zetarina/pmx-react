import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Role, PermissionsObject } from "../../models/Role";
import { PermissionsList, groupedPermissions, RoleType } from "../../models/permissions";
import { updateRole, createRole } from "../../store/slices/roleSlice";
import { AppDispatch } from "../../store";
import CustomFormikInputBox from "../inputs/common/CustomFormikInputBox";
import CustomForm from "./CustomForm";

interface RoleFormProps {
  currentRole?: Role;
  onSuccess: () => void;
}

interface RoleFormValues {
  name: string;
  permissions: PermissionsObject;
  roleType: RoleType;
}

const initializePermissions = (defaultValue: boolean = false): PermissionsObject => {
  return Object.fromEntries(
    Object.values(PermissionsList).map((permission) => [permission, defaultValue])
  ) as PermissionsObject;
};

const RoleForm: React.FC<RoleFormProps> = ({ currentRole, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();

  const isSuperAdmin = currentRole?._id === "6652283e71f2001edc9e2de0";
  
  const initialValues: RoleFormValues = {
    name: currentRole ? currentRole.name : "",
    permissions: isSuperAdmin
      ? initializePermissions(true)
      : currentRole
      ? currentRole.permissions
      : initializePermissions(),
    roleType: currentRole?.isShipper
      ? RoleType.Shipper
      : currentRole?.isDriver
      ? RoleType.Driver
      : RoleType.Admin,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    roleType: Yup.string().required("Role type is required"),
  });

  const handleSubmit = async (
    values: RoleFormValues,
    { setSubmitting }: FormikHelpers<RoleFormValues>
  ) => {
    if (isSuperAdmin) {
      toast.error("Super Admin permissions cannot be modified.");
      setSubmitting(false);
      return;
    }

    const allPermissions = initializePermissions();
    const rolePermissions = groupedPermissions[values.roleType as keyof typeof groupedPermissions] || [];

    const permissionsToSubmit: PermissionsObject = {
      ...allPermissions,
      ...Object.fromEntries(
        Object.entries(values.permissions).map(([permission, allowed]) => [
          permission,
          rolePermissions.includes(permission as PermissionsList) ? allowed : false,
        ])
      ),
    };

    const newRole: Role = {
      name: values.name,
      permissions: permissionsToSubmit,
      isShipper: values.roleType === RoleType.Shipper,
      isDriver: values.roleType === RoleType.Driver,
    };

    try {
      if (currentRole && currentRole._id) {
        const result = await dispatch(
          updateRole({ ...newRole, _id: currentRole._id })
        );
        if (updateRole.fulfilled.match(result)) {
          toast.success("Role updated successfully");
          onSuccess();
        } else if (updateRole.rejected.match(result)) {
          toast.error("Failed to update role");
        }
      } else {
        const createResult = await dispatch(createRole(newRole));
        if (createRole.fulfilled.match(createResult)) {
          toast.success("Role created successfully");
          onSuccess();
        } else if (createRole.rejected.match(createResult)) {
          toast.error("Failed to create role");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const renderPermissions = (formik: any) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedPermissions).map(([category, permissions]) => (
          <div key={category} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {category} Permissions:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {permissions.map((permission) => {
                const isPermissionAllowed =
                  (formik.values.roleType === RoleType.Admin &&
                    !groupedPermissions.driver.includes(permission) &&
                    !groupedPermissions.shipper.includes(permission)) ||
                  (formik.values.roleType === RoleType.Driver &&
                    groupedPermissions.driver.includes(permission)) ||
                  (formik.values.roleType === RoleType.Shipper &&
                    groupedPermissions.shipper.includes(permission));

                return (
                  <div key={permission} className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      name={`permissions.${permission}`}
                      id={`permission-${permission}`}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={!isPermissionAllowed || isSuperAdmin || formik.values.roleType === RoleType.Admin && 
                                (groupedPermissions.driver.includes(permission) || groupedPermissions.shipper.includes(permission))}
                      checked={formik.values.permissions[permission]}
                    />
                    <label
                      htmlFor={`permission-${permission}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {permission.replace(/_/g, " ").toUpperCase()}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <CustomForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={handleSubmit}
      title="Role Form"
      buttonText={currentRole ? "Update" : "Create"}
    >
      {(formikProps) => (
        <>
          <div className="mb-4 w-full flex flex-wrap">
            <Field
              as={CustomFormikInputBox}
              type="text"
              label="Name"
              name="name"
              required
              className="w-full mb-4"
              disabled={isSuperAdmin}
            />
            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                Role Type
              </label>
              <div className="flex items-center">
                <Field
                  type="radio"
                  name="roleType"
                  value={RoleType.Admin}
                  className="mr-2"
                  disabled={isSuperAdmin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formikProps.setFieldValue("roleType", e.target.value);
                    const newPermissions = initializePermissions(false);

                    // Handle the admin role to include all non-shipper and non-driver permissions
                    if (e.target.value === RoleType.Admin) {
                      Object.keys(newPermissions).forEach((permission) => {
                        if (!groupedPermissions.driver.includes(permission as PermissionsList) &&
                            !groupedPermissions.shipper.includes(permission as PermissionsList)) {
                          newPermissions[permission as keyof PermissionsObject] = true;
                        }
                      });
                    } else {
                      const allowedPermissions = groupedPermissions[e.target.value as keyof typeof groupedPermissions];
                      allowedPermissions.forEach((permission) => {
                        newPermissions[permission] = true;
                      });
                    }

                    formikProps.setFieldValue("permissions", newPermissions);
                  }}
                />
                <label className="mr-4">Admin</label>
                <Field
                  type="radio"
                  name="roleType"
                  value={RoleType.Shipper}
                  className="mr-2"
                  disabled={isSuperAdmin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formikProps.setFieldValue("roleType", e.target.value);
                    const newPermissions = initializePermissions(false);
                    const allowedPermissions = groupedPermissions[e.target.value as keyof typeof groupedPermissions];
                    allowedPermissions.forEach((permission) => {
                      newPermissions[permission] = true;
                    });
                    formikProps.setFieldValue("permissions", newPermissions);
                  }}
                />
                <label className="mr-4">Shipper</label>
                <Field
                  type="radio"
                  name="roleType"
                  value={RoleType.Driver}
                  className="mr-2"
                  disabled={isSuperAdmin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formikProps.setFieldValue("roleType", e.target.value);
                    const newPermissions = initializePermissions(false);
                    const allowedPermissions = groupedPermissions[e.target.value as keyof typeof groupedPermissions];
                    allowedPermissions.forEach((permission) => {
                      newPermissions[permission] = true;
                    });
                    formikProps.setFieldValue("permissions", newPermissions);
                  }}
                />
                <label className="mr-4">Driver</label>
              </div>
            </div>
            <div className="mb-4 lg:col-span-2">
              <div className="mt-4">
                <p className="text-gray-700 font-semibold text-2xl mb-2 underline">
                  Permissions:
                </p>
                {renderPermissions(formikProps)}
              </div>
            </div>
          </div>
        </>
      )}
    </CustomForm>
  );
};

export default RoleForm;
