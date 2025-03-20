import { useState, useEffect } from "react";

import { mockUsers } from "../../data/mockUsers";
import { formatDate } from "../../utils/formatDate";
import {
  RiUserFollowLine,
  RiUserSearchLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { TbEyeEdit, TbRefresh } from "react-icons/tb";
import Pagination from "../../components/common/Pagination";
import { FaSearch, FaFilter } from "react-icons/fa";
import { getAllUsers } from "../../services/userService";

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
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterPlan, setFilterPlan] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    pageSize,
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
      const response = await getAllUsers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
        role: filterRole !== "all" ? filterRole : undefined,
        isActive:
          filterStatus !== "all" ? filterStatus === "active" : undefined,
        plan: filterPlan !== "all" ? filterPlan : undefined,
      });

      console.log(response.data);

      setUsers(response.data);

      setTotalUsers(response.data.length);
      setTotalPages(Math.ceil(response.data.length / pageSize));

      setLoading(false);
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
      await toggleUserStatus(userId, !currentStatus);

      // Mock API call
      // setUsers(
      //   users.map((user) =>
      //     user.id === userId ? { ...user, isActive: !currentStatus } : user
      //   )
      // );
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

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            <label htmlFor="role-filter" className="sr-only">
              Filter by role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaFilter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <select
                id="role-filter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              >
                <option value="all">All Roles</option>
                <option value="user">Regular User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="flex-1 md:flex-initial">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaFilter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="spinner-border inline-block" role="status">
              <svg
                className="animate-spin h-8 w-8 text-admin-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading users...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">
              <svg
                className="inline-block h-8 w-8 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Error
            </div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-admin-600 text-white rounded hover:bg-admin-700"
            >
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No users found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("firstName")}
                >
                  <div className="flex items-center">
                    Name {renderSortIcon("firstName")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("phoneNumber")}
                >
                  <div className="flex items-center">
                    Contact {renderSortIcon("phoneNumber")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("idNumber")}
                >
                  <div className="flex items-center">
                    ID Number {renderSortIcon("idNumber")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <div className="flex items-center">Plan</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <div className="flex items-center">Role</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Joined {renderSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <div className="flex items-center">Sacco</div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <div className="flex items-center">Route / County</div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td
                    className="px-6 py-3 whitespace-nowrap cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-admin-100 dark:bg-admin-900 flex items-center justify-center">
                        <span className="text-admin-700 dark:text-admin-300 font-medium">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.membershipNumber || "No Membership Number"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    <div>
                      <div>{user.phoneNumber}</div>
                      <div>{user.email || "No Email"}</div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    {user.idNumber}
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap text-sm cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    {user.insuranceCoverage ? (
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatPlanName(user.insuranceCoverage.plan)}
                        </div>
                        <div>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanStatusClass(
                              user.insuranceCoverage.status
                            )}`}
                          >
                            {user.insuranceCoverage.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No Plan
                      </span>
                    )}
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap text-sm cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin" || user.role === "superadmin"
                          ? "bg-admin-100 text-admin-800 dark:bg-admin-900 dark:text-admin-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td
                    className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    {formatDate(user.createdAt)}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    {user.sacco || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    {user.route || user.county || "N/A"}
                  </td>
                  <td
                    className="px-3 py-3 whitespace-nowrap cursor-pointer"
                    onClick={() => handleViewUser(user)}
                  >
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {renderUserActions(user)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default UserManagement;
