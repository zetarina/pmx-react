import { motion } from "framer-motion";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Auth from "../class/Auth";
import { CustomError } from "../api/axiosInstance";

interface ErrorProps {
  error: CustomError;
  showLogoutButton?: boolean;
}

const ErrorComponent: React.FC<ErrorProps> = ({
  error,
  showLogoutButton = false,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Auth.logout();
  };

  const getTitle = () => {
    if (error.status === 401) {
      return "Authorization Error";
    } else if (error.status === 403) {
      return "Permission Denied";
    } else if (error.status === 500) {
      if (error.code == "ERR_NETWORK") {
        return "Network Error";
      } else {
        return "Server Error";
      }
    } else if (error.status) {
      return `Error ${error.status}`;
    } else {
      return "Error";
    }
  };

  return (
    <>
      <Helmet>
        <title>PMX - {getTitle()}</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Helmet>
      <motion.div
        className="w-full flex flex-col justify-center items-center bg-white z-50 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative flex justify-center items-center mb-20">
          <div className="absolute border-t-4 border-b-4 border-red-600 border-opacity-30 rounded-full w-24 h-24 animate-spin"></div>
          <div className="absolute border-t-4 border-b-4 border-red-600 border-opacity-30 rounded-full w-16 h-16 animate-spin-reverse"></div>
          <div className="absolute border-t-4 border-b-4 border-red-600 border-opacity-30 rounded-full w-8 h-8 animate-spin"></div>
        </div>
        {error.message && (
          <p className="text-black mt-4 text-lg font-semibold text-center">
            {error.message}
          </p>
        )}
        {token && showLogoutButton && (
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        )}
      </motion.div>
    </>
  );
};

export default ErrorComponent;
