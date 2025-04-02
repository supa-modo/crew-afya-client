import React from "react";
import { Link } from "react-router-dom";
import { TbShieldCheck, TbBus, TbArrowNarrowRight } from "react-icons/tb";

const RecentPayments = ({ recentPayments, formatCurrency, formatTime }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-amber-700 dark:text-amber-600">
            Recent Payments
          </h2>
          <Link
            to="/admin/payments"
            className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
          >
            View all payments
            <TbArrowNarrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg mr-3 ${
                    payment.type === "medical"
                      ? "bg-indigo-100 dark:bg-indigo-800/30"
                      : "bg-emerald-100 dark:bg-emerald-800/30"
                  }`}
                >
                  {payment.type === "medical" ? (
                    <TbShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <TbBus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    {payment.userName}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-2">{payment.id}</span>
                    <span>•</span>
                    <span className="ml-2">{formatTime(payment.date)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {formatCurrency(payment.amount)}
                </div>
                <div
                  className={`text-xs ${
                    payment.status === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : payment.status === "pending"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentPayments;
