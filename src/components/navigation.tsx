import {
  FaHome,
  FaTools,
  FaUser,
  FaCity,
  FaFlag,
  FaExchangeAlt,
  FaBox,
  FaUsers,
  FaWarehouse,
} from "react-icons/fa";
import { PermissionsList } from "../models/permissions";

export interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  requiredPermissions?: PermissionsList[][];
  children?: SidebarItemProps[];
  isChild?: boolean;
}

export const items: SidebarItemProps[] = [
  {
    title: "Dashboard Home",
    to: "/dashboard",
    requiredPermissions: [[]], // No specific permissions required
    icon: <FaHome />,
  },

  {
    title: "Profile",
    to: "/dashboard/profile",
    requiredPermissions: [
      [PermissionsList.ReadUser], // Permission for viewing profile
      [PermissionsList.UpdateUser], // Permission for editing profile
    ],
    icon: <FaUser />,
    children: [
      {
        title: "View Profile",
        to: "/dashboard/profile/",
        requiredPermissions: [[PermissionsList.ReadUser]], // Permission for viewing profile
        icon: <FaUser />,
      },
      {
        title: "Edit Profile",
        to: "/dashboard/profile/edit",
        requiredPermissions: [[PermissionsList.UpdateUser]], // Permission for editing profile
        icon: <FaUser />,
      },
    ],
  },
  {
    title: "City",
    to: "/dashboard/city",
    requiredPermissions: [[PermissionsList.ReadCity]], // Permission for viewing city list
    icon: <FaCity />,
    children: [
      {
        title: "Create City",
        to: "/dashboard/city/create",
        requiredPermissions: [[PermissionsList.CreateCity]], // Permission for creating city
        icon: <FaCity />,
      },
      {
        title: "View City",
        to: "/dashboard/city",
        requiredPermissions: [[PermissionsList.ReadCity]], // Permission for viewing city list
        icon: <FaCity />,
      },
    ],
  },
  {
    title: "Country",
    to: "/dashboard/country",
    requiredPermissions: [[PermissionsList.ReadCountry]], // Permission for viewing country list
    icon: <FaFlag />,
    children: [
      {
        title: "Create Country",
        to: "/dashboard/country/create",
        requiredPermissions: [[PermissionsList.CreateCountry]], // Permission for creating country
        icon: <FaFlag />,
      },
      {
        title: "View Country",
        to: "/dashboard/country",
        requiredPermissions: [[PermissionsList.ReadCountry]], // Permission for viewing country list
        icon: <FaFlag />,
      },
    ],
  },
  // {
  //   title: "Exchange Rate",
  //   to: "/dashboard/exchange-rate",
  //   requiredPermissions: [[PermissionsList.ReadExchangeRate]], // Permission for viewing exchange rate list
  //   icon: <FaExchangeAlt />,
  //   children: [
  //     {
  //       title: "Create Exchange Rate",
  //       to: "/dashboard/exchange-rate/create",
  //       requiredPermissions: [[PermissionsList.CreateExchangeRate]], // Permission for creating exchange rate
  //       icon: <FaExchangeAlt />,
  //     },
  //     {
  //       title: "View Exchange Rate",
  //       to: "/dashboard/exchange-rate",
  //       requiredPermissions: [[PermissionsList.ReadExchangeRate]], // Permission for viewing exchange rate list
  //       icon: <FaExchangeAlt />,
  //     },
  //   ],
  // },
  {
    title: "Parcel",
    to: "/dashboard/parcel",
    requiredPermissions: [[PermissionsList.ReadParcel]], // Permission for viewing parcel list
    icon: <FaBox />,
    children: [
      {
        title: "Create Parcel",
        to: "/dashboard/parcel/create",
        requiredPermissions: [[PermissionsList.CreateParcel]], // Permission for creating parcel
        icon: <FaBox />,
      },
      {
        title: "CSV Create Parcel",
        to: "/dashboard/parcel/csvcreate",
        requiredPermissions: [[PermissionsList.CreateParcel]], // Permission for creating parcel
        icon: <FaBox />,
      },

      {
        title: "View Parcel",
        to: "/dashboard/parcel",
        requiredPermissions: [[PermissionsList.ReadParcel]], // Permission for viewing parcel list
        icon: <FaBox />,
      },
      {
        title: "Parcel Reception",
        to: "/dashboard/parcel-reception",
        requiredPermissions: [[PermissionsList.ReadParcel]], // Permission for viewing parcel reception
        icon: <FaBox />,
      },
      {
        title: "Driver Reception",
        to: "/dashboard/driver-reception",
        requiredPermissions: [[PermissionsList.ReadParcel]], // Permission for viewing driver reception
        icon: <FaBox />,
      },
    ],
  },
  {
    title: "Role",
    to: "/dashboard/role",
    requiredPermissions: [[PermissionsList.ReadRole]], // Permission for viewing role list
    icon: <FaUsers />,
    children: [
      {
        title: "Create Role",
        to: "/dashboard/role/create",
        requiredPermissions: [[PermissionsList.CreateRole]], // Permission for creating role
        icon: <FaUsers />,
      },
      {
        title: "View Role",
        to: "/dashboard/role",
        requiredPermissions: [[PermissionsList.ReadRole]], // Permission for viewing role list
        icon: <FaUsers />,
      },
    ],
  },
  {
    title: "User",
    to: "/dashboard/user",
    requiredPermissions: [[PermissionsList.ReadUser]], // Permission for viewing user list
    icon: <FaUser />,
    children: [
      {
        title: "Create User",
        to: "/dashboard/user/create",
        requiredPermissions: [[PermissionsList.CreateUser]], // Permission for creating user
        icon: <FaUser />,
      },
      {
        title: "View User",
        to: "/dashboard/user",
        requiredPermissions: [[PermissionsList.ReadUser]], // Permission for viewing user list
        icon: <FaUser />,
      },
    ],
  },
  {
    title: "Warehouse",
    to: "/dashboard/warehouse",
    requiredPermissions: [[PermissionsList.ReadWarehouse]], // Permission for viewing warehouse list
    icon: <FaWarehouse />,
    children: [
      {
        title: "Create Warehouse",
        to: "/dashboard/warehouse/create",
        requiredPermissions: [[PermissionsList.CreateWarehouse]], // Permission for creating warehouse
        icon: <FaWarehouse />,
      },
      {
        title: "View Warehouse",
        to: "/dashboard/warehouse",
        requiredPermissions: [[PermissionsList.ReadWarehouse]], // Permission for viewing warehouse list
        icon: <FaWarehouse />,
      },
    ],
  },
];
export const sidebarStyles = {
  sidebar: {
    container:
      "fixed inset-y-0 left-0 bg-gray-800 text-white transition-transform transform w-72 flex flex-col",
    nav: "flex flex-col pr-2",
    loading: "flex items-center justify-center h-full",
    loginLink: "py-2 px-4 bg-blue-500 text-white rounded",
    logoutButton:
      "mt-auto py-2 px-4 bg-red-500 text-white rounded cursor-pointer flex items-center justify-center",
    userDetails:
      "py-4 px-4 bg-gray-700 text-white flex flex-col items-start border-8 border-gray-900",
  },
  item: {
    wrapper: "block cursor-pointer text-white flex items-center border-b",
    container: "block cursor-pointer text-white flex items-center border-b",
    active: "bg-gray-900",
    hover: "hover:bg-gray-700",
    childrenContainer: "ml-4",
    icon: "mr-3",
  },
};
