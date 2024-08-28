import { PermissionsList } from "./permissions";

export interface Role {
  _id?: string;
  name: string;
  permissions: PermissionsObject;
  isShipper?: boolean;
  isDriver?: boolean;
}

export type PermissionsObject = Record<PermissionsList, boolean>;
