import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AuthenticatedRoute from "./middleware/AuthenticatedRoute";
import ProtectedRoute from "./middleware/ProtectedRoute";
import PermissionsChecker from "./middleware/PermissionsChecker";

import DashboardLayout from "./components/DashboardLayout";
import Layout from "./components/Layout";
import MaintenancePage from "./components/MaintenancePage";
import CountryCreatePage from "./pages/CountryCreatePage";
import CountryListPage from "./pages/CountryListPage";
import CountryUpdatePage from "./pages/CountryUpdatePage";
import CityCreatePage from "./pages/CityCreatePage";
import CityUpdatePage from "./pages/CityUpdatePage";
import CityListPage from "./pages/CityListPage";
import RoleListPage from "./pages/RoleListPage";
import RoleUpdatePage from "./pages/RoleUpdatePage";
import RoleCreatePage from "./pages/RoleCreatePage";
import UserListPage from "./pages/UserListPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserUpdatePage from "./pages/UserUpdatePage";
// import ExchangeRateCreatePage from "./pages/ExchangeRateCreatePage";
// import ExchangeRateUpdatePage from "./pages/ExchangeRateUpdatePage";
// import ExchangeRateListPage from "./pages/ExchangeRateListPage";
import WarehouseCreatePage from "./pages/WarehouseCreatePage";
import WarehouseUpdatePage from "./pages/WarehouseUpdatePage";
import WarehouseListPage from "./pages/WarehouseListPage";
import ParcelCreatePage from "./pages/ParcelCreatePage";
import ParcelUpdatePage from "./pages/ParcelUpdatePage";
import ParcelListPage from "./pages/ParcelListPage";
import ParcelReception from "./pages/ParcelReception";
import DriverReception from "./pages/DriverReception";
import SessionLoader from "./middleware/SessionLoader";

import ProfileEditPage from "./pages/ProfileEditPage";
import { PermissionsList } from "./models/permissions";
import DashboardPage from "./pages/DashboardPage";
import CSVParcelCreatePage from "./pages/CSVParcelCreatePage";
import HomePage from "./pages/HomePage";
import ParcelSearchPage from "./pages/ParcelSearchPage";
import ReportPage from "./pages/ReportPage";
import ParcelViewPage from "./pages/ParcelViewPage";

function App() {
  return (
    <Router>
      <ToastContainer />
      <SessionLoader>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tracking" element={<ParcelSearchPage />} />
            <Route path="tracking/:parcelId" element={<ParcelSearchPage />} />
            <Route index element={<Navigate to="/login" />} />
            <Route
              path="login"
              element={
                <AuthenticatedRoute>
                  <LoginPage />
                </AuthenticatedRoute>
              }
            />
          </Route>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route
              path="report"
              element={
                <PermissionsChecker requiredPermissions={[]}>
                  <ReportPage />
                </PermissionsChecker>
              }
            />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route
              path="city/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateCity]}
                >
                  <CityCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="city/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateCity]}
                >
                  <CityUpdatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="city"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadCity]}
                >
                  <CityListPage />
                </PermissionsChecker>
              }
            />
            <Route
              path="country"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadCountry]}
                >
                  <CountryListPage />
                </PermissionsChecker>
              }
            />
            <Route
              path="country/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateCountry]}
                >
                  <CountryCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="country/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateCountry]}
                >
                  <CountryUpdatePage />
                </PermissionsChecker>
              }
            />
            {/* <Route
              path="exchange-rate/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateExchangeRate]}
                >
                  <ExchangeRateCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="exchange-rate/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateExchangeRate]}
                >
                  <ExchangeRateUpdatePage />
                </PermissionsChecker>
              }
            /> */}
            {/* <Route
              path="exchange-rate"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadExchangeRate]}
                >
                  <ExchangeRateListPage />
                </PermissionsChecker>
              }
            /> */}
            <Route
              path="parcel/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateParcel]}
                >
                  <ParcelCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="parcel/csvcreate"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateParcel]}
                >
                  <CSVParcelCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="parcel/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateParcel]}
                >
                  <ParcelUpdatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="parcel/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateParcel]}
                >
                  <ParcelViewPage />
                </PermissionsChecker>
              }
            />
            <Route
              path="parcel"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadParcel]}
                >
                  <ParcelListPage />
                </PermissionsChecker>
              }
            />
            <Route
              path="role/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateRole]}
                >
                  <RoleCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="role/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateRole]}
                >
                  <RoleUpdatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="role"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadRole]}
                >
                  <RoleListPage />
                </PermissionsChecker>
              }
            />
            <Route
              path="user/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateUser]}
                >
                  <UserCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="user/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateUser]}
                >
                  <UserUpdatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="user"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadUser]}
                >
                  <UserListPage />
                </PermissionsChecker>
              }
            />
            <Route
              path="warehouse/create"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.CreateWarehouse]}
                >
                  <WarehouseCreatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="warehouse/update/:id"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.UpdateWarehouse]}
                >
                  <WarehouseUpdatePage />
                </PermissionsChecker>
              }
            />
            <Route
              path="warehouse"
              element={
                <PermissionsChecker
                  requiredPermissions={[PermissionsList.ReadWarehouse]}
                >
                  <WarehouseListPage />
                </PermissionsChecker>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<ProfileEditPage />} />
            <Route path="parcel-reception" element={<ParcelReception />} />
            <Route path="driver-reception" element={<DriverReception />} />
          </Route>
        </Routes>
      </SessionLoader>
    </Router>
  );
}

export default App;
