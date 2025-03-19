import React from "react";
import { Link } from "react-router-dom";
import { TbHome2, TbReportAnalytics } from "react-icons/tb";
import { FiRefreshCw, FiDownload } from "react-icons/fi";

const ReportHeader = ({
  onRefresh,
  exportButtonRef,
  exportLoading,
  handleExportReport,
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
                Reports & Analytics
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-semibold text-admin-700 dark:text-admin-500 flex items-center">
            <TbReportAnalytics className="mr-2 h-7 w-7 text-admin-600" />
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Generate comprehensive reports and analyze financial data
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            className="p-2 text-admin-600 hover:bg-admin-50 dark:text-admin-400 dark:hover:bg-gray-700 rounded-lg"
            title="Refresh data"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              ref={exportButtonRef}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              onClick={() => {
                document
                  .getElementById("export-menu")
                  .classList.toggle("hidden");
              }}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-admin-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <FiDownload className="mr-2 h-4 w-4" />
                  Export Report
                </>
              )}
            </button>
            <div
              id="export-menu"
              className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 border border-gray-200 dark:border-gray-700 py-1"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleExportReport("pdf")}
              >
                Export as PDF
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleExportReport("excel")}
              >
                Export as Excel
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleExportReport("csv")}
              >
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportHeader;
