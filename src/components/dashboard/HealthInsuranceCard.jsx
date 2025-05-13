import React from "react";
import PropTypes from "prop-types";
import {
  TbShieldCheckFilled,
  TbCalendarEvent,
  TbClock,
  TbEdit,
} from "react-icons/tb";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const HealthInsuranceCard = ({
  user,
  subscription,
  handleOpenFrequencyModal,
}) => {
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
      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-3 sm:p-6 rounded-2xl shadow-md border border-blue-200 dark:border-gray-700">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-[0.95rem] sm:text-lg font-bold text-gray-500 dark:text-white">
                Medical Cover
              </h3>
              <p className="text-[0.77rem] sm:text-sm text-gray-600 dark:text-gray-300">
                CrewAfya Health Cover
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-2 sm:px-4 py-0.5 sm:py-1 text-[0.7rem] sm:text-xs font-medium rounded-full bg-secondary-200 border border-secondary-300 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400">
              {subscription?.status || "Active"}
            </span>
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-white/60 dark:bg-gray-800/50 border shadow-inner rounded-xl p-3.5 sm:p-4 mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <p className="text-[0.76rem] sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Plan
              </p>
              <h4 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-white">
                {subscription?.plan?.name || "Basic Medical Cover"}
              </h4>
            </div>
            <button
              onClick={handleOpenFrequencyModal}
              className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <TbEdit className="h-4 w-4" />
              <span>Change</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[0.76rem] sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Premium
              </p>
              <p className="text-[0.9rem] sm:text-base font-bold text-secondary-700 dark:text-white">
                {formatCurrency(getPremiumAmount())}
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                  {subscription?.frequency || "monthly"}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[0.76rem] sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Coverage Limit
              </p>
              <p className="text-[0.9rem] sm:text-base font-bold text-gray-600 dark:text-white">
                {formatCurrency(subscription?.plan?.coverageLimit || 500000)}
              </p>
            </div>
          </div>
        </div>

        {/* Coverage Dates */}
        <div className="grid grid-cols-2 gap-4 mb-2 sm:mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <TbCalendarEvent className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[0.8rem] sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Start Date
                </p>
                <p className="text-[0.93rem] sm:text-base font-bold text-gray-600 dark:text-white">
                  {formatDate(subscription?.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <TbClock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-[0.8rem] sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Next Payment
                </p>
                <p className="text-[0.93rem] sm:text-base font-bold text-gray-600 dark:text-white">
                  {formatDate(subscription?.nextPaymentDate)}
                </p>
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
