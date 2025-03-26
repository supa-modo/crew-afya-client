// src/components/payment/UnionMembershipHistory.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FiLoader,
  FiDownload,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";
import { HiCash } from "react-icons/hi";
import {
  TbCalendarDot,
  TbCash,
  TbCreditCard,
  TbHistory,
  TbMoneybag,
} from "react-icons/tb";
import { apiGet, apiDownload } from "../../services/api";
import { formatDate } from "../../utils/formatDate";
import { MpesaIcon } from "../common/icons";

const UnionMembershipHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membershipPayments, setMembershipPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    const fetchMembershipPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiGet("/union-membership/payments");

        console.log("Membership payments API response:", response);

        if (response.success) {
          // Format payments to match the format used in PaymentHistory
          const formattedPayments = response.data.map((payment) => ({
            id: payment.id,
            date: payment.paymentDate,
            amount: payment.amount,
            status: payment.status.toLowerCase(),
            method:
              payment.paymentMethod === "mpesa"
                ? "M-Pesa"
                : payment.paymentMethod,
            reference:
              payment.mpesaReceiptNumber || payment.transactionId || "-",
          }));

          setMembershipPayments(formattedPayments);
          setTotalPages(Math.ceil(formattedPayments.length / pageSize));
        } else {
          throw new Error(
            response.message || "Failed to fetch payment history"
          );
        }
      } catch (error) {
        console.error("Error fetching membership payments:", error);
        setError(error.message || "Failed to fetch payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPayments();
  }, [filters.status, filters.dateRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    let icon = null;

    switch (status) {
      case "completed":
        bgColor = "bg-green-200 dark:bg-green-900/50";
        textColor = "text-green-700 dark:text-green-400";
        icon = <FiCheck className="mr-1 h-4 w-4" />;
        break;
      case "failed":
        bgColor = "bg-red-200 dark:bg-red-900/50";
        textColor = "text-red-700 dark:text-red-400";
        icon = <FiX className="mr-1 h-4 w-4" />;
        break;
      case "pending":
        bgColor = "bg-yellow-200 dark:bg-yellow-900/50";
        textColor = "text-yellow-700 dark:text-yellow-400";
        icon = <FiClock className="mr-1 h-4 w-4" />;
        break;
      default:
        bgColor = "bg-gray-100 dark:bg-gray-700";
        textColor = "text-gray-700 dark:text-gray-400";
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle download receipt
  const handleDownloadReceipt = async (payment) => {
    try {
      await apiDownload(
        `/payments/${payment.id}/receipt`,
        `receipt-${payment.reference}.pdf`
      );
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!membershipPayments || membershipPayments.length === 0) {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">
          Membership Payment History
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          No membership payments found. Once you register as a member, your
          payment will appear here.
        </p>
      </div>
    );
  }

  // Filter and search payments
  const filteredPayments = membershipPayments.filter((payment) => {
    // Search by reference or method
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (payment.reference &&
          payment.reference.toLowerCase().includes(searchLower)) ||
        (payment.method && payment.method.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Paginate payments
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3 pt-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 md:w-[50%]">
            <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-white">
              Membership Payment History
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({filteredPayments.length} transactions)
            </span>
          </div>

          <div className="w-full md:w-[50%] flex flex-row items-end sm:items-center gap-3">
            <div className="relative w-full">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                    placeholder="Search by reference or method..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <button
              onClick={toggleFilters}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold whitespace-nowrap ${
                showFilters
                  ? "bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Filters
            </button>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold whitespace-nowrap bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200">
              <FiDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="text-sm md:text-base font-medium block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 text-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
              >
                Date Range
              </label>
              <select
                id="dateRange"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="text-sm md:text-base font-medium block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 text-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
              >
                <option value="">All Time</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <TbCalendarDot className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Date
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <HiCash className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Amount
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <TbCreditCard className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Method
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                Reference Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedPayments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
                    {formatDate(payment.date)}
                  </div>
                  <div className="text-[0.7rem] sm:text-xs font-medium text-gray-500 dark:text-gray-500">
                    {new Date(payment.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
                    {formatCurrency(payment.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-0.5 rounded-md text-xs sm:text-sm font-medium dark:text-blue-400">
                    {payment.method === "M-Pesa" ? (
                      <MpesaIcon width={60} height={20} />
                    ) : payment.method === "Card" ? (
                      <TbCreditCard className="mr-2 h-5 w-5 text-blue-500" />
                    ) : payment.method === "Cash" ? (
                      <TbCash className="mr-2 h-5 w-5 text-yellow-500" />
                    ) : payment.method === "Bank Transfer" ? (
                      <TbMoneybag className="mr-2 h-5 w-5 text-purple-500" />
                    ) : (
                      <TbHistory className="mr-2 h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {payment.reference || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                  {payment.status === "completed" && (
                    <button
                      onClick={() => handleDownloadReceipt(payment)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 items-center gap-2 transition-colors duration-200"
                      title="Download Receipt"
                    >
                      <div className="flex items-center gap-2">
                        <FiDownload className="h-5 w-5" />
                        <span>Receipt</span>
                      </div>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredPayments.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredPayments.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-xs sm:text-sm font-medium ${
                      currentPage === index + 1
                        ? "z-10 bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-600 dark:text-primary-400"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnionMembershipHistory;
