import { useState } from "react";
import { Link } from "react-router-dom";
import UserDetailsSidebar from "../../components/admin/UserDetailsSidebar";
import { FaUserPlus, FaSearch, FaFilter } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import UsersManagement from "./UsersManagement";
import { PiUserCirclePlus, PiUserCirclePlusDuotone } from "react-icons/pi";
import { TbHome2 } from "react-icons/tb";

const AdminUsersPage = () => {
  const { darkMode } = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("profile");

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSidebarOpen(true);
    // Reset to the profile tab when selecting a new user
    setActiveTab("profile");
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality handled in UserManagement component
  };

  // Add a function to handle user updates
  const handleUserUpdate = (updatedUser) => {
    // Update the selectedUser state with the updated user
    setSelectedUser(updatedUser);
  };

  return (
    <div className="">
      <div className="mx-auto ">
        {/* Breadcrumb */}
        <div className="mb-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-admin-600 flex items-center"
                >
                  <TbHome2 className="h-5 w-5 mr-2" />
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  User Management
                </span>
              </li>
            </ol>
          </nav>
        </div>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            Members Management
          </h1>
          <Link
            to="/admin/users/new"
            className="inline-flex items-center px-8 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
          >
            <PiUserCirclePlus className="-ml-1 mr-2 h-6 w-6" />
            Add New User
          </Link>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800 border-2 border-gray-800" : "bg-white"
          } shadow overflow-hidden rounded-xl`}
        >
          {/* User Management Component */}
          <UsersManagement
            onUserSelect={handleUserSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>
      </div>

      {/* User Details Sidebar */}
      <UserDetailsSidebar
        isOpen={sidebarOpen}
        user={selectedUser}
        onClose={handleCloseSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
};

export default AdminUsersPage;
