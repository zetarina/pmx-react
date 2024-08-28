import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import Page from "../components/Page";

const ProfilePage: React.FC = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  if (loading || !user) return <Loading />;

  const groupPermissions = (permissions: Record<string, boolean>) => {
    const grouped: Record<string, string[]> = {};

    Object.entries(permissions).forEach(([permission, allowed]) => {
      const [category] = permission.split("_");
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(
        `${permission}: ${allowed ? "Allowed" : "Denied"}`
      );
    });

    return grouped;
  };

  const groupedPermissions = user.role
    ? groupPermissions(user.role.permissions)
    : {};

  return (
    <Page title="Profile Page">
      <Helmet>
        <title>Profile Page</title>
      </Helmet>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-gray-300 bg-gray-100">
            <img
              src="/logo.png"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-4 lg:ml-6 text-center lg:text-left">
            <h1 className="text-4xl font-semibold text-gray-800 mb-2">{user.username}</h1>
            <p className="text-gray-600 text-lg">{user.email}</p>
            {user.city && user.country && (
              <p className="text-gray-600 text-lg">
                {user.city.name}, {user.country.name}
              </p>
            )}
            {user.role && <p className="text-gray-600 text-lg">{user.role.name}</p>}
          </div>
        </div>
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium">Phone Number:</p>
              <p className="text-gray-900 text-lg">{user.phoneNumber}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium">Address:</p>
              <p className="text-gray-900 text-lg">{user.address}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium">Zip Code:</p>
              <p className="text-gray-900 text-lg">{user.zip}</p>
            </div>
          </div>
          {user.role && (
            <div className="mt-8">
              <p className="text-gray-800 font-semibold text-2xl mb-4">Permissions:</p>
              <div className="flex flex-wrap">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 w-full md:w-1/2 lg:w-1/3">
                    <p className="text-gray-700 font-medium capitalize mb-2">
                      {category} Permissions:
                    </p>
                    <ul className="list-disc list-inside text-gray-900">
                      {perms.map((perm, index) => (
                        <li key={index} className={`text-sm ${perm.includes("Denied") ? "text-red-600" : ""}`}>
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
