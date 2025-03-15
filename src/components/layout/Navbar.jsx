import { useState, useEffect } from "react";
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
  FiChevronRight,
  FiInfo,
  FiPhone,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
      setIsMenuOpen(false);
      setIsProfileOpen(false);
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
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav
        className={`${
          scrolled
            ? "shadow-md backdrop-blur-lg bg-white/95 dark:bg-gray-900/90"
            : "bg-white/85 dark:bg-gray-900/60 backdrop-blur-md"
        } fixed w-full top-0 z-50 transition-all duration-300 ease-in-out border-b border-gray-200/30 dark:border-gray-800/30`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={`${
                    isActive("/")
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  } px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center`}
                  onClick={closeMenus}
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
                          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      } px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center`}
                      onClick={closeMenus}
                    >
                      <FiActivity className="mr-1.5 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/payments"
                      className={`${
                        isActive("/payments")
                          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      } px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center`}
                      onClick={closeMenus}
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
                          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      } px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center`}
                      onClick={closeMenus}
                    >
                      <FiInfo className="mr-1.5 h-4 w-4" />
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className={`${
                        isActive("/contact")
                          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      } px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center`}
                      onClick={closeMenus}
                    >
                      <FiPhone className="mr-1.5 h-4 w-4" />
                      Contact
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
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
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200 relative"
                      aria-label="Notifications"
                    >
                      <FiBell className="h-5 w-5" />
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative">
                      <button
                        onClick={toggleProfile}
                        className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1.5 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
                        aria-expanded={isProfileOpen}
                        aria-haspopup="true"
                      >
                        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                          {user?.firstName?.charAt(0) || (
                            <FiUser className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                          {user?.firstName || "Account"}
                        </span>
                      </button>

                      {isProfileOpen && (
                        <>
                          <div
                            className="fixed inset-0 bg-transparent"
                            onClick={() => setIsProfileOpen(false)}
                            aria-hidden="true"
                          />
                          <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden z-50">
                            <div className="px-4 py-4">
                              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                              </p>
                            </div>
                            <div className="py-1">
                              <Link
                                to="/profile"
                                className="group flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                <div className="flex items-center">
                                  <FiUser className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                  <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                    Your Profile
                                  </span>
                                </div>
                                <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                              </Link>
                              <Link
                                to="/settings"
                                className="group flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                <div className="flex items-center">
                                  <FiSettings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                  <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                    Settings
                                  </span>
                                </div>
                                <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                              </Link>
                            </div>
                            <div className="py-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <FiLogOut className="mr-3 h-4 w-4" />
                                Sign out
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200 mr-2"
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
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                onClick={closeMenus}
              >
                <div className="flex items-center">
                  <FiHome className="mr-3 h-5 w-5" />
                  Home
                </div>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive("/dashboard")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FiActivity className="mr-3 h-5 w-5" />
                      Dashboard
                    </div>
                  </Link>
                  <Link
                    to="/payments"
                    className={`${
                      isActive("/payments")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FiCreditCard className="mr-3 h-5 w-5" />
                      Payments
                    </div>
                  </Link>
                  <Link
                    to="/profile"
                    className={`${
                      isActive("/profile")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-3 h-5 w-5" />
                      Profile
                    </div>
                  </Link>
                  <Link
                    to="/settings"
                    className={`${
                      isActive("/settings")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FiSettings className="mr-3 h-5 w-5" />
                      Settings
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className={`${
                      isActive("/about")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FiInfo className="mr-3 h-5 w-5" />
                      About
                    </div>
                  </Link>
                  <Link
                    to="/contact"
                    className={`${
                      isActive("/contact")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FiPhone className="mr-3 h-5 w-5" />
                      Contact
                    </div>
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="px-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                      {user?.firstName?.charAt(0) || (
                        <FiUser className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {user?.email || user?.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                    >
                      <FiLogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 flex space-x-3">
                  <Link
                    to="/login"
                    className="w-full flex justify-center items-center px-4 py-2 border border-primary-500 text-primary-600 dark:text-primary-400 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={closeMenus}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 rounded-md text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={closeMenus}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
