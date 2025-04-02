import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
  FiChevronLeft,
  FiFilter,
  FiUsers,
  FiDownload,
  FiEye,
  FiUser,
} from "react-icons/fi";
import { TbShieldCheck, TbHealthRecognition, TbDownload, TbSearch } from "react-icons/tb";
import { PiUsersDuotone, PiUsersThreeDuotone } from "react-icons/pi";
import { getPlanSubscribers } from "../../../services/planService";

const PlanSubscribersList = ({ plan }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!plan || !plan.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch actual subscribers from the server
        const response = await getPlanSubscribers(plan.id);
        
        if (response && response.success && response.data) {
          // Map response data to the format we need
          const formattedSubscribers = response.data.map(subscriber => ({
            id: subscriber.id,
            firstName: subscriber.firstName || subscriber.user?.firstName || "",
            lastName: subscriber.lastName || subscriber.user?.lastName || "",
            email: subscriber.email || subscriber.user?.email || "",
            phoneNumber: subscriber.phoneNumber || subscriber.user?.phoneNumber || "",
            subscriptionDate: subscriber.startDate || subscriber.createdAt,
            status: subscriber.isActive ? "active" : "inactive",
            paymentStatus: subscriber.paymentStatus || "paid",
            frequency: subscriber.frequency || "monthly"
          }));
          
          setSubscribers(formattedSubscribers);
        } else {
          // If no data or unsuccessful response
          setSubscribers([]);
          if (response && !response.success) {
            setError(response.message || "Failed to fetch subscribers");
          }
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        setError("Failed to load subscribers. Please try again.");
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    if (plan) {
      fetchSubscribers();
      setCurrentPage(1); // Reset to first page when changing plans
    }
  }, [plan]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted icon
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

  // Apply sorting and filtering to subscribers
  const getSortedSubscribers = () => {
    // First filter by search term and status
    let filteredData = subscribers.filter((subscriber) => {
      const matchesSearch =
        `${subscriber.firstName} ${subscriber.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.phoneNumber.includes(searchTerm);

      const matchesStatus =
        filterStatus === "all" || subscriber.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Then sort
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue, bValue;

        // Handle different keys
        switch (sortConfig.key) {
          case "name":
            aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
            bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case "email":
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "subscriptionDate":
            aValue = new Date(a.subscriptionDate);
            bValue = new Date(b.subscriptionDate);
            break;
          default:
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        // Compare values
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

  const sortedSubscribers = getSortedSubscribers();

  // Calculate pagination
  const totalItems = sortedSubscribers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentSubscribers = sortedSubscribers.slice(startIndex, endIndex);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Handle export
  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    console.log("Exporting subscribers for", plan.name);
    
    // Create a CSV string
    const headers = ["Name", "Email", "Phone", "Subscription Date", "Status", "Payment Status", "Frequency"];
    const csvRows = [headers];
    
    sortedSubscribers.forEach(subscriber => {
      const row = [
        `${subscriber.firstName} ${subscriber.lastName}`,
        subscriber.email,
        subscriber.phoneNumber,
        formatDate(subscriber.subscriptionDate),
        subscriber.status,
        subscriber.paymentStatus,
        subscriber.frequency
      ];
      csvRows.push(row);
    });
    
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${plan.name}_subscribers.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-amber-700 dark:text-amber-600 flex items-center">
              <PiUsersThreeDuotone   className="mr-2 h-8 w-8 text-admin-600" />
              {plan.name} Subscribers
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {totalItems} {totalItems === 1 ? "person" : "people"} subscribed
              to this plan
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <TbDownload className="mr-1.5 h-5 w-5" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative rounded-md w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TbSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 sm:text-sm"
              placeholder="Search subscribers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-3 w-full md:w-auto">
            <select
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Error Loading Subscribers
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : totalItems === 0 ? (
          <div className="text-center py-16">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No subscribers found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "This plan has no subscribers yet"}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Subscriber</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon("email")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("subscriptionDate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Subscription Date</span>
                    {getSortIcon("subscriptionDate")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("frequency")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Frequency</span>
                    {getSortIcon("frequency")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-admin-100 dark:bg-admin-900/30 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-admin-600 dark:text-admin-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.firstName} {subscriber.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subscriber.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {subscriber.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(subscriber.subscriptionDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                        subscriber.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {subscriber.status.charAt(0).toUpperCase() +
                        subscriber.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white capitalize">
                      {subscriber.frequency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/users/${subscriber.id}`}
                      className="text-admin-600 hover:text-admin-900 dark:text-admin-400 dark:hover:text-admin-300"
                    >
                      <FiEye className="h-5 w-5 inline" />
                      <span className="sr-only">View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
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
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="sr-only">First</span>
                  <FiChevronLeft className="h-5 w-5" />
                  <FiChevronLeft className="h-5 w-5 -ml-2" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    // Add ellipsis
                    const showEllipsisBefore =
                      index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter =
                      index < array.length - 1 &&
                      array[index + 1] !== page + 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-admin-50 dark:bg-admin-900/30 border-admin-500 dark:border-admin-500 text-admin-600 dark:text-admin-400"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                        {showEllipsisAfter && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                            ...
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="sr-only">Last</span>
                  <FiChevronRight className="h-5 w-5" />
                  <FiChevronRight className="h-5 w-5 -ml-2" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSubscribersList;
