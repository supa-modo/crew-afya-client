import React from "react";
import {
  FiEye,
  FiClock,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiDownload,
} from "react-icons/fi";
import {
  TbReceipt,
  TbCalendarDot,
  TbCreditCard,
  TbShieldHalfFilled,
  TbCash,
  TbHistory,
  TbMoneybag,
  TbClockDollar,
} from "react-icons/tb";
import { HiCash } from "react-icons/hi";
import { MpesaIcon } from "../../common/icons";
import Pagination from "../../common/Pagination";
import { PiUserDuotone } from "react-icons/pi";

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
  totalItems,
  handleSortChange,
  handleViewPayment,
  handleViewReceipt,
  handleViewAuditTrail,
  setCurrentPage,
  setItemsPerPage,
  handleResetFilters,
  formatCurrency,
  formatDate,
  handleExportData,
  handleSearchChange,
  handleSearch,
  toggleFilters,
  showFilters,
}) => {
  // Function to render table header with sort indicators
  const renderTableHeader = (label, field, icon = null) => {
    return (
      <th
        scope="col"
        className="px-6 py-3 text-left text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider cursor-pointer"
        onClick={() => handleSortChange(field)}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
          <span className="inline-flex flex-col ml-1">
            {sortBy === field ? (
              sortOrder === "asc" ? (
                <FiChevronUp className="h-4 w-4 text-primary-600" />
              ) : (
                <FiChevronDown className="h-4 w-4 text-primary-600" />
              )
            ) : (
              <span className="inline-flex flex-col">
                <FiChevronUp className="h-3 w-3 text-gray-400 -mb-1" />
                <FiChevronDown className="h-3 w-3 text-gray-400" />
              </span>
            )}
          </span>
        </div>
      </th>
    );
  };

  // Get payment status info for badge
  const getPaymentStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "text-green-800 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Completed",
        };
      case "pending":
        return {
          color: "text-yellow-800 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "Pending",
        };
      case "processing":
        return {
          color: "text-blue-800 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "Processing",
        };
      case "failed":
        return {
          color: "text-red-800 dark:text-red-400",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          label: "Failed",
        };
      case "refunded":
        return {
          color: "text-purple-800 dark:text-purple-400",
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          label: "Refunded",
        };
      case "cancelled":
        return {
          color: "text-gray-800 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-700",
          label: "Cancelled",
        };
      default:
        return {
          color: "text-gray-800 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-700",
          label:
            status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown",
        };
    }
  };

  // Click handler for table row
  const handleRowClick = (payment) => {
    handleViewPayment(payment);
  };

  // Loading skeleton
  const renderSkeletonRows = () => {
    return Array(Math.min(itemsPerPage, 5))
      .fill(0)
      .map((_, index) => (
        <tr key={`skeleton-${index}`} className="animate-pulse">
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex justify-end space-x-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"></div>
            </div>
          </td>
        </tr>
      ));
  };

  // Check if there are any payments after filtering
  const hasPayments = payments && payments.length > 0;

  // Get plan information from payment data
  const getPlanInfo = (payment) => {
    // Check if plan exists in metadata or directly in the payment object
    if (payment.metadata && payment.metadata.plan) {
      return payment.metadata.plan;
    } else if (payment.plan) {
      return payment.plan;
    }
    return "N/A";
  };

  // Get payment service name from payment
  const getPaymentService = (payment) => {
    
    if (payment.metadata.paymentType == 'membership') {
        return 'Membership Fee';
    } else if (payment.metadata.paymentType == 'medical') {
        return 'Medical Insurance';
    } else if (payment.metadata.paymentType == 'loan-repayment') {
        return 'Loan Repayment';
    }
        return 'Other Services';
    
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
        icon = <FiChevronUp className="mr-1 h-4 w-4" />;
        break;
      case "failed":
        bgColor = "bg-red-200 dark:bg-red-900/50";
        textColor = "text-red-700 dark:text-red-400";
        icon = <FiChevronDown className="mr-1 h-4 w-4" />;
        break;
      case "pending":
        bgColor = "bg-yellow-200 dark:bg-yellow-900/50";
        textColor = "text-yellow-700 dark:text-yellow-400";
        icon = <FiClock className="mr-1 h-4 w-4" />;
        break;
      default:
        bgColor = "bg-gray-200 dark:bg-gray-700";
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

  // Get reference number from payment
  const getPaymentReference = (payment) => {
    return (
      payment.mpesaReceiptNumber ||
      payment.transactionId ||
      // payment.reference ||
      // payment.id?.substring(0, 8) ||
      "N/A"
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3 pt-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Title */}
          <div className="flex items-center gap-2 md:w-[50%]">
            <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-white">
              Payment Transactions
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({totalItems} transactions)
            </span>
          </div>

          {/* Search and Filters - Full width on mobile */}
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
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={handleSearchChange || ((e) => {})}
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

            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold whitespace-nowrap bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm md:text-base font-medium block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 text-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            {/* More filters can be added here similar to PaymentHistory */}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {renderTableHeader(
                "Date",
                "paymentDate",
                <TbCalendarDot className="mr-2 h-5 w-5" />
              )}
              {renderTableHeader("ID/Reference", "id")}
              {renderTableHeader("Member", "member", <PiUserDuotone className="mr-2 h-5 w-5"/>)}
              {renderTableHeader(
                "Service",
                "service",
                <TbShieldHalfFilled className="mr-2 h-5 w-5" />
              )}
              {renderTableHeader(
                "Amount",
                "amount",
                <HiCash className="mr-2 h-5 w-5" />
              )}
              {renderTableHeader("Status", "status")}
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs sm:text-[0.8rem] font-medium text-primary-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              renderSkeletonRows()
            ) : hasPayments ? (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleRowClick(payment)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
                      {formatDate(payment.paymentDate || payment.date)}
                    </div>
                    <div className="text-[0.7rem] sm:text-xs font-medium text-gray-500 dark:text-gray-500">
                      {new Date(
                        payment.paymentDate || payment.date
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                    <div className="truncate max-w-[120px]">
                      {getPaymentReference(payment)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-400">
                    
                    <div className="">
                        <div className="text-sm font-medium text-gray-700 dark:text-white">
                          {payment.user.firstName} {payment.user.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.user.membershipNumber || "No Membership Number"}
                        </div>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                   {getPaymentService(payment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      
                      <button
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-1 pr-2 rounded-full transition-colors duration-150"
                        title="View Payment Receipt"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReceipt(payment);
                        }}
                      >
                        <TbReceipt className="h-5 w-5" />
                        <span>Receipt</span>
                      </button>
                      <button
                        className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 p-1 rounded-full transition-colors duration-150"
                        title="View Audit Trail"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAuditTrail(payment);
                        }}
                      >
                        <TbClockDollar className="h-5 w-5" />
                        <span>Trail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {statusFilter !== "all" ||
                  methodFilter !== "all" ||
                  planFilter !== "all" ||
                  dateRange.start ||
                  dateRange.end ||
                  searchTerm ? (
                    <div>
                      <p className="mb-2">No payments match your filters</p>
                      <button
                        className="inline-flex items-center text-admin-600 hover:text-admin-700 dark:text-admin-500 dark:hover:text-admin-400"
                        onClick={handleResetFilters}
                      >
                        <FiRefreshCw className="h-4 w-4 mr-1" />
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    "No payments found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasPayments && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          totalItems={totalItems}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default PaymentTable;
