import { useState, useEffect } from "react";
import {
  SearchIcon,
  PencilIcon,
  RefreshIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "../../utils/Icons";
import { mockUsers } from "../../data/mockUsers";
import { formatDate } from "../../utils/formatDate";
import {
  RiUserFollowLine,
  RiUserSearchLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { TbEyeEdit, TbRefresh } from "react-icons/tb";
import Pagination from "../../components/common/Pagination";

const UserManagement = ({
  onUserSelect,
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterPlan, setFilterPlan] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    sortBy,
    sortOrder,
    filterRole,
    filterStatus,
    searchTerm,
    filterPlan,
  ]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the API
      // const response = await getUsers({
      //   page: currentPage,
      //   limit: 10,
      //   search: searchTerm,
      //   sortBy,
      //   sortOrder,
      //   role: filterRole !== "all" ? filterRole : undefined,
      //   isActive: filterStatus !== "all" ? filterStatus === "active" : undefined,
      //   plan: filterPlan !== "all" ? filterPlan : undefined,
      // });

      // Mock API response
      setTimeout(() => {
        // Filter users based on search term
        let filteredUsers = [...mockUsers];

        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.firstName.toLowerCase().includes(search) ||
              user.lastName.toLowerCase().includes(search) ||
              user.email.toLowerCase().includes(search) ||
              user.phoneNumber.includes(search)
          );
        }

        // Filter by role
        if (filterRole !== "all") {
          filteredUsers = filteredUsers.filter(
            (user) => user.role === filterRole
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          const isActive = filterStatus === "active";
          filteredUsers = filteredUsers.filter(
            (user) => user.isActive === isActive
          );
        }

        // Filter by plan
        if (filterPlan !== "all") {
          filteredUsers = filteredUsers.filter((user) => {
            return (
              user.plan &&
              user.plan.name &&
              user.plan.name.toLowerCase().includes(filterPlan.toLowerCase())
            );
          });
        }

        // Sort users
        filteredUsers.sort((a, b) => {
          if (sortBy === "name") {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return sortOrder === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          } else if (sortBy === "createdAt") {
            return sortOrder === "asc"
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt);
          } else if (sortBy === "lastLogin") {
            return sortOrder === "asc"
              ? new Date(a.lastLogin) - new Date(b.lastLogin)
              : new Date(b.lastLogin) - new Date(a.lastLogin);
          }
          return 0;
        });

        // Handle pagination
        const totalUsersCount = filteredUsers.length;
        const itemsPerPage = 10;
        const totalPagesCount = Math.ceil(totalUsersCount / itemsPerPage);

        // Calculate pagination indexes
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Get users for current page
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        setUsers(paginatedUsers);
        setTotalUsers(totalUsersCount);
        setTotalPages(totalPagesCount);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // The fetchUsers effect will trigger due to searchTerm change
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // In a real implementation, this would call the API
      // await toggleUserStatus(userId, !currentStatus);

      // Mock API call
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError(err.message || "Failed to update user status");
    }
  };

  const handleViewUser = (user) => {
    if (onUserSelect) {
      // Keep the original user data intact while adding formatted display properties
      const displayUser = {
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        status: user.isActive ? "active" : "inactive",
        // Add display avatar
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${user.firstName} ${user.lastName}`
        )}&background=random`,
      };

      onUserSelect(displayUser);
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const renderUserActions = (user) => {
    return (
      <div className="flex justify-end items-center space-x-2">
        <button
          onClick={() => handleToggleStatus(user.id, user.isActive)}
          className={`p-1.5 ${
            user.isActive
              ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          }`}
          title={user.isActive ? "Deactivate User" : "Activate User"}
        >
          {user.isActive ? (
            <RiUserUnfollowLine className="h-5 w-5" />
          ) : (
            <RiUserFollowLine className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewUser(user);
          }}
          className="py-1 px-4 text-admin-600 flex items-center gap-1 bg-admin-100 dark:bg-admin-500/10 hover:bg-admin-100 rounded-md dark:text-admin-400 dark:hover:bg-admin-900"
          title="View Details"
        >
          <TbEyeEdit className="h-5 w-5" />
          View
        </button>
      </div>
    );
  };

  const formatPlanName = (plan) => {
    if (!plan) return "No Plan";
    return plan.name;
  };

  const getPlanStatusClass = (status) => {
    if (!status)
      return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-200 text-green-800 dark:bg-green-700/30 dark:text-green-300";
      case "expired":
        return "bg-red-200 text-red-800 dark:bg-red-700/40 dark:text-red-300";
      case "suspended":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-300";
      default:
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSearch} className="relative w-full sm:w-[40%]">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <RiUserSearchLine className="h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <TbRefresh className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </form>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <select
            className="border border-gray-300 rounded-lg text-sm sm:text-[0.92rem] text-gray-600 font-medium px-3 py-2 focus:outline-none focus:ring-1 focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="Crew Afya Lite">Crew Afya Lite</option>
            <option value="Crew Afya - (Up to M+3)">
              Crew Afya - (Up to M+3)
            </option>
          </select>
          <select
            className="border border-gray-300 rounded-lg text-sm sm:text-[0.92rem] text-gray-600 font-medium px-3 py-2 focus:outline-none focus:ring-1 focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg text-sm sm:text-[0.92rem] text-gray-600 font-medium px-3 py-2 focus:outline-none focus:ring-1 focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-200 border-l-4 border-red-500 text-red-700 p-4 mb-6 mx-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name {renderSortIcon("name")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider"
              >
                Plan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider"
              >
                Role
              </th>
              
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Joined {renderSortIcon("createdAt")}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("lastLogin")}
              >
                <div className="flex items-center">
                  Last Login {renderSortIcon("lastLogin")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-admin-600 dark:text-admin-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <td
                    className="px-6 py-3 whitespace-nowrap"
                    onClick={() => handleViewUser(user)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-admin-100 rounded-full flex items-center justify-center">
                        <span className="text-admin-800 font-medium">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap"
                    onClick={() => handleViewUser(user)}
                  >
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.phoneNumber}
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap"
                    onClick={() => handleViewUser(user)}
                  >
                    {user.plan ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPlanName(user.plan)}
                        </span>
                        <span
                          className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanStatusClass(
                            user.plan.status
                          )}`}
                        >
                          {user.plan.status
                            ? user.plan.status.charAt(0).toUpperCase() +
                              user.plan.status.slice(1)
                            : "N/A"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        No Plan
                      </span>
                    )}
                  </td>
                  <td
                    className="px-3 py-3 whitespace-nowrap"
                    onClick={() => handleViewUser(user)}
                  >
                    <span
                      className={`px-4 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                        user.role === "superadmin"
                          ? "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : user.role === "admin"
                          ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {user.role === "superadmin"
                        ? "Super Admin"
                        : user.role === "admin"
                        ? "Admin"
                        : "User"}
                    </span>
                  </td>
                 
                  <td
                    className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    onClick={() => handleViewUser(user)}
                  >
                    {formatDate(user.createdAt)}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    onClick={() => handleViewUser(user)}
                  >
                    {formatDate(user.lastLogin)}
                  </td>
                  <td
                    className="px-3 py-3 whitespace-nowrap"
                    onClick={() => handleViewUser(user)}
                  >
                    <span
                      className={`px-4 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                        user.isActive
                          ? "bg-green-200 text-green-700 dark:bg-secondary-900 dark:text-green-300"
                          : "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="pr-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {renderUserActions(user)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          pageSize={10}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default UserManagement;
