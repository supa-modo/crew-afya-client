import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDownload } from "../../services/api";
import {
  FiDownload,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { HiCash } from "react-icons/hi";
import {
  TbCalendarDot,
  TbCash,
  TbCreditCard,
  TbHistory,
  TbMoneybag,
  TbReceipt,
  TbShieldHalfFilled,
  TbReportMoney,
  TbFileDownload,
} from "react-icons/tb";
import { formatDate } from "../../utils/formatDate";
import { MpesaIcon } from "../common/icons";
import { formatCurrency } from "../../utils/formatCurrency";
import Pagination from "../common/Pagination";
import PaymentReceiptModal from "../admin/adminPaymentsPageComponents/PaymentReceiptModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const PaymentHistory = ({ title = "Recent Transactions" }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);

        // Fetch payment history from API using our apiGet helper
        const response = await apiGet("/payments/history", {
          limit: 50, // Get more records to allow for client-side filtering
          offset: 0,
          status: filters.status || undefined,
          startDate: getStartDateFromRange(filters.dateRange),
          endDate: new Date().toISOString(),
        });

        if (response.success) {
          // Map API response to match the expected format
          const paymentData = response.data.map((payment) => {
            // Extract plan name from description using regex
            let planName = "Crew Afya Lite"; // Default value

            if (payment.description) {
              // This regex looks for text between "Payment for " and " medical cover"
              const planRegex = /Payment for (.*?) medical cover/;
              const match = payment.description.match(planRegex);

              if (match && match[1]) {
                planName = match[1]; // This will extract the plan name
              }
            }

            return {
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
              plan: planName, // Use the extracted plan name here
              // Keep any other fields that might be needed for receipt generation
              phoneNumber: payment.phoneNumber,
              metadata: payment.metadata,
              paymentDate: payment.paymentDate,
              paymentMethod: payment.paymentMethod,
              mpesaCode: payment.mpesaCode,
              mpesaReceiptNumber: payment.mpesaReceiptNumber,
              coveragePeriod: payment.coveragePeriod,
              description: payment.description,
            };
          });

          // Sort payments by date (newest first)
          const sortedPayments = [...paymentData].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setPayments(sortedPayments);
          setTotalPages(Math.ceil(sortedPayments.length / pageSize));
        } else {
          throw new Error(
            response.message || "Failed to fetch payment history"
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load payment history");
        console.error("Payment history error:", err);

        // Fallback to localStorage if API fails
        const storedPayments = localStorage.getItem("paymentHistory");
        if (storedPayments) {
          const paymentData = JSON.parse(storedPayments);
          setPayments(paymentData);
          setTotalPages(Math.ceil(paymentData.length / pageSize));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters.status, filters.dateRange]);

  // Helper function to get start date based on date range filter
  const getStartDateFromRange = (range) => {
    const now = new Date();
    switch (range) {
      case "last7days":
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return sevenDaysAgo.toISOString();
      case "last30days":
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return thirtyDaysAgo.toISOString();
      case "last90days":
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(now.getDate() - 90);
        return ninetyDaysAgo.toISOString();
      default:
        return undefined;
    }
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
        bgColor =
          "bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-300 dark:border-green-800/50";
        textColor = "text-green-700 dark:text-green-400";
        icon = <FiCheck className="mr-1 h-4 w-4" />;
        break;
      case "failed":
        bgColor =
          "bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-300 dark:border-red-800/50";
        textColor = "text-red-700 dark:text-red-400";
        icon = <FiX className="mr-1 h-4 w-4" />;
        break;
      case "pending":
        bgColor =
          "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-300 dark:border-yellow-800/50";
        textColor = "text-yellow-700 dark:text-yellow-400";
        icon = <FiClock className="mr-1 h-4 w-4" />;
        break;
      default:
        bgColor =
          "bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-300 dark:border-gray-800/50";
        textColor = "text-gray-700 dark:text-gray-400";
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${bgColor} ${textColor}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle view or download receipt
  const handleDownloadReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-md text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-2" />
          Error loading payment history
        </h3>
        <p>{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-500 dark:text-gray-400 mb-4 shadow-md">
          <TbReceipt className="h-8 w-8" />
        </div>
        <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-2">
          No payment history yet
        </h3>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          You haven't made any payments yet. When you make payments, they will
          appear here.
        </p>
      </div>
    );
  }

  // Filter and search payments
  const filteredPayments = payments.filter((payment) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl rounded-t-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 pt-5 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Dynamic Title */}
          <div className="flex items-center gap-2 md:w-[50%]">
            <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg shadow-sm mr-2">
              <TbReportMoney className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {filteredPayments.length} transactions
            </span>
          </div>

          {/* Search and Filters */}
          <div className="w-full md:w-[50%] flex flex-row items-end sm:items-center gap-3">
            <div className="relative w-full">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="text-sm block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                    placeholder="Search by reference or method..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <button
              onClick={toggleFilters}
              className={`inline-flex items-center px-4 py-2.5 border rounded-lg shadow-sm text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                showFilters
                  ? "bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-600"
              }`}
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Filters
            </button>

            <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold whitespace-nowrap bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200">
              <TbFileDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-5 grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
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
                <div className="flex items-center">
                  <TbShieldHalfFilled className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Medical Cover
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
                  {payment.plan || "Crew Afya Lite"}
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
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 items-center gap-2 transition-colors duration-200 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg shadow-sm border border-primary-200 dark:border-primary-800/50"
                      title="View Receipt"
                    >
                      <div className="flex items-center gap-2">
                        <TbReceipt className="h-4 w-4" />
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

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPayments.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <PaymentReceiptModal
          payment={selectedPayment}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};

export default PaymentHistory;
