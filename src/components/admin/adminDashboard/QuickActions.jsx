import React from "react";
import { Link } from "react-router-dom";
import { RiUserAddLine } from "react-icons/ri";
import { TbShieldCheck, TbCoins, TbChartBar } from "react-icons/tb";

const QuickActions = () => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-5">
          <h2 className="text-base font-bold text-amber-700 dark:text-amber-600 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/members/new"
              className="flex flex-col items-center justify-center p-4 bg-admin-50 dark:bg-admin-900/10 rounded-lg border border-admin-100 dark:border-admin-800 hover:bg-admin-100 dark:hover:bg-admin-800/20 transition-colors"
            >
              <RiUserAddLine className="h-7 w-7 text-admin-600 dark:text-admin-400 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                Add Member
              </span>
            </Link>
            <Link
              to="/admin/plans"
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-800/20 transition-colors"
            >
              <TbShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                Manage Plans
              </span>
            </Link>
            <Link
              to="/admin/payments"
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-800/20 transition-colors"
            >
              <TbCoins className="h-7 w-7 text-emerald-600 dark:text-emerald-400 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                View Payments
              </span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors"
            >
              <TbChartBar className="h-7 w-7 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                Generate Reports
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
