import React from "react";
import { PiClockCountdownDuotone, PiMoneyWavy } from "react-icons/pi";
import { TbActivity } from "react-icons/tb";

const PaymentSchedule = ({
  nextPaymentDate,
  userSubscription,
  handleOpenFrequencyModal,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-primary-600 p-4">
        <h3 className="text-white font-semibold flex items-center">
          <PiMoneyWavy className="mr-2 h-5 w-5" />
          Payment Schedule
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <PiClockCountdownDuotone className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Next Payment
              </span>
            </div>
            <span className="font-semibold text-sm text-gray-800 dark:text-white">
              {nextPaymentDate}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <PiMoneyWavy className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Amount
              </span>
            </div>
            <span className="font-semibold text-sm text-gray-800 dark:text-white">
              {userSubscription
                ? `KES ${userSubscription.plan.premiums[
                    userSubscription.frequency
                  ].toLocaleString()}`
                : "KES 500.00"}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <TbActivity className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Frequency
              </span>
            </div>
            <span className="font-semibold text-sm text-gray-800 dark:text-white capitalize">
              {userSubscription ? userSubscription.frequency : "Weekly"}
            </span>
          </div>
          <button
            onClick={handleOpenFrequencyModal}
            className="mt-2 w-full py-2 text-primary-600 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/50 dark:hover:bg-primary-900/30 rounded-lg font-medium text-sm"
          >
            Change Payment Frequency
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
