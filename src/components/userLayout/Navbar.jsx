import { useState, useEffect, useRef } from "react";
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
import { BiSupport } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { TbActivity, TbBulb, TbBulbOff, TbHome2 } from "react-icons/tb";
import {
  PiGearDuotone,
  PiGearSixDuotone,
  PiInfoDuotone,
  PiSignOutDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileRef = useRef(null);

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

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

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
            : "bg-white/85 dark:bg-gray-900/60 backdrop-blur-md shadow-sm"
        } fixed w-full top-0 z-50 transition-all duration-300 ease-in-out border-b border-gray-200/30 dark:border-gray-800/30`}
      >
        <div className="max-w-screen md:mx-6 lg:mx-24 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full items-center justify-center mr-2">
                    <img
                      src="/mwulogo.png"
                      alt="logo"
                      className="w-auto object-cover"
                    />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent dark:from-secondary-500 dark:to-secondary-600">
                      Matatu Workers
                    </span>
                    <span className="text-lg sm:text-xl -mt-2.5 sm:-mt-2 font-bold  bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent dark:from-secondary-500 dark:to-secondary-600">
                      Union
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
                      ? "text-secondary-600 dark:text-secondary-400 "
                      : "text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400"
                  } px-3 py-2 rounded-lg font-medium transition-colors duration-200 `}
                  onClick={closeMenus}
                >
                  Home
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`${
                        isActive("/dashboard")
                          ? "text-secondary-600 dark:text-secondary-400 "
                          : "text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400"
                      } px-3 py-2 rounded-lg font-medium transition-colors duration-200`}
                      onClick={closeMenus}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/payments"
                      className={`${
                        isActive("/payments")
                          ? "text-secondary-600 dark:text-secondary-400 "
                          : "text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 "
                      } px-3 py-2 rounded-lg font-medium transition-colors duration-200 `}
                      onClick={closeMenus}
                    >
                      Payments
                    </Link>
                    {/* <Link
                      to="/payment"
                      className={`${
                        isActive("/payment")
                          ? "text-secondary-600 dark:text-secondary-400 "
                          : "text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 "
                      } px-3 py-2 rounded-lg font-medium transition-colors duration-200 `}
                      onClick={closeMenus}
                    >
                      Pay Now
                    </Link> */}
                  </>
                ) : (
                  <>
                    <Link
                      to="/about"
                      className={`${
                        isActive("/about")
                          ? "text-secondary-600 dark:text-secondary-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 "
                      } px-3 py-2 rounded-lg font-medium transition-colors duration-200 `}
                      onClick={closeMenus}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      className={`${
                        isActive("/contact")
                          ? "text-secondary-600 dark:text-secondary-400 "
                          : "text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 "
                      } px-3 py-2 rounded-lg font-medium transition-colors duration-200 `}
                      onClick={closeMenus}
                    >
                      Support
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary-600 dark:hover:text-secondary-400 focus:outline-none focus:ring-2  focus:ring-secondary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <TbBulb className="h-6 w-6" />
                  ) : (
                    <TbBulbOff className="h-6 w-6" />
                  )}
                </button>

                {isAuthenticated ? (
                  <>
                    <button
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary-600 dark:hover:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200 relative"
                      aria-label="Notifications"
                    >
                      <FiBell className="h-5 w-5" />
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                      <button
                        onClick={toggleProfile}
                        className="flex items-center space-x-2 bg-white/20 dark:bg-gray-800/10 p-1.5 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-1 focus:border-secondary-600 focus:ring-secondary-600 dark:focus:ring-offset-gray-900"
                        aria-expanded={isProfileOpen}
                        aria-haspopup="true"
                      >
                        <div className="h-7 w-7 rounded-md  bg-gradient-to-br from-secondary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-secondary-500/20">
                          {user?.firstName?.charAt(0) || (
                            <FiUser className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-zinc-500 dark:text-gray-200 hidden sm:block">
                          {`${user?.firstName + " " + user?.lastName}` ||
                            "Account"}
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
                              <p className=" font-semibold text-gray-600 dark:text-white truncate">
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
                                  <PiUserDuotone className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400" />
                                  <span className="group-hover:text-secondary-600 dark:group-hover:text-secondary-400">
                                    Your Profile
                                  </span>
                                </div>
                                <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400" />
                              </Link>
                              <Link
                                to="/settings"
                                className="group flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                <div className="flex items-center">
                                  <PiGearDuotone className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400" />
                                  <span className="group-hover:text-secondary-600 dark:group-hover:text-secondary-400">
                                    Settings
                                  </span>
                                </div>
                                <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400" />
                              </Link>
                            </div>
                            <div className="py-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <PiSignOutDuotone className="mr-3 h-5 w-5" />
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
                      className="px-6 py-2 text-[0.95rem] font-medium rounded-lg border border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors duration-200"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2 text-[0.95rem] font-medium border border-secondary-600 text-white bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary-600 dark:hover:text-secondary-400 focus:outline-none focus:ring-2  focus:ring-secondary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200 mr-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <TbBulb className="h-6 w-6" />
                ) : (
                  <TbBulbOff className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu();
                }}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary-600 dark:hover:text-secondary-400 focus:outline-none focus:ring-27 focus:ring-secondary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu" ref={menuRef}>
            <div className="pl-6 pr-6 pt-3 pb-3 space-y-1  sm:px-3 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                onClick={closeMenus}
              >
                <div className="flex items-center">
                  <TbHome2 className="mr-3" size={20} />
                  Home
                </div>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive("/dashboard")
                        ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <MdSpaceDashboard className="mr-3" size={20} />
                      Dashboard
                    </div>
                  </Link>
                  <Link
                    to="/payments"
                    className={`${
                      isActive("/payments")
                        ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FaCreditCard className="mr-3" size={19} />
                      Payments
                    </div>
                  </Link>
                  {/* <Link
                    to="/payment"
                    className={`${
                      isActive("/payment")
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <FaCreditCard className="mr-3" size={19} />
                      Pay Now
                    </div>
                  </Link> */}
                  <Link
                    to="/profile"
                    className={`${
                      isActive("/profile")
                        ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <PiUserDuotone className="mr-3" size={19} />
                      Profile
                    </div>
                  </Link>
                  <Link
                    to="/settings"
                    className={`${
                      isActive("/settings")
                        ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <PiGearSixDuotone className="mr-3" size={19} />
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
                        ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <PiInfoDuotone className="mr-3 " size={20} />
                      About Us
                    </div>
                  </Link>
                  <Link
                    to="/contact"
                    className={`${
                      isActive("/contact")
                        ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } block px-3 py-2.5 rounded-md text-sm transition-colors duration-200`}
                    onClick={closeMenus}
                  >
                    <div className="flex items-center">
                      <BiSupport className="mr-3 " size={19} />
                      Support
                    </div>
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="px-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gradient-to-br from-secondary-500 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-secondary-500/20">
                      {user?.firstName?.charAt(0) || (
                        <FiUser className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-600 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email || user?.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
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
                    className="w-full flex justify-center items-center px-4 py-2 border border-secondary-500 text-secondary-600 dark:text-secondary-400 bg-transparent hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-md text-sm sm:text-base transition-colors duration-200"
                    onClick={closeMenus}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-white bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-800 rounded-md text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
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
