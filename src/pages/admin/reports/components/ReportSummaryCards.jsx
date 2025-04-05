import React from "react";
import {
  TbCashBanknote,
  TbCash,
  TbInfoCircle,
  TbAlertCircle,
  TbCheck,
  TbShield,
  TbDeviceMobile,
  TbClock,
  TbArrowsExchange,
} from "react-icons/tb";
import {
  formatCurrency,
  formatPercentage,
  formatTime,
} from "../utils/formatters";
import { PiUsersDuotone } from "react-icons/pi";

const ReportSummaryCards = ({ reportType, summaryData }) => {
  if (!summaryData) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Key Performance Indicators
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportType === "financial" && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 mr-4">
                  <TbCashBanknote className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summaryData.financial.totalRevenue)}
                  </p>
                  <div className="flex items-center text-xs">
                    <span
                      className={
                        summaryData.financial.revenueGrowth > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {summaryData.financial.revenueGrowth > 0 ? "+" : ""}
                      {summaryData.financial.revenueGrowth}%
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      vs previous period
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 mr-4">
                  <TbCash className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Transactions
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {summaryData.financial.totalTransactions.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Avg{" "}
                    {formatCurrency(
                      summaryData.financial.averageTransactionValue
                    )}{" "}
                    per transaction
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 mr-4">
                  <TbInfoCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pending Payments
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summaryData.financial.pendingPaymentsTotal)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Awaiting processing
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 mr-4">
                  <TbAlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Failed/Refunded
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      summaryData.financial.failedPaymentsTotal +
                        summaryData.financial.refundsTotal
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(summaryData.financial.refundsTotal)} in
                    refunds
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {reportType === "user" && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 mr-4">
                  <PiUsersDuotone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {summaryData.user.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs">
                    <span
                      className={
                        summaryData.user.userGrowth > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {summaryData.user.userGrowth > 0 ? "+" : ""}
                      {summaryData.user.userGrowth}%
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      growth rate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add the remaining user cards */}
            {/* ... Similar structures for the other 3 user cards ... */}
          </>
        )}

        {reportType === "insurance" && (
          <>
            {/* Insurance KPI cards */}
            {/* ... Similar structure to financial and user cards ... */}
          </>
        )}

        {reportType === "payment" && (
          <>
            {/* Payment KPI cards */}
            {/* ... Similar structure to financial and user cards ... */}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportSummaryCards;
