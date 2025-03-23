import React from "react";
import {
  FiCalendar,
  FiClock,
  FiCheck,
  FiAlertTriangle,
  FiArrowRight,
} from "react-icons/fi";
import { PiUserDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

const UnionDuesSummary = ({ membershipData }) => {
  // This would come from props in real implementation
  const duesData = membershipData || {
    status: "Active", // Active, Expired, Grace Period
    paidUntil: "2025-04-30",
    lastPayment: {
      date: "2025-03-15",
      amount: 300,
    },
    nextPaymentDate: "2025-04-15",
    nextPaymentAmount: 300,
    memberSince: "2024-11-01",
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days remaining until next payment
  const calculateDaysRemaining = (nextDate) => {
    const today = new Date();
    const paymentDate = new Date(nextDate);
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining(duesData.nextPaymentDate);

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-900/30";
      case "Grace Period":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-200 dark:bg-yellow-900/30";
      case "Expired":
        return "text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-green-600 dark:bg-green-700 py-4 px-6">
        <h3 className="text-white font-semibold flex items-center">
          <PiUserDuotone className="mr-2 h-5 w-5" />
          Union Membership Status
        </h3>
      </div>

      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-4 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                duesData.status
              )}`}
            >
              {duesData.status === "Active" && <FiCheck className="mr-1" />}
              {duesData.status === "Grace Period" && (
                <FiClock className="mr-1" />
              )}
              {duesData.status === "Expired" && (
                <FiAlertTriangle className="mr-1" />
              )}
              {duesData.status}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Member since {formatDate(duesData.memberSince)}
          </span>
        </div>

        {/* Payment Info */}
        <div className="space-y-3 mt-2">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Membership Valid Until:
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {formatDate(duesData.paidUntil)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last Payment:
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {formatCurrency(duesData.lastPayment.amount)} on{" "}
              {formatDate(duesData.lastPayment.date)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Next Payment Due:
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {formatCurrency(duesData.nextPaymentAmount)} on{" "}
              {formatDate(duesData.nextPaymentDate)}
            </span>
          </div>

          {/* Days Remaining Indicator */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Days until next payment:
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {daysRemaining} days
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  daysRemaining < 5
                    ? "bg-red-500"
                    : daysRemaining < 15
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(100, (daysRemaining / 30) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            to="/payments"
            className="block w-full text-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            Make Union Dues Payment
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnionDuesSummary;
