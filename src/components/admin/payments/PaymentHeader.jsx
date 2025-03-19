import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiRefreshCw, FiDownload, FiFilter } from "react-icons/fi";
import { TbHome2, TbCash, TbFilter } from "react-icons/tb";

const PaymentHeader = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onExport,
  onToggleFilters,
  activeFilters,
}) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-4">
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
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Payment Management
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-semibold text-admin-700 dark:text-admin-500 flex items-center">
            <TbCash className="mr-2 h-7 w-7 text-admin-600" />
            Payment Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage all payment transactions with comprehensive audit
            trails
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search transaction, user or reference..."
              className="pl-9 pr-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 text-sm text-gray-600/90 sm:text-base transition-colors duration-200 w-full"
              value={searchTerm}
              onChange={onSearchChange}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-admin-600 hover:bg-admin-50 dark:text-admin-400 dark:hover:bg-gray-700 rounded-lg"
            title="Refresh data"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
            onClick={onExport}
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
          <button
            onClick={onToggleFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
          >
            <TbFilter className="mr-2 h-4 w-4" />
            Filters
            {activeFilters && (
              <span className="ml-1 h-2 w-2 rounded-full bg-admin-600"></span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentHeader;
