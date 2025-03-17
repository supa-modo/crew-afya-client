import { useState, useEffect } from "react";
import { getUsers, toggleUserStatus } from "../../services/adminService";
import {
  SearchIcon,
  FilterIcon,
  PencilIcon,
  TrashIcon,
  RefreshIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "../../utils/Icons";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for UI development - will be replaced with actual API data
  const mockUsers = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+254712345678",
      role: "user",
      isActive: true,
      createdAt: "2023-05-10T08:30:00Z",
      lastLogin: "2023-06-15T14:20:00Z",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+254723456789",
      role: "user",
      isActive: true,
      createdAt: "2023-05-12T10:15:00Z",
      lastLogin: "2023-06-14T09:45:00Z",
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@example.com",
      phoneNumber: "+254734567890",
      role: "admin",
      isActive: true,
      createdAt: "2023-04-20T11:30:00Z",
      lastLogin: "2023-06-15T16:10:00Z",
    },
    {
      id: "4",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@example.com",
      phoneNumber: "+254745678901",
      role: "user",
      isActive: false,
      createdAt: "2023-05-18T14:45:00Z",
      lastLogin: "2023-06-10T11:30:00Z",
    },
    {
      id: "5",
      firstName: "Robert",
      lastName: "Brown",
      email: "robert.brown@example.com",
      phoneNumber: "+254756789012",
      role: "user",
      isActive: true,
      createdAt: "2023-05-25T09:20:00Z",
      lastLogin: "2023-06-15T08:15:00Z",
    },
    {
      id: "6",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      phoneNumber: "+254767890123",
      role: "user",
      isActive: true,
      createdAt: "2023-06-01T13:10:00Z",
      lastLogin: "2023-06-14T15:40:00Z",
    },
    {
      id: "7",
      firstName: "David",
      lastName: "Miller",
      email: "david.miller@example.com",
      phoneNumber: "+254778901234",
      role: "superadmin",
      isActive: true,
      createdAt: "2023-04-15T10:00:00Z",
      lastLogin: "2023-06-15T17:30:00Z",
    },
    {
      id: "8",
      firstName: "Jennifer",
      lastName: "Wilson",
      email: "jennifer.wilson@example.com",
      phoneNumber: "+254789012345",
      role: "user",
      isActive: false,
      createdAt: "2023-05-30T16:25:00Z",
      lastLogin: "2023-06-05T09:50:00Z",
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    sortBy,
    sortOrder,
    selectedRole,
    selectedStatus,
    searchTerm,
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
      //   role: selectedRole !== "all" ? selectedRole : undefined,
      //   isActive: selectedStatus !== "all" ? selectedStatus === "active" : undefined,
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
        if (selectedRole !== "all") {
          filteredUsers = filteredUsers.filter(
            (user) => user.role === selectedRole
          );
        }

        // Filter by status
        if (selectedStatus !== "all") {
          const isActive = selectedStatus === "active";
          filteredUsers = filteredUsers.filter(
            (user) => user.isActive === isActive
          );
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

        setUsers(filteredUsers);
        setTotalUsers(filteredUsers.length);
        setTotalPages(Math.ceil(filteredUsers.length / 10));
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <RefreshIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </form>
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Joined {renderSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("lastLogin")}
                >
                  <div className="flex items-center">
                    Last Login {renderSortIcon("lastLogin")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-800 font-medium">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        {user.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "superadmin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role === "superadmin"
                          ? "Super Admin"
                          : user.role === "admin"
                          ? "Admin"
                          : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                          className={`p-1 rounded-full ${
                            user.isActive
                              ? "text-red-600 hover:bg-red-100"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? (
                            <ExclamationCircleIcon className="h-5 w-5" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded-full"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {users.length > 0 ? (currentPage - 1) * 10 + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, totalUsers)}
                </span>{" "}
                of <span className="font-medium">{totalUsers}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">First</span>
                  <span>First</span>
                </button>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <span>Prev</span>
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show current page, and 1 page before and after
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === pageNumber
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <span>Next</span>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Last</span>
                  <span>Last</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User Edit Modal - Would be implemented in a real application */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit User: {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <p className="text-gray-500 mb-4">
              User edit form would be implemented here
            </p>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
