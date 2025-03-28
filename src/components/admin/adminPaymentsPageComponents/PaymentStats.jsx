import React from "react";
import {
  TbCashBanknote,
  TbInfoCircle,
  TbAlertCircle,
  TbArrowsExchange,
} from "react-icons/tb";
import { formatCurrency }  from "../../../utils/formatCurrency";

const PaymentStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 mr-4">
            <TbCashBanknote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(stats.totalAmount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              From {stats.completedCount} completed payments
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
              {stats.pendingCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Requiring verification
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
              Failed Transactions
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {stats.failedCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Requiring investigation
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-500 mr-4">
            <TbArrowsExchange className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Refunded Amount
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(stats.refundedAmount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total refunded payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;
