import React from "react";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { SenderType } from "../../models/Parcel";

interface SenderTypeSelectorProps {
  name: string;
  className?: string;
}

const SenderTypeSelector: React.FC<SenderTypeSelectorProps> = ({ name, className }) => {
  const options = [
    { value: SenderType.Shipper, name: "Shipper" },
    { value: SenderType.Guest, name: "Guest" },
  ];

  return (
    <CustomFormikInputBox
      type="select"
      label="Sender Type"
      name={name}
      required
      options={options}
      className={className}
    />
  );
};

export default SenderTypeSelector;
