import { City } from "./City";
import { Country } from "./Country";

export interface BasicContactInfo {
  phoneNumber: string;
  cityId: string;
  city?: City;
  countryId: string;
  country?: Country;
  address: string;
  zip: string;
}
