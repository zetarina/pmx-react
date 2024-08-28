export enum PermissionsList {
  CreateUser = "create_user",
  ReadUser = "read_user",
  UpdateUser = "update_user",
  DeleteUser = "delete_user",

  CreateRole = "create_role",
  ReadRole = "read_role",
  UpdateRole = "update_role",
  DeleteRole = "delete_role",

  CreateParcel = "create_parcel",
  ReadParcel = "read_parcel",
  UpdateParcel = "update_parcel",
  DeleteParcel = "delete_parcel",

  CreateWarehouse = "create_warehouse",
  ReadWarehouse = "read_warehouse",
  UpdateWarehouse = "update_warehouse",
  DeleteWarehouse = "delete_warehouse",

  CreateExchangeRate = "create_exchange_rate",
  ReadExchangeRate = "read_exchange_rate",
  UpdateExchangeRate = "update_exchange_rate",
  DeleteExchangeRate = "delete_exchange_rate",

  CreateCity = "create_city",
  ReadCity = "read_city",
  UpdateCity = "update_city",
  DeleteCity = "delete_city",

  CreateCountry = "create_country",
  ReadCountry = "read_country",
  UpdateCountry = "update_country",
  DeleteCountry = "delete_country",

  OfficeAcceptAllParcels = "office_accept_all_parcels",

  ScanParcelByDriver = "scan_parcel_by_driver",
  ScanParcelByWarehouse = "scan_parcel_by_warehouse",
  ScanParcelOutForDelivery = "scan_parcel_out_for_delivery",
  DeliverParcel = "deliver_parcel",
  CompletePayment = "complete_payment",
  RescheduleParcel = "reschedule_parcel",
  CancelParcel = "cancel_parcel",

  GetInventory = "get_inventory",
  GetShipperInventory = "get_shipper_inventory",
  GetAllParcels = "get_all_parcels",
}

export const groupedPermissions = {
  user: [
    PermissionsList.CreateUser,
    PermissionsList.ReadUser,
    PermissionsList.UpdateUser,
    PermissionsList.DeleteUser,
  ],
  role: [
    PermissionsList.CreateRole,
    PermissionsList.ReadRole,
    PermissionsList.UpdateRole,
    PermissionsList.DeleteRole,
  ],
  parcel: [
    PermissionsList.CreateParcel,
    PermissionsList.ReadParcel,
    PermissionsList.UpdateParcel,
    PermissionsList.DeleteParcel,
  ],
  warehouse: [
    PermissionsList.CreateWarehouse,
    PermissionsList.ReadWarehouse,
    PermissionsList.UpdateWarehouse,
    PermissionsList.DeleteWarehouse,
  ],
  exchangeRate: [
    PermissionsList.CreateExchangeRate,
    PermissionsList.ReadExchangeRate,
    PermissionsList.UpdateExchangeRate,
    PermissionsList.DeleteExchangeRate,
  ],
  city: [
    PermissionsList.CreateCity,
    PermissionsList.ReadCity,
    PermissionsList.UpdateCity,
    PermissionsList.DeleteCity,
  ],
  country: [
    PermissionsList.CreateCountry,
    PermissionsList.ReadCountry,
    PermissionsList.UpdateCountry,
    PermissionsList.DeleteCountry,
  ],
  driver: [
    PermissionsList.DeliverParcel,
    PermissionsList.RescheduleParcel,
    PermissionsList.CancelParcel,
    PermissionsList.GetInventory,
    PermissionsList.ScanParcelByDriver,
    PermissionsList.ScanParcelOutForDelivery,
  ],
  office: [
    PermissionsList.ScanParcelByWarehouse,
    PermissionsList.CompletePayment,
    PermissionsList.OfficeAcceptAllParcels,
  ],
  shipper: [PermissionsList.GetShipperInventory],
};

export enum RoleType {
  Admin = "admin",
  Shipper = "shipper",
  Driver = "driver",
}
