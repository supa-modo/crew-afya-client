import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import {
  BellIcon,
  UserCircleIcon,
  SearchIcon,
  MenuIcon,
  LogoutIcon,
} from "../../../utils/Icons";
import { TbBulb, TbBulbOff, TbMenu2 } from "react-icons/tb";

const AdminNavbar = ({ toggleSidebar, title }) => {
  const { logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const profileRef = useRef(null);

  // Mock notifications for UI
  const notifications = [
    {
      id: 1,
      title: "New user registration",
      message: "John Doe has registered a new account",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment successful",
      message: "Payment of KES 2,400 received from Jane Smith",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "System update",
      message: "System maintenance scheduled for tonight",
      time: "3 hours ago",
      read: true,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement search functionality
  };

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div
      className={`sticky top-0 z-10 flex-shrink-0 flex h-16 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow`}
    >
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-admin-500 md:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <TbMenu2 className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-600">
            {title || "Management Panel"}
          </h1>
          <div className="max-w-xl w-full lg:max-w-lg ml-6 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-white text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 sm:text-sm`}
                placeholder="Search a service....."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2  focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <TbBulb className="h-6 w-6" />
            ) : (
              <TbBulbOff className="h-6 w-6" />
            )}
          </button>

          {/* Notification dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
            </div>
            {notificationsOpen && (
              <div
                className={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Notifications
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-2 ${
                        notification.read
                          ? ""
                          : darkMode
                          ? "bg-admin-900/20"
                          : "bg-admin-50"
                      } ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between">
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                  <Link
                    to="/admin/notifications"
                    className="text-sm font-medium text-admin-600 hover:text-admin-500 dark:text-admin-400 dark:hover:text-admin-300"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="ml-3 relative" ref={profileRef}>
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-admin-500 focus:border-admin-500 bg-white/20 dark:bg-gray-800/10 p-1 pr-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-admin-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  {user?.firstName?.charAt(0) || (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                </div>
                <span className="ml-2 text-sm font-semibold text-zinc-500 dark:text-gray-200 hidden md:block">
                  {user?.firstName} {user?.lastName || ""}
                </span>
              </button>
            </div>
            {userMenuOpen && (
              <div
                className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/admin/profile"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Your Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Settings
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={logout}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <LogoutIcon className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
