import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Loading from "./Loading";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const handleStopLoading = () => setLoading(false);
    handleStopLoading();
    return () => handleStopLoading();
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const isLoading = loading || authLoading;

  return (
    <div className="relative flex min-h-screen">
      <button
        className={`fixed top-0 left-0 z-60 flex items-center justify-center w-11 h-11 p-1 m-4 focus:outline-none bg-white border border-black rounded-full transition-all duration-300 ${isSidebarOpen ? "translate-x-72" : ""
          }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 6H20M4 12H14M4 18H9"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-0"
          }`}
      >
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            {children}
            <Outlet />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
