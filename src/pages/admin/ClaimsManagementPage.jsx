import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import {
  TbChevronRight,
  TbEdit,
  TbFileInvoice,
  TbFilter,
  TbHome2,
  TbSearch,
  TbTrash,
} from "react-icons/tb";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout";
import { getAllClaims, deleteClaim } from "../../services/claimsService";
import ClaimStatusBadge from "../../components/admin/claims/ClaimStatusBadge";
import ClaimTypeIcon from "../../components/admin/claims/ClaimTypeIcon";

const ClaimsManagementPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "submissionDate",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchClaims();
  }, [currentPage, filterType, filterStatus]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await getAllClaims({
        page: currentPage,
        limit: pageSize,
        type: filterType !== "all" ? filterType : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });

      if (response.success) {
        setClaims(response.data.claims);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / pageSize));
      } else {
        setError(response.message || "Failed to fetch claims");
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError("Failed to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClaim = async (claimId) => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      try {
        const response = await deleteClaim(claimId);
        if (response.success) {
          setClaims(claims.filter((claim) => claim.id !== claimId));
          alert("Claim deleted successfully");
        } else {
          alert(response.message || "Failed to delete claim");
        }
      } catch (err) {
        console.error("Error deleting claim:", err);
        alert("Failed to delete claim. Please try again.");
      }
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedClaims = () => {
    // First filter by search term and filters
    let filteredData = claims.filter((claim) => {
      const matchesSearch =
        claim.user?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        claim.user?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        claim.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || claim.type === filterType;
      const matchesStatus =
        filterStatus === "all" || claim.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

    // Then sort
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle dates
        if (
          sortConfig.key === "submissionDate" ||
          sortConfig.key === "serviceDate" ||
          sortConfig.key === "processedDate"
        ) {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const sortedClaims = getSortedClaims();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="h-4 w-4" />
    ) : (
      <FiChevronDown className="h-4 w-4" />
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8">
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
              <TbChevronRight className="w-4 h-4" />
              <span className="ml-2 text-admin-700 dark:text-gray-300 font-semibold">
                Medical Claims
              </span>
            </li>
          </ol>
        </nav>
      </div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-amber-700 dark:text-white flex items-center">
            <TbFileInvoice className="mr-2 h-6 w-6 text-amber-600" />
            Claims Management
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View, edit approval status, and manage all medical claims requested by members.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/claims/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-admin-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-admin-500 focus:ring-offset-2 sm:w-auto"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            New Claim
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TbSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 sm:text-sm"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="type-filter" className="sr-only">
              Filter by type
            </label>
            <div className="relative">
              <select
                id="type-filter"
                name="type-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Claim Types</option>
                <option value="inpatient">Inpatient</option>
                <option value="outpatient">Outpatient</option>
                <option value="maternity">Maternity</option>
                <option value="optical">Optical</option>
                <option value="dental">Dental</option>
                <option value="accident">Accident</option>
                <option value="emergency">Emergency</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <TbFilter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <div className="relative">
              <select
                id="status-filter"
                name="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claims table */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <TbFileInvoice className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Error Loading Claims
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
            <div className="mt-6">
              <button
                onClick={fetchClaims}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : sortedClaims.length === 0 ? (
          <div className="text-center py-16">
            <TbFileInvoice className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No claims found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "No claims have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-300 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                      <span>#</span>
                      </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("user.lastName")}
                  >
                    <div className="flex items-center">
                      <span>Member</span>
                      {getSortIcon("user.lastName")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      <span>Type</span>
                      {getSortIcon("type")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("providerName")}
                  >
                    <div className="flex items-center">
                      <span>Provider</span>
                      {getSortIcon("providerName")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("serviceDate")}
                  >
                    <div className="flex items-center">
                      <span>Service Date</span>
                      {getSortIcon("serviceDate")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("amountClaimed")}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      {getSortIcon("amountClaimed")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedClaims.map(( claim, index) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700 dark:text-white">
                        {claim.user?.firstName} {claim.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {claim.userId.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClaimTypeIcon type={claim.type} className="mr-2" />
                        <span className="text-sm font-medium text-gray-600 dark:text-white capitalize">
                          {claim.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-600 dark:text-white">
                        {claim.providerName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {claim.providerLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(claim.serviceDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-600 dark:text-white">
                        {formatCurrency(claim.amountClaimed)}
                      </div>
                      {claim.amountApproved > 0 &&
                        claim.status === "approved" && (
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            Approved: {formatCurrency(claim.amountApproved)}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ClaimStatusBadge status={claim.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/admin/claims/${claim.id}`}
                          className="text-admin-600 hover:text-admin-900 dark:text-admin-400 dark:hover:text-admin-300"
                        >
                          <FiEye className="h-5 w-5" />
                          <span className="sr-only">View</span>
                        </Link>
                        <Link
                          to={`/admin/claims/${claim.id}/edit`}
                          className="flex items-center space-x-1 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                        >
                          <TbEdit className="h-5 w-5" />
                          <span className="">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClaim(claim.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TbTrash className="h-5 w-5" />
                          <span className="">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && sortedClaims.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(totalItems, (currentPage - 1) * pageSize + 1)}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiChevronLeft className="mr-1 h-5 w-5" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  Next
                  <FiChevronRight className="ml-1 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsManagementPage;
