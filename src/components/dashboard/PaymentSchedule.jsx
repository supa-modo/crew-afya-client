import React from "react";
import {
  PiClockCountdownDuotone,
  PiMoneyWavy,
  PiCalendarCheckDuotone,
} from "react-icons/pi";
import { TbActivity, TbArrowsShuffle, TbCalendarDue } from "react-icons/tb";
import { getPremiumAmount } from "../../services/subscriptionService";

const PaymentSchedule = ({
  nextPaymentDate,
  userSubscription,
  handleOpenFrequencyModal,
}) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";

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

  // Helper function to safely get the premium amount
  const getFormattedPremium = () => {
    if (!userSubscription || !userSubscription.plan) {
      return "KES 0.00";
    }

    try {
      const amount = getPremiumAmount(
        userSubscription.plan,
        userSubscription.frequency
      );
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting premium:", error);
      return "KES 0";
    }
  };

  // Check if subscription exists
  const hasSubscription = userSubscription && userSubscription.plan;

  // Get color scheme based on payment frequency
  const getFrequencyColorScheme = () => {
    if (!userSubscription || !userSubscription.frequency) return "emerald";

    switch (userSubscription.frequency.toLowerCase()) {
      case "daily":
        return "blue";
      case "weekly":
        return "indigo";
      case "monthly":
        return "purple";
      case "annual":
        return "amber";
      default:
        return "emerald";
    }
  };

  const colorScheme = getFrequencyColorScheme();

  const getFrequencyIcon = () => {
    if (!userSubscription || !userSubscription.frequency) {
      return (
        <TbActivity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      );
    }

    switch (userSubscription.frequency.toLowerCase()) {
      case "daily":
        return (
          <TbActivity className={`h-5 sm:h-6 w-5 sm:w-6 text-blue-600 dark:text-blue-500`} />
        );
      case "weekly":
        return (
          <TbActivity
            className={`h-5 sm:h-6 w-5 sm:w-6 text-indigo-600 dark:text-indigo-500`}
          />
        );
      case "monthly":
        return (
          <TbActivity
            className={`h-5 sm:h-6 w-5 sm:w-6 text-purple-600 dark:text-purple-500`}
          />
        );
      case "annual":
        return (
          <TbActivity
            className={`h-5 sm:h-6 w-5 sm:w-6 text-amber-600 dark:text-amber-500`}
          />
        );
      default:
        return (
          <TbActivity className="h-5 sm:h-6 w-5 sm:w-6 text-emerald-600 dark:text-emerald-400" />
        );
    }
  };

  return (
    <div className="rounded-xl overflow-hidden">
      {!hasSubscription ? (
        <div className=" ">
          <div className="text-center py-3 sm:py-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-200/70 dark:bg-gray-700 flex items-center justify-center mb-4">
              <TbCalendarDue className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 sm:mb-4">
              No active subscription found.
            </p>
            <a
              href="/payments"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 border border-transparent rounded-lg shadow-sm text-[0.83rem] sm:text-sm font-medium text-white transition-colors duration-200"
            >
              <TbArrowsShuffle className="mr-2 h-5 w-5" />
              Subscribe to a plan
            </a>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="space-y-2 sm:space-y-3">
            {/* Next Payment Section */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-gray-800 dark:to-gray-700 border border-amber-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-900/30 mr-3">
                    <TbCalendarDue className="h-5 sm:h-6 w-5 sm:w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300">
                      Next Payment
                    </h4>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
                      {formatDate(nextPaymentDate)}
                    </div>
                  </div>
                </div>
                {/* Countdown indicator */}
                <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <PiClockCountdownDuotone className="h-4 sm:h-5 w-4 sm:w-5 mr-1" />
                  <span>Upcoming</span>
                </div>
              </div>
            </div>

            {/* Amount Section */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-700 border border-emerald-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg bg-emerald-200 dark:bg-emerald-900/30 mr-3">
                  <PiMoneyWavy className="h-5 sm:h-6 w-5 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300">
                    Payment Amount
                  </h4>
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {getFormattedPremium()}
                </div>
                </div>
              </div>
             
            </div>

            {/* Frequency Section */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-${colorScheme}-50 to-${colorScheme}-50/50 dark:from-gray-800 dark:to-gray-700 border border-${colorScheme}-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300`}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`p-2 rounded-lg bg-${colorScheme}-200 dark:bg-${colorScheme}-800/50 mr-3`}
                >
                  {getFrequencyIcon()}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300">
                    Payment Frequency
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                <div className="text-sm sm:text-base font-semibold capitalize text-gray-700 dark:text-white">
                  {userSubscription ? userSubscription.frequency : "Weekly"}
                </div>
                <button
                  onClick={handleOpenFrequencyModal}
                  className="text-xs font-medium underline text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                >
                  
                  Change
                </button>
              </div>
                </div>
              </div>
              
            </div>

            
          </div>

          <button
              onClick={handleOpenFrequencyModal}
              className="w-full mt-5 py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
              disabled={!hasSubscription}
            >
              <TbArrowsShuffle className="mr-2 h-5 w-5" />
              Change Payment Frequency
            </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSchedule;
