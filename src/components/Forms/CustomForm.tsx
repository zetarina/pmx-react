import React from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import CustomButton from "../inputs/common/CustomButton";
import { ButtonType } from "../core/cssConfig";

interface CustomFormProps<T extends Yup.AnyObject> {
  title: string;
  handleSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => void | Promise<any>;
  buttonText: string;
  children: (formikProps: FormikProps<T>) => React.ReactNode;
  darkMode?: boolean;
  validationSchema?: Yup.AnyObjectSchema;
  className?: string;
  initialValues: T;
  debug?: boolean;
  loadingText?: string;
}

const CustomForm = <T extends Yup.AnyObject>({
  title,
  handleSubmit,
  buttonText,
  children,
  darkMode = false,
  className = "flex w-full flex-wrap",
  validationSchema,
  initialValues,
  debug = false,
  loadingText = "Submitting...",
}: CustomFormProps<T>) => {
  const formContainerClass = "w-full";
  const formHeaderClass = darkMode
    ? "text-2xl font-bold mb-4 ml-2 w-full text-white"
    : "text-2xl font-bold mb-4 ml-2 w-full";

  return (
    <div className={formContainerClass}>
      <Formik<T>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount={false}
        validateOnChange={false}
      >
        {(formikProps: FormikProps<T>) => {
          const { errors, isSubmitting } = formikProps;

          return (
            <Form className={className}>
              <h1 className={formHeaderClass}>{title}</h1>
              {children(formikProps)}
              {Object.keys(errors).length > 0 && debug && (
                <div className="text-red-500">
                  {JSON.stringify(errors, null, 2)}
                </div>
              )}
              <div className="w-full ml-2">
                <CustomButton
                  type={ButtonType.SUBMIT}
                  className="text-white font-bold py-2 px-4 rounded mt-4"
                  colorClassName={
                    Object.keys(errors).length > 0
                      ? "bg-red-500"
                      : "bg-green-500"
                  }
                  hoverClassName={
                    Object.keys(errors).length > 0
                      ? "hover:bg-red-700"
                      : "hover:bg-green-700"
                  }
                  loading={isSubmitting}
                  loadingText={loadingText}
                >
                  {buttonText}
                </CustomButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CustomForm;
