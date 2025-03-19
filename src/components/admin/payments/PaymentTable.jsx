import React, { useMemo } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiFilter,
} from "react-icons/fi";
import {
  TbCash,
  TbCreditCard,
  TbDeviceMobile,
  TbFileAnalytics,
  TbHistory,
  TbMoneybag,
  TbReceipt,
  TbShield,
  TbUser,
  TbCheck,
  TbInfoCircle,
  TbAlertCircle,
  TbArrowsExchange,
} from "react-icons/tb";
import { parseISO } from "date-fns";

const PaymentTable = ({
  loading,
  payments,
  searchTerm,
  statusFilter,
  methodFilter,
  planFilter,
  dateRange,
  sortBy,
  sortOrder,
  currentPage,
  itemsPerPage,
  handleSortChange,
  handleViewPayment,
  handleViewReceipt,
  handleViewAuditTrail,
  setCurrentPage,
  setItemsPerPage,
  handleResetFilters,
  formatCurrency,
  formatDate,
}) => {
  // Loading skeleton count
  const skeletonCount = 10;

  // Get payment status info
  const getPaymentStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "text-green-600 dark:text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/20",
          icon: <TbCheck className="h-4 w-4" />,
          label: "Completed",
        };
      case "pending":
        return {
          color: "text-yellow-600 dark:text-yellow-500",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
          icon: <TbInfoCircle className="h-4 w-4" />,
          label: "Pending",
        };
      case "processing":
        return {
          color: "text-blue-600 dark:text-blue-500",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
          icon: <TbArrowsExchange className="h-4 w-4" />,
          label: "Processing",
        };
      case "failed":
        return {
          color: "text-red-600 dark:text-red-500",
          bgColor: "bg-red-100 dark:bg-red-900/20",
          icon: <TbAlertCircle className="h-4 w-4" />,
          label: "Failed",
        };
      case "refunded":
        return {
          color: "text-purple-600 dark:text-purple-500",
          bgColor: "bg-purple-100 dark:bg-purple-900/20",
          icon: <TbArrowsExchange className="h-4 w-4" />,
          label: "Refunded",
        };
      default:
        return {
          color: "text-gray-600 dark:text-gray-500",
          bgColor: "bg-gray-100 dark:bg-gray-900/20",
          icon: <TbInfoCircle className="h-4 w-4" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        // Search term filter
        const searchMatches =
          payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.mpesaCode &&
            payment.mpesaCode.toLowerCase().includes(searchTerm.toLowerCase()));

        // Status filter
        const statusMatches =
          statusFilter === "all" || payment.status === statusFilter;

        // Payment method filter
        const methodMatches =
          methodFilter === "all" || payment.method === methodFilter;

        // Plan filter
        const planMatches = planFilter === "all" || payment.plan === planFilter;

        // Date range filter
        let dateMatches = true;
        if (dateRange.start && dateRange.end) {
          const paymentDate = parseISO(payment.date);
          const startDate = new Date(`${dateRange.start}T00:00:00`);
          const endDate = new Date(`${dateRange.end}T23:59:59`);
          dateMatches = paymentDate >= startDate && paymentDate <= endDate;
        }

        return (
          searchMatches &&
          statusMatches &&
          methodMatches &&
          planMatches &&
          dateMatches
        );
      })
      .sort((a, b) => {
        // Sort logic
        if (sortBy === "date") {
          return sortOrder === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        } else if (sortBy === "amount") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else if (sortBy === "id") {
          return sortOrder === "asc"
            ? a.id.localeCompare(b.id)
            : b.id.localeCompare(a.id);
        }

        // Default sort
        return 0;
      });
  }, [
    payments,
    searchTerm,
    statusFilter,
    methodFilter,
    planFilter,
    dateRange,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange("id")}
              >
                <div className="flex items-center">
                  <span>Transaction ID</span>
                  {sortBy === "id" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 transform rotate-180" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange("date")}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {sortBy === "date" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 transform rotate-180" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Method
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Plan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange("amount")}
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  {sortBy === "amount" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 transform rotate-180" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
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
            {loading ? (
              // Loading skeleton
              Array.from({ length: skeletonCount }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : paginatedPayments.length === 0 ? (
              // No results found
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <TbFileAnalytics className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      No payments found
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      methodFilter !== "all" ||
                      planFilter !== "all" ||
                      (dateRange.start && dateRange.end)
                        ? "Try adjusting your filters or search term"
                        : "No payment transactions are available at this time"}
                    </p>
                    {(searchTerm ||
                      statusFilter !== "all" ||
                      methodFilter !== "all" ||
                      planFilter !== "all" ||
                      (dateRange.start && dateRange.end)) && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
                      >
                        <FiFilter className="mr-2 h-4 w-4" />
                        Reset filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Payments data
              paginatedPayments.map((payment) => {
                const statusInfo = getPaymentStatusInfo(payment.status);
                return (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <TbUser className="mr-2 h-5 w-5 text-gray-400" />
                        <span>{payment.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        {payment.method === "M-Pesa" ? (
                          <TbDeviceMobile className="mr-2 h-5 w-5 text-green-500" />
                        ) : payment.method === "Card" ? (
                          <TbCreditCard className="mr-2 h-5 w-5 text-blue-500" />
                        ) : payment.method === "Cash" ? (
                          <TbCash className="mr-2 h-5 w-5 text-yellow-500" />
                        ) : payment.method === "Bank Transfer" ? (
                          <TbMoneybag className="mr-2 h-5 w-5 text-purple-500" />
                        ) : (
                          <TbHistory className="mr-2 h-5 w-5 text-gray-500" />
                        )}
                        <span>{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <TbShield className="mr-2 h-5 w-5 text-admin-500" />
                        <span>
                          {payment.plan}
                          <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 capitalize">
                            ({payment.coveragePeriod})
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor}`}
                      >
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="text-admin-600 hover:text-admin-900 dark:text-admin-400 dark:hover:text-admin-300"
                          title="View details"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View receipt"
                        >
                          <TbReceipt className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewAuditTrail(payment)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="View audit trail"
                        >
                          <TbHistory className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && paginatedPayments.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-y-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{" "}
            {filteredPayments.length} payments
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:text-white"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="mr-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the page number to show
                let pageNum;
                if (totalPages <= 5) {
                  // Show all pages if 5 or less
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // At the start
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // At the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`mx-1 px-3 py-1 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 ${
                      currentPage === pageNum
                        ? "bg-admin-600 text-white border-admin-600 dark:bg-admin-700 dark:border-admin-700"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
