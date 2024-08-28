import { City } from "./City";
import { Country } from "./Country";

export interface Warehouse {
  _id?: string;
  name: string;
  location: {
    address: string;
    cityId: string;
    city?: City;
    countryId: string;
    country?: Country;
  };
  capacity: number;
}
