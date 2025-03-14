import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBarChart2,
  FiHelpCircle,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiHome className="h-6 w-6" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FiUsers className="h-6 w-6" />,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <FiCreditCard className="h-6 w-6" />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FiBarChart2 className="h-6 w-6" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <FiSettings className="h-6 w-6" />,
    },
    {
      name: "Help",
      path: "/admin/help",
      icon: <FiHelpCircle className="h-6 w-6" />,
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-30 m-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          {isOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/admin/dashboard" className="flex items-center">
              <img src="/logo.png" alt="crewafya-logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={closeSidebar}
              >
                <span
                  className={`mr-3 ${
                    isActive(item.path)
                      ? "text-indigo-500 dark:text-indigo-400"
                      : ""
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiLogOut className="mr-3 h-6 w-6" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
