import { BasicContactInfo } from "./BasicContactInfo";

import { Role } from "./Role";


export interface User extends BasicContactInfo {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  hashedPassword?: string;
  salt?: string;
  roleId: string;
  role?: Role;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
}
