import React, { useState } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { MdHealthAndSafety } from "react-icons/md";

const MedicalPlanSelector = ({
  availablePlans,
  selectedPlan,
  handlePlanSelect,
  error,
}) => {
  const [frequency, setFrequency] = useState("monthly");

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle plan selection with frequency
  const handleSelectPlan = (plan) => {
    // Add frequency information to the plan
    const planWithFrequency = {
      ...plan,
      selectedFrequency: frequency,
      selectedAmount: plan.premiums[frequency],
    };
    handlePlanSelect(planWithFrequency);
  };

  // Get display text for frequency
  const getFrequencyLabel = (freq) => {
    switch (freq) {
      case "daily":
        return "daily";
      case "monthly":
        return "per month";
      case "annual":
        return "per year";
      default:
        return "";
    }
  };

  return (
    <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
        <MdHealthAndSafety className="mr-2 h-6 w-6 text-admin-500" />
        Medical Cover Plan
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
            <p className="ml-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Payment Frequency
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFrequency("daily")}
            className={`py-2 px-4 text-sm font-medium rounded-md ${
              frequency === "daily"
                ? "bg-admin-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setFrequency("monthly")}
            className={`py-2 px-4 text-sm font-medium rounded-md ${
              frequency === "monthly"
                ? "bg-admin-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setFrequency("annual")}
            className={`py-2 px-4 text-sm font-medium rounded-md ${
              frequency === "annual"
                ? "bg-admin-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-xl p-4 ${
              selectedPlan?.id === plan.id
                ? "border-admin-500 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-400"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            } cursor-pointer transition-colors duration-150`}
            onClick={() => handleSelectPlan(plan)}
          >
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold text-secondary-700 dark:text-secondary-600">
                {plan.name}
              </h4>
              <div
                className={`h-6 w-6 rounded-full border-2 ${
                  selectedPlan?.id === plan.id
                    ? "border-admin-600 dark:border-admin-400"
                    : "border-gray-300 dark:border-gray-600"
                } flex items-center justify-center`}
              >
                {selectedPlan?.id === plan.id && (
                  <div className="h-3 w-3 rounded-full bg-admin-600 dark:bg-admin-400"></div>
                )}
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {plan.description}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
              {plan.forWho}
            </p>

            <div className="mt-4">
              <span className="text-admin-600 dark:text-admin-400 font-bold text-lg">
                {formatCurrency(plan.premiums[frequency])}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {" "}
                {getFrequencyLabel(frequency)}
              </span>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Benefits:
              </h5>
              <ul className="space-y-1">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="flex-1">
                      <span className="font-semibold text-gray-500 dark:text-gray-300">
                        {benefit.name}:{" "}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {benefit.limit}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalPlanSelector;
