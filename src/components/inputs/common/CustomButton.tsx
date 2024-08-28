import React from "react";
import { motion } from "framer-motion";

enum ButtonType {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset",
}

interface CustomButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Adjusted type
  disabled?: boolean;
  className?: string;
  type?: ButtonType;
  colorClassName?: string;
  hoverClassName?: string;
  focusClassName?: string;
  children?: React.ReactNode;
  loading?: boolean; // Added loading prop
  loadingText?: string; // Added loading text prop
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  disabled,
  className,
  type = ButtonType.BUTTON,
  colorClassName = "bg-primary text-white",
  hoverClassName = "hover:bg-primary/80",
  focusClassName = "focus:ring-secondary",
  children,
  loading = false,
  loadingText = "Loading...",
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-bold py-2 px-4 rounded ${colorClassName} ${hoverClassName} ${focusClassName} ${className}`}
    >
      {loading ? loadingText : children}
    </motion.button>
  );
};

export default CustomButton;
