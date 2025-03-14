import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiUser,
  FiBell,
  FiLogOut,
  FiHome,
  FiSettings,
  FiHeart,
  FiActivity,
  FiCreditCard,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle auth-aware navigation
  const handleAuthAwareNavigation = (e, path) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md dark:bg-gray-800/90 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-screen-2xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full items-center justify-center mr-2">
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="w-auto object-cover"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-extrabold font-nunito tracking-tight bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
                    CrewAfya
                  </span>
                  <span className="text-lg sm:text-xl -mt-2.5 sm:-mt-2 font-extrabold font-nunito tracking-tight bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
                    Care
                  </span>
                </div>
              </div>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                <FiHome className="mr-1.5 h-4 w-4" />
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive("/dashboard")
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <FiActivity className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/payments"
                    className={`${
                      isActive("/payments")
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <FiCreditCard className="mr-1.5 h-4 w-4" />
                    Payments
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className={`${
                      isActive("/about")
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className={`${
                      isActive("/contact")
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    Contact
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  className="ml-3 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors duration-200 relative"
                  aria-label="Notifications"
                >
                  <FiBell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleProfile}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white overflow-hidden">
                        {user?.firstName?.charAt(0) || (
                          <FiUser className="h-5 w-5" />
                        )}
                      </div>
                    </button>
                  </div>
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transform transition-all duration-200 ease-out">
                      <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
                      >
                        <FiUser className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
                      >
                        <FiSettings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
                >
                  Sign in
                </button>
                <button
                  onClick={(e) => handleAuthAwareNavigation(e, "/register")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 dark:from-primary-500 dark:to-secondary-500 dark:hover:from-primary-600 dark:hover:to-secondary-600 shadow-sm hover:shadow transition-all duration-200"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
            >
              <FiHome className="mr-2 h-5 w-5" />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${
                    isActive("/dashboard")
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                >
                  <FiActivity className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/payments"
                  className={`${
                    isActive("/payments")
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                >
                  <FiCreditCard className="mr-2 h-5 w-5" />
                  Payments
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className={`${
                    isActive("/about")
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`${
                    isActive("/contact")
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                >
                  Contact
                </Link>
                <button
                  onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                  className={`${
                    isActive("/login")
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
                  } w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                >
                  Sign in
                </button>
                <button
                  onClick={(e) => handleAuthAwareNavigation(e, "/register")}
                  className={`${
                    isActive("/register")
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300"
                  } w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
          {isAuthenticated && user && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white overflow-hidden">
                    {user?.firstName?.charAt(0) || (
                      <FiUser className="h-6 w-6" />
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </div>
                </div>
                <button className="ml-auto p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors duration-200 relative">
                  <FiBell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 flex items-center"
                >
                  <FiUser className="mr-2 h-5 w-5" />
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 flex items-center"
                >
                  <FiSettings className="mr-2 h-5 w-5" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center"
                >
                  <FiLogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
