import { Country } from "./Country";

export interface City {
  _id?: string;
  name: string;
  countryId: string;
  country?: Country;
}
