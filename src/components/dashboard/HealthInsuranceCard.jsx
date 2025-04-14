import React from "react";
import PropTypes from "prop-types";
import {
  TbShieldCheckFilled,
  TbCalendarEvent,
  TbClock,
  TbEdit,
  TbStethoscope,
  TbHeartRateMonitor,
  TbCurrencyDollar,
} from "react-icons/tb";

const HealthInsuranceCard = ({
  user,
  subscription,
  handleOpenFrequencyModal,
}) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get premium amount based on frequency
  const getPremiumAmount = () => {
    if (!subscription?.plan) return 0;

    switch (subscription.frequency) {
      case "daily":
        return subscription.plan.dailyPremium || 0;
      case "weekly":
        return subscription.plan.weeklyPremium || 0;
      case "monthly":
        return subscription.plan.monthlyPremium || 0;
      case "annual":
        return subscription.plan.annualPremium || 0;
      default:
        return subscription.plan.monthlyPremium || 0;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <TbShieldCheckFilled className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-500 dark:text-white">
                Health Insurance Cover
            </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                CrewAfya Health Insurance
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-4 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {subscription?.status || "Active"}
            </span>
                  </div>
                </div>

        {/* Plan Details */}
        <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TbStethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Plan
                </p>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {subscription?.plan?.name || "Basic Medical Cover"}
                </h4>
              </div>
            </div>
            <button
              onClick={handleOpenFrequencyModal}
              className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <TbEdit className="h-4 w-4" />
              <span>Change</span>
            </button>
                </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <TbCurrencyDollar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Premium
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatCurrency(getPremiumAmount())}
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                    per {subscription?.frequency || "month"}
                    </span>
                </p>
                  </div>
                </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <TbHeartRateMonitor className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Coverage Limit
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatCurrency(subscription?.plan?.coverageLimit || 500000)}
                </p>
                  </div>
                </div>
                  </div>
                </div>

        {/* Coverage Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <TbCalendarEvent className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Start Date
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatDate(subscription?.coverage?.startDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <TbClock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Next Payment
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatDate(subscription?.coverage?.nextPaymentDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HealthInsuranceCard.propTypes = {
  user: PropTypes.object,
  subscription: PropTypes.object,
  handleOpenFrequencyModal: PropTypes.func,
};

export default HealthInsuranceCard;
