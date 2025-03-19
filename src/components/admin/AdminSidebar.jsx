import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { MdSpaceDashboard, MdPersonAdd } from "react-icons/md";
import { PiUsersDuotone } from "react-icons/pi";
import { FaChartLine, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import {
  TbReportAnalytics,
  TbServer,
  TbSettings,
  TbShieldCheckFilled,
  TbShieldHalfFilled,
  TbShieldPlus,
} from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { darkMode } = useTheme();

  // Navigation items organized by categories
  const navigationGroups = [
    {
      id: "home",
      label: "Home",
      items: [
        {
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: MdSpaceDashboard,
          current: location.pathname === "/admin/dashboard",
        },
      ],
    },
    {
      id: "user-management",
      label: "User Management",
      items: [
        {
          name: "Users",
          href: "/admin/users",
          icon: PiUsersDuotone,
          current: location.pathname === "/admin/users",
        },
        {
          name: "Add New User",
          href: "/admin/users/new",
          icon: MdPersonAdd,
          current: location.pathname === "/admin/users/new",
        },
      ],
    },
    {
      id: "insuance covers",
      label: "Insurance Covers",
      items: [
        {
          name: "Insurance Plans",
          href: "/admin/plans",
          icon: FaShieldAlt,
          current: location.pathname === "/admin/plans",
        },
        {
          name: "New Medical Cover",
          href: "/admin/new-cover",
          icon: TbShieldPlus,
          current: location.pathname === "/admin/new-cover",
        },
      ],
    },
    {
      id: "payments",
      label: "Payments",
      items: [
        {
          name: "Payments",
          href: "/admin/payments",
          icon: FaCreditCard,
          current: location.pathname === "/admin/payments",
        },
        {
          name: "Analytics",
          href: "/admin/analytics",
          icon: FaChartLine,
          current: location.pathname === "/admin/analytics",
        },
      ],
    },
    {
      id: "system",
      label: "System",
      items: [
        {
          name: "System Health",
          href: "/admin/system-health",
          icon: TbServer,
          current: location.pathname === "/admin/system-health",
        },
        {
          name: "Reports",
          href: "/admin/reports",
          icon: TbReportAnalytics,
          current: location.pathname === "/admin/reports",
        },
        {
          name: "Security",
          href: "/admin/security",
          icon: TbShieldCheckFilled,
          current: location.pathname === "/admin/security",
        },
      ],
    },
    {
      id: "support-settings",
      label: "Support & Settings",
      items: [
        {
          name: "Support",
          href: "/admin/support",
          icon: BiSupport,
          current: location.pathname === "/admin/support",
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: TbSettings,
          current: location.pathname === "/admin/settings",
        },
      ],
    },
  ];

  // Render a navigation item
  const renderNavItem = (item) => (
    <Link
      key={item.name}
      to={item.href}
      className={`${
        item.current
          ? "bg-admin-700 text-white"
          : `${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-200"
            } hover:text-gray-900`
      } group flex items-center px-2 py-2.5 text-sm font-medium rounded-md`}
      onClick={() => setIsOpen && setIsOpen(false)}
    >
      <item.icon
        className={`${
          item.current
            ? "text-white"
            : "text-gray-400 group-hover:text-gray-500"
        } mr-3 flex-shrink-0 h-5 w-5`}
      />
      {item.name}
    </Link>
  );

  // Render a navigation group
  const renderNavGroup = (group, isMobile = false) => (
    <div key={group.id} className="mb-6">
      <h3 className="px-3 text-xs font-semibold text-admin-500 dark:text-admin-400 uppercase tracking-wider">
        {group.label}
      </h3>
      <div className={`mt-2 space-y-1 ${isMobile ? "px-2" : ""}`}>
        {group.items.map(renderNavItem)}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed inset-0 flex z-40 md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        ></div>

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <IoClose className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/logo.png" alt="CrewAfya" />
              <span className="ml-2 text-xl font-bold text-admin-600 dark:text-admin-400">
                CrewAfya Admin
              </span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationGroups.map((group) => renderNavGroup(group, true))}
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div
            className={`flex-1 flex flex-col min-h-0 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } border-r border-gray-200 dark:border-gray-700`}
          >
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img className="h-8 w-auto" src="/logo.png" alt="CrewAfya" />
                <span className="ml-2 text-xl font-bold text-admin-600 dark:text-admin-400">
                  CrewAfya Admin
                </span>
              </div>
              <nav className="mt-8 flex-1 px-2">
                {navigationGroups.map((group) => renderNavGroup(group))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 px-4 py-[0.6rem]">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="/logo.png"
                      alt="CrewAfya"
                    />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      CrewAfya
                    </p>
                    <p className="text-xs font-medium text-admin-600 dark:text-admin-400">
                      v1.0.0
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
