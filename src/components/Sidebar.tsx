import React, { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { items, SidebarItemProps, sidebarStyles } from "./navigation";
import { motion } from "framer-motion";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import {
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaUserTag,
} from "react-icons/fa";
import Auth from "../class/Auth";
import Loading from "./Loading";

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  to,
  requiredPermissions = [],
  isChild = true,
}) => {
  const location = useLocation();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return null;
  }

  if (!user || !user.role || typeof user.role.permissions !== "object") {
    console.error("User role or permissions are not defined correctly", user);
    return null;
  }

  const hasPermission = requiredPermissions.some((permissionSet) =>
    permissionSet.every((permission) => user.role?.permissions[permission])
  );

  if (!hasPermission) {
    return null;
  }

  const isActive = location.pathname === to;

  return (
    <div>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className={`${
          isChild ? sidebarStyles.item.container : sidebarStyles.item.wrapper
        } ${isActive ? sidebarStyles.item.active : sidebarStyles.item.hover}`}
        style={{ userSelect: "none" }}
      >
        <Link to={to} className="w-full flex items-center px-4 py-2">
          <div className="text-xl mr-2">{icon}</div>
          <span className="ml-2">{title}</span>
        </Link>
      </motion.div>
    </div>
  );
};
const ExpandableSidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  to,
  children,
  requiredPermissions = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Check permissions for the parent item
  const hasPermission = requiredPermissions.some((permissionSet) =>
    permissionSet.every((permission) => user?.role?.permissions[permission])
  );

  // Check permissions for child items if the parent has no direct permissions
  const hasChildPermission = children?.some((child) =>
    child.requiredPermissions?.some((permissionSet) =>
      permissionSet.every((permission) => user?.role?.permissions[permission])
    )
  );

  if (!hasPermission && !hasChildPermission) {
    return null;
  }

  const isActive = children?.some((child) => location.pathname === child.to);

  return (
    <div>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className={`${sidebarStyles.item.wrapper} ${
          expanded || isActive
            ? sidebarStyles.item.active
            : sidebarStyles.item.hover
        }`}
        onClick={handleExpand}
        style={{ userSelect: "none" }}
      >
        <div className="w-full flex items-center px-4 py-2">
          <div className="mr-2 text-xl">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div className="text-xl">{icon}</div>
          <span className="ml-2">{title}</span>
        </div>
      </motion.div>
      {expanded && children && (
        <motion.div
          initial="collapsed"
          animate="open"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.2 }}
          className={sidebarStyles.item.childrenContainer}
        >
          {children
            .filter((child) =>
              child.requiredPermissions?.some((permissionSet) =>
                permissionSet.every(
                  (permission) => user?.role?.permissions[permission]
                )
              )
            )
            .map((child, index) => (
              <SidebarItem key={index} {...child} isChild={false} />
            ))}
        </motion.div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  // const dispatch = useDispatch();

  const handleLogout = () => {
    Auth.logout();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out bg-gray-800 w-72 z-50`}
    >
      {user && (
        <div className="p-4 text-white border-y-2 border-gray-400 bg-gray-500">
          <div className="flex items-center mb-4">
            <FaUserCircle className="text-2xl mr-2" />
            <span className="text-xl">{user.username}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <FaEnvelope className="text-xl mr-2" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center">
              <FaUserTag className="text-xl mr-2" />
              <span>@{user.role?.name}</span>
            </div>
          </div>
        </div>
      )}
      <SimpleBar style={{ height: "calc(100vh - 200px)" }}>
        {loading ? (
          <Loading />
        ) : user ? (
          <nav className="p-4">
            {items.map((item, index) =>
              item.children ? (
                <ExpandableSidebarItem key={index} {...item} />
              ) : (
                <SidebarItem key={index} {...item} isChild={false} />
              )
            )}
          </nav>
        ) : (
          <div className="p-4 text-center text-white">
            <Link to="/login" className="text-white underline">
              Login
            </Link>
          </div>
        )}
      </SimpleBar>
      {user && (
        <div className="p-4">
          <button
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md w-full"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
