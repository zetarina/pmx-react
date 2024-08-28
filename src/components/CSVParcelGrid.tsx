import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Parcel } from "../models/Parcel";
import { City } from "../models/City";
import { Country } from "../models/Country";

interface CSVParcelGridProps {
  preparedData: EnhancedParcel[];
  columnDefs: ColDef[];
  validatedData: {
    countries: Country[];
    cities: City[];
  };
  rowStyle: (params: any) => any; // Add rowStyle as a prop
}

interface EnhancedParcel extends Parcel {
  receiverCountryValidation: string;
  receiverCityValidation: string;
  paymentTypeValidation: string;
}

const CSVParcelGrid: React.FC<CSVParcelGridProps> = ({
  preparedData,
  columnDefs,
  rowStyle, // Destructure rowStyle from props
}) => {
  console.log("Prepared Data for Grid:", preparedData); // Log the prepared data

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact<EnhancedParcel>
        columnDefs={columnDefs}
        rowData={preparedData}
        getRowStyle={rowStyle} // Apply the row style function
      />
    </div>
  );
};

export default CSVParcelGrid;
