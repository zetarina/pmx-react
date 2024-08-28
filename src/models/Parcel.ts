import { BasicContactInfo } from "./BasicContactInfo";
import { City } from "./City";
import { Country } from "./Country";
import { ExchangeRate } from "./ExchangeRate";
import { User } from "./User";
import { Warehouse } from "./Warehouse";

export enum PaymentType {
  PayBySender = "Pay by Sender",
  PayByRecipients = "Pay by Recipients",
  CreditTerms = "B2B (Credit Terms)",
}

export enum ParcelStatus {
  ParcelCreated = "Parcel Created",
  InWarehouse = "In Warehouse",
  OnVehicle = "On Vehicle",
  OutForDelivery = "Out for Delivery",
  Delivered = "Delivered",
  Completed = "Completed",
  Rescheduled = "Rescheduled",
  Cancelled = "Cancelled",
}

export enum PaymentStatus {
  Pending = "Pending",
  Completed = "Completed",
}

export enum SenderType {
  Shipper = "Shipper",
  Guest = "Guest",
}

export enum DiscountType {
  Flat = "Flat",
  Percentage = "Percentage",
}

export enum TaxType {
  Flat = "Flat",
  Percentage = "Percentage",
}

export interface Guest extends BasicContactInfo {
  name: string;
}

export interface Receiver extends BasicContactInfo {
  name: string;
}

export interface Sender {
  type: SenderType;
  shipper_id?: string;
  shipper?: User;
  guest?: Guest;
}
export interface TrackingHistory {
  status: string;
  timestamp: Date;
  driverId?: string;
  driver?: User;
  warehouseId?: string;
  warehouse?: Warehouse;
}
export interface Parcel {
  _id?: string | string;
  parcelId?: string;
  sender: Sender;
  receiver: Receiver;
  weight: number;
  size: number;
  deliveryFees: number;
  discountValue?: number;
  discountType?: DiscountType;
  taxValue?: number;
  taxType?: TaxType;
  paymentType: PaymentType;
  creditDueDate?: Date;
  status?: ParcelStatus;
  trackingHistory?: TrackingHistory[];
  currentDriverId?: string;
  currentDriver?: User;
  remark?: string;
  paymentStatus?: PaymentStatus;
  createdById?: string;
  createdBy?: User;
  subTotal?: number;
  totalFee?: number;
  totalFeeIfPaid?: number;
}
export interface ParcelWithWarehouse extends Parcel {
  initialWarehouseId: string;
}
export interface ParcelRowWithErrors {
  senderType: string;
  shipperId: string;
  guestName: string;
  guestPhoneNumber: string;
  guestAddress: string;
  guestCityId: string;
  guestCountryId: string;
  guestZip: string;
  receiverName: string;
  receiverPhoneNumber: string;
  receiverAddress: string;
  receiverCityId: string;
  receiverCountryId: string;
  receiverZip: string;
  deliveryFees: string;
  weight: string;
  size: string;
  discountValue: string;
  discountType: string;
  taxValue: string;
  taxType: string;
  paymentType: string;
  initialWarehouseId: string;
  creditDueDate?: string;
  remark?: string;
}
