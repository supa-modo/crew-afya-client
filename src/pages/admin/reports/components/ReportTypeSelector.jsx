import React from "react";
import { TbReportMoney, TbUsers, TbShield, TbCash } from "react-icons/tb";

const ReportTypeSelector = ({ reportType, handleReportTypeChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Report Type
      </label>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          className={`flex items-center p-3 rounded-lg border ${
            reportType === "financial"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleReportTypeChange("financial")}
        >
          <TbReportMoney className="h-5 w-5 mr-2 text-admin-600 dark:text-admin-400" />
          <span>Financial Reports</span>
        </button>
        <button
          className={`flex items-center p-3 rounded-lg border ${
            reportType === "user"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleReportTypeChange("user")}
        >
          <TbUsers className="h-5 w-5 mr-2 text-admin-600 dark:text-admin-400" />
          <span>User Analytics</span>
        </button>
        <button
          className={`flex items-center p-3 rounded-lg border ${
            reportType === "insurance"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleReportTypeChange("insurance")}
        >
          <TbShield className="h-5 w-5 mr-2 text-admin-600 dark:text-admin-400" />
          <span>Insurance Coverage</span>
        </button>
        <button
          className={`flex items-center p-3 rounded-lg border ${
            reportType === "payment"
              ? "bg-admin-50 border-admin-500 text-admin-700 dark:bg-admin-900/20 dark:border-admin-400 dark:text-admin-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleReportTypeChange("payment")}
        >
          <TbCash className="h-5 w-5 mr-2 text-admin-600 dark:text-admin-400" />
          <span>Payment Analytics</span>
        </button>
      </div>
    </div>
  );
};

export default ReportTypeSelector;
