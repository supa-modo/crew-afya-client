import React from "react";
import { FiCalendar } from "react-icons/fi";
import { TbFilter } from "react-icons/tb";

const PaymentFilters = ({
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  planFilter,
  setPlanFilter,
  dateRange,
  setDateRange,
  uniqueStatuses,
  uniqueMethods,
  uniquePlans,
  handleResetFilters,
}) => {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <TbFilter className="mr-2 h-5 w-5 text-admin-600 dark:text-admin-500" />
          Filter Transactions
        </h2>
        <button
          onClick={handleResetFilters}
          className="text-sm text-admin-600 dark:text-admin-500 hover:text-admin-700 dark:hover:text-admin-400"
        >
          Reset all filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="methodFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Payment Method
          </label>
          <select
            id="methodFilter"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {uniqueMethods.map((method) => (
              <option key={method} value={method}>
                {method === "all" ? "All Methods" : method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="planFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Insurance Plan
          </label>
          <select
            id="planFilter"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {uniquePlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan === "all" ? "All Plans" : plan}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;
