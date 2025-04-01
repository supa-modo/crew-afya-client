import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import { MdHealthAndSafety } from "react-icons/md";
import insuranceService from "../../services/insuranceService";

const MedicalPlanSelector = ({
  selectedPlan,
  handlePlanSelect,
  error: propError,
  isSubmitting,
}) => {
  const [frequency, setFrequency] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const plansData = await insuranceService.getInsurancePlans();
      setPlans(plansData);
    } catch (error) {
      setError(error.message || "Failed to fetch plans");
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-6">
          <MdHealthAndSafety className="h-6 w-6 text-admin-500" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border rounded-xl p-6 space-y-4 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-3 bg-gray-200 dark:bg-gray-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || propError) {
    return (
      <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error Loading Plans
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error || propError}
              </p>
              <button
                onClick={fetchPlans}
                className="mt-2 text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-600 dark:hover:text-red-400"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
        <MdHealthAndSafety className="mr-2 h-6 w-6 text-admin-500" />
        Medical Cover Plan
      </h2>

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
            onClick={() => setFrequency("weekly")}
            className={`py-2 px-4 text-sm font-medium rounded-md ${
              frequency === "weekly"
                ? "bg-admin-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Weekly
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
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-xl p-4 ${
              selectedPlan?.id === plan.id
                ? "border-admin-500 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-400"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            } cursor-pointer transition-colors duration-150 relative`}
            onClick={() => handleSelectPlan(plan)}
          >
            {isSubmitting && selectedPlan?.id === plan.id && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-xl">
                <FiLoader className="h-8 w-8 text-admin-600 animate-spin" />
              </div>
            )}
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
                per {frequency.replace("ly", "")}
              </span>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Benefits:
              </h5>
              <ul className="space-y-1">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
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
