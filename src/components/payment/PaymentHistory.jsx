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
  TbReportAnalytics,
  TbSearch,
} from "react-icons/tb";
import { formatDate } from "../../utils/formatDate";
import { MpesaIcon } from "../common/icons";
import { formatCurrency } from "../../utils/formatCurrency";
import Pagination from "../common/Pagination";
import { StatusBadge } from "../../utils/statusBadge";

const PaymentHistory = ({ title = "Recent Transactions", onViewReceipt }) => {
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
        console.log(response);
        if (response && response.success) {
          setPayments(response.data || []);
          
        } else {
          setPayments([]);
          
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError("Failed to load payment history. Please try again later.");

        // Try to get from localStorage fallback
        const storedPayments = localStorage.getItem("paymentHistory");
        if (storedPayments) {
          setPayments(JSON.parse(storedPayments));
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters]);

  // Calculate total pages whenever payments or search term changes
  useEffect(() => {
    // Apply filtering to the payments
    const filtered = getFilteredPayments();
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1);
  }, [payments, searchTerm, filters]);

  // Get filtered payments based on search term and other filters
  const getFilteredPayments = () => {
    return payments.filter((payment) => {
      const matchesSearch =
        searchTerm === "" ||
        payment.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(payment.amount)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filters.status === "" || payment.status === filters.status;

      const matchesDateRange =
        filters.dateRange === "" ||
        (payment.paymentDate &&
          new Date(payment.paymentDate) >=
            new Date(getStartDateFromRange(filters.dateRange)));

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  };

  const getStartDateFromRange = (range) => {
    if (!range) return null;

    const now = new Date();
    switch (range) {
      case "today":
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString();
      case "this_week":
        const startOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay()
        );
        return startOfWeek.toISOString();
      case "this_month":
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      case "last_3_months":
        return new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
      case "last_year":
        return new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString();
      default:
        return null;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   setCurrentPage(1); // Reset to first page on filter change
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const toggleFilters = () => {
  //   setIsFilterOpen(!isFilterOpen);
  // };

  const handleViewReceipt = (payment) => {
    if (onViewReceipt) {
      onViewReceipt(payment);
    }
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
  const filteredPayments = getFilteredPayments();
  // Paginate
  const pagedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl rounded-t-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:-6 flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-500 dark:text-white flex items-center md:w-[50%]">
            <TbHistory className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
            {title}
            <span className="ml-4 text-[0.75rem] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 px-2 rounded-full">
              {payments.length} transactions
            </span>
          </h2>

          <div className="flex flex-wrap items-center mt-4 sm:mt-0 w-full md:w-[50%]">
            {/* Search and filter buttons */}

            <div className="relative w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="text-sm block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="Search by reference code..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* <button
              className="ml-2 inline-flex items-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
              onClick={toggleFilters}
            >
              <FiFilter className="h-4 w-4 mr-2" />
              Filter
              {isFilterOpen ? (
                <FiChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <FiChevronDown className="ml-1 h-4 w-4" />
              )}
            </button> */}
          </div>
        </div>

        {/* Filters panel */}
        {isFilterOpen && (
          <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
                  value={filters.status}
                  onChange={handleFilterChange}
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="dateRange"
                  name="dateRange"
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="last_year">Last Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
              {pagedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
                      {formatDate(payment.paymentDate)}
                    </div>
                    <div className="text-[0.7rem] sm:text-xs font-medium text-gray-500 dark:text-gray-500">
                      {new Date(payment.paymentDate).toLocaleTimeString([], {
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
                      <MpesaIcon width={60} height={20} />
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
      </div>
    </>
  );
};

export default PaymentHistory;
