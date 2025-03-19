import React from "react";
import { format } from "date-fns";

const ReportDateRange = ({
  dateRange,
  handleDateRangeChange,
  showCustomDateRange,
  customDateRange,
  handleCustomDateChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Date Range
      </label>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <button
          className={`px-4 py-2 rounded-lg border ${
            dateRange === "week"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleDateRangeChange("week")}
        >
          Last Week
        </button>
        <button
          className={`px-4 py-2 rounded-lg border ${
            dateRange === "month"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleDateRangeChange("month")}
        >
          Last Month
        </button>
        <button
          className={`px-4 py-2 rounded-lg border ${
            dateRange === "quarter"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleDateRangeChange("quarter")}
        >
          Last Quarter
        </button>
        <button
          className={`px-4 py-2 rounded-lg border ${
            dateRange === "year"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleDateRangeChange("year")}
        >
          Last Year
        </button>
        <button
          className={`px-4 py-2 rounded-lg border ${
            dateRange === "ytd"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleDateRangeChange("ytd")}
        >
          Year to Date
        </button>
        <button
          className={`px-4 py-2 rounded-lg border ${
            dateRange === "custom"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleDateRangeChange("custom")}
        >
          Custom Range
        </button>
      </div>

      {/* Custom date range picker */}
      {showCustomDateRange && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={customDateRange.start}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={customDateRange.end}
              onChange={(e) => handleCustomDateChange("end", e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
              min={customDateRange.start}
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDateRange;
