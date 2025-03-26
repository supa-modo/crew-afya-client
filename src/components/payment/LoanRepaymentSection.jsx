import React from "react";
import { TbCreditCardFilled } from "react-icons/tb";

const LoanRepaymentSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <TbCreditCardFilled className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <h3 className="text-center text-lg font-semibold text-gray-700 dark:text-white mb-4">
        Loan Repayment Coming Soon
      </h3>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        We're currently working on implementing loan repayment functionality.
        This feature will be available in the near future, allowing you to
        easily manage and repay your loans through our platform.
      </p>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-base font-medium text-gray-700 dark:text-white mb-3">
          Upcoming Features:
        </h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>View all active loans and balances</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>Make full or partial loan repayments</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>Set up automated monthly repayments</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>Track repayment history and generate statements</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          We'll notify you as soon as this feature becomes available. Thank you
          for your patience!
        </p>
      </div>
    </div>
  );
};

export default LoanRepaymentSection;
