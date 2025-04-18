import React from "react";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { TbEdit, TbTrash } from "react-icons/tb";

const PlanCard = ({
  plan,
  formatCurrency,
  formatDate,
  onEditPlan,
  onViewSubscribers,
  onDeletePlan,
  isCurrentlySelected,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${
        isCurrentlySelected
          ? "border-admin-500 dark:border-admin-400"
          : "border-gray-200 dark:border-gray-700"
      } overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-amber-700 dark:text-white">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {plan.description}
            </p>
          </div>
          <div
            className={`px-3 py-0.5 rounded-full text-xs font-medium ${
              plan.isActive
                ? "bg-green-200 border border-green-400 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-200 border border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {plan.isActive ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daily Premium
            </p>
            <p className="mt-1 text-base font-semibold text-admin-700 dark:text-white">
              {formatCurrency(plan.dailyPremium)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Weekly Premium
            </p>
            <p className="mt-1 text-base font-semibold text-admin-700 dark:text-white">
              {formatCurrency(plan.weeklyPremium)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Premium
            </p>
            <p className="mt-1 text-base font-semibold text-admin-700 dark:text-white">
              {formatCurrency(plan.monthlyPremium)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Annual Premium
            </p>
            <p className="mt-1 text-base font-semibold text-admin-700 dark:text-white">
              {formatCurrency(plan.annualPremium)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Key Benefits
          </h4>
          <div className="space-y-2">
            {plan.metadata?.benefits?.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {benefit.name}
                </span>
                <span className="font-semibold text-gray-600 dark:text-white">
                  {benefit.limit}
                </span>
              </div>
            ))}
            {plan.metadata?.benefits?.length > 3 && (
              <p className="text-xs text-admin-600 dark:text-admin-400">
                +{plan.metadata.benefits.length - 3} more benefits
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <button
              onClick={() => onEditPlan(plan)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
            >
              <TbEdit className="mr-1.5 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onDeletePlan(plan.id)}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TbTrash className="mr-1.5 h-4 w-4" />
              Delete
            </button>
          </div>
          <button
            onClick={() => onViewSubscribers(plan)}
            className={`inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isCurrentlySelected
                ? "bg-admin-700 hover:bg-admin-800"
                : "bg-admin-600 hover:bg-admin-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500`}
          >
            <PiUsersThreeDuotone className="mr-1.5 h-6 w-6" />
            View Subscribers
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
