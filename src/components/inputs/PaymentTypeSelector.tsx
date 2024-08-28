import React from "react";
import CustomFormikInputBox from "./common/CustomFormikInputBox";
import { PaymentType } from "../../models/Parcel";

interface PaymentTypeSelectorProps {
  name: string;
  className?: string;
}

const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({ name, className }) => {
  const options = [
    { value: PaymentType.PayBySender, name: "Pay by Sender" },
    { value: PaymentType.PayByRecipients, name: "Pay by Recipients" },
    { value: PaymentType.CreditTerms, name: "B2B (Credit Terms)" },
  ];

  return (
    <CustomFormikInputBox
      type="select"
      label="Payment Type"
      name={name}
      required
      options={options}
      className={className}
    />
  );
};

export default PaymentTypeSelector;
