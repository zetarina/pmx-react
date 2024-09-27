import React from "react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  imageSrc,
  altText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        <img src={imageSrc} alt={altText} className="max-w-full max-h-full" />
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
