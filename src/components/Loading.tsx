import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  text?: string;
  progress?: number;
  darkMode?: boolean;
  overlayMode?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  text,
  progress,
  darkMode = false,
  overlayMode = false,
}) => {
  return (
    <motion.div
      className={`fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center 
                  ${
                    overlayMode
                      ? "bg-black bg-opacity-60"
                      : darkMode
                      ? "bg-gray-900"
                      : "bg-white"
                  } z-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex justify-center items-center mb-20">
        <div
          className={`absolute border-t-4 border-b-4 border-opacity-30 
                        ${
                          darkMode ? "border-blue-300" : "border-blue-600"
                        } rounded-full w-24 h-24 animate-spin`}
        ></div>
        <div
          className={`absolute border-t-4 border-b-4 border-opacity-30 
                        ${
                          darkMode ? "border-blue-300" : "border-blue-600"
                        } rounded-full w-16 h-16 animate-spin-reverse`}
        ></div>
        <div
          className={`absolute border-t-4 border-b-4 border-opacity-30 
                        ${
                          darkMode ? "border-blue-300" : "border-blue-600"
                        } rounded-full w-8 h-8 animate-spin`}
        ></div>
      </div>
      {text && (
        <p
          className={`${
            darkMode ? "text-white" : "text-black"
          } mt-4 text-lg font-semibold`}
        >
          {text}
        </p>
      )}
      {progress !== undefined && (
        <div className="w-full max-w-xs mt-4">
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-300"
            } h-3 rounded-full overflow-hidden`}
          >
            <div
              className={`${
                darkMode ? "bg-blue-500" : "bg-blue-500"
              } h-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-sm mt-2 text-center`}
          >
            {progress}%
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Loading;
