import { useState } from "react";
import { Link } from "react-router-dom";
import UserDetailsSidebar from "../../components/admin/UserDetailsSidebar";
import { FaUserPlus, FaSearch, FaFilter } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import UsersManagement from "./UsersManagement";
import { PiUserCirclePlus, PiUserCirclePlusDuotone } from "react-icons/pi";

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

  return (
    <div className="">
      <div className="mx-auto ">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-secondary-700">
            User Management
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
      />
    </div>
  );
};

export default AdminUsersPage;
