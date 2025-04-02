import React from "react";
import { TbShieldCheckFilled, TbCalendarEvent, TbClock, TbEdit } from "react-icons/tb";

/**
 * Component for displaying insurance plan details
 */
const PlanDetailsCard = ({ plan, coverage, frequency, handleOpenFrequencyModal }) => {
  if (!plan) return null;

  // Default coverage object if not provided
  const coverageData = coverage || {
    startDate: new Date().toISOString(),
    nextPaymentDate: new Date().toISOString()
  };

  const { startDate, nextPaymentDate } = coverageData;

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
    if (!plan) return 0;
    
    switch (frequency) {
      case "daily":
        return plan.dailyPremium || 0;
      case "weekly":
        return plan.weeklyPremium || 0;
      case "monthly":
        return plan.monthlyPremium || 0;
      case "annual":
        return plan.annualPremium || 0;
      default:
        return plan.monthlyPremium || 0;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
        <h3 className="text-white font-semibold flex items-center">
          <TbShieldCheckFilled className="mr-2 h-5 w-5" />
          Plan Details
        </h3>
      </div>
      <div className="p-5">
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {plan.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {plan.description || "Comprehensive medical coverage for you and your family"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <TbCalendarEvent className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Coverage Start
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(startDate)}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <TbClock className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Next Payment
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(nextPaymentDate)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex justify-between items-center">
            <span>Payment Details</span>
            {handleOpenFrequencyModal && (
              <button 
                onClick={handleOpenFrequencyModal}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center text-xs font-medium"
              >
                <TbEdit className="mr-1 h-4 w-4" />
                Change Frequency
              </button>
            )}
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                {frequency || "Monthly"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Premium</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {formatCurrency(getPremiumAmount())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Coverage Limit</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {formatCurrency(plan.coverageLimit || 500000)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsCard;
