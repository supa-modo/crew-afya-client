import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

// Icons
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  ChartBarIcon,
  DocumentReportIcon,
  CogIcon,
} from "../../utils/Icons";
import { MdSpaceDashboard } from "react-icons/md";

const AdminLayout = () => {
  const { logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`h-screen flex overflow-hidden admin-layout ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Navbar */}
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} />
        <div className="overflow-y-auto">
          {/* Main content area */}
          <main
            className={`flex-1 relative overflow-y-auto focus:outline-none ${
              darkMode ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern
                  id="admin-grid"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M40 0 L0 0 L0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-admin-500 dark:text-admin-400"
                  />
                </pattern>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#admin-grid)"
                />
              </svg>
            </div>

            <div className="py-6">
              <div className="mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex flex-col min-h-[calc(100vh-4rem)]">
                  {/* Page content */}
                  <div className="flex-grow pb-6">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
