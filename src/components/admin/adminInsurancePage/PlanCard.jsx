import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { TbShieldCheck } from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";

const PlanCard = ({
  plan,
  formatCurrency,
  formatDate,
  onEditPlan,
  onViewSubscribers,
  onDeletePlan,
  isCurrentlySelected,
}) => {
  // By default, show expanded details
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MdHealthAndSafety className="mr-2 h-6 w-6 text-admin-600" />
            {plan.name}
          </h2>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              plan.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {plan.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {plan.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Daily Premium
            </p>
            <p className="text-lg font-semibold text-admin-600 dark:text-admin-400">
              {formatCurrency(plan.premiums.daily)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Monthly Premium
            </p>
            <p className="text-lg font-semibold text-admin-600 dark:text-admin-400">
              {formatCurrency(plan.premiums.monthly)}
            </p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mr-4">
            <FiUsers className="mr-1 h-4 w-4 text-gray-400" />
            <span>{plan.subscriberCount} subscribers</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Updated: {formatDate(plan.updatedAt)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => onEditPlan(plan)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <FiEdit2 className="mr-1.5 h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => onViewSubscribers(plan)}
            className={`inline-flex items-center px-3 py-1.5 border ${
              isCurrentlySelected
                ? "border-admin-500 text-admin-700 bg-admin-100 dark:bg-admin-900/30 dark:text-admin-300 dark:border-admin-600"
                : "border-admin-300 text-admin-700 bg-admin-50 hover:bg-admin-100 dark:bg-admin-900/20 dark:text-admin-400 dark:border-admin-800 dark:hover:bg-admin-900/40"
            } text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500`}
          >
            <FiUsers className="mr-1.5 h-4 w-4" />
            {isCurrentlySelected ? "Currently Viewing" : "View Subscribers"}
          </button>
          <button
            onClick={() => onDeletePlan(plan.id)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40"
          >
            <FiTrash2 className="mr-1.5 h-4 w-4" /> Delete
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-center items-center py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        >
          {isExpanded ? (
            <>
              Less details <FiChevronUp className="ml-1" />
            </>
          ) : (
            <>
              More details <FiChevronDown className="ml-1" />
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coverage Details
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(plan.coverageDetails).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded"
                >
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {key}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Benefits
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start text-sm">
                  <TbShieldCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {benefit.name}:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {benefit.limit}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
