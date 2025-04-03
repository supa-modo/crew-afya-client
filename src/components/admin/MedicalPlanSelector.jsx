import React, { useState } from "react";
import { TbShieldCheckFilled } from "react-icons/tb";

const MedicalPlanSelector = ({
  availablePlans = [],
  selectedPlan,
  handlePlanSelect,
  error,
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState("daily");

  // Ensure availablePlans is an array
  const plans = Array.isArray(availablePlans) ? availablePlans : [];

  // Helper function to get premium amount based on frequency
  const getPremiumAmount = (plan, frequency) => {
    if (!plan) return 0;
    
    // Handle plans with premiums object
    if (plan.premiums && plan.premiums[frequency] !== undefined) {
      return plan.premiums[frequency];
    }
    
    // Handle plans with individual premium fields (e.g., dailyPremium, monthlyPremium)
    const premiumField = `${frequency}Premium`;
    if (plan[premiumField] !== undefined) {
      return plan[premiumField];
    }
    
    return 0;
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Medical Cover Plan
      </h3>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedPlan?.id === plan.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
            }`}
            onClick={() => handlePlanSelect({ ...plan, selectedFrequency })}
          >
            {selectedPlan?.id === plan.id && (
              <div className="absolute top-4 right-4">
                <TbShieldCheckFilled className="h-8 w-8 text-primary-500" />
              </div>
            )}
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {plan.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {plan.description || (plan.forDependents ? "For Driver/Conductor + Dependents" : "For Driver/Conductor")}
            </p>

            <div className="space-y-3 mb-6">
              {/* Display benefits from metadata if available */}
              {plan.metadata?.benefits?.slice(0, 6).map((benefit, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {benefit.name}
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-500">
                    {benefit.limit}
                  </span>
                </div>
              ))}
              
              {/* If no metadata benefits, display from the plan model fields */}
              {(!plan.metadata?.benefits || plan.metadata.benefits.length === 0) && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Inpatient</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-500">
                      {plan.inpatientLimit || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Outpatient</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-500">
                      {plan.outpatientLimit ? `Up to ${plan.outpatientLimit.toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Maternity</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-500">
                      {plan.maternityLimit?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Optical</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-500">
                      {plan.opticalLimit?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                </>
              )}
              
              {plan.metadata?.benefits?.length > 6 && (
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  +{plan.metadata.benefits.length - 6} more benefits
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <select
                  className="block w-1/2 pl-3 pr-10 py-2 font-semibold text-gray-600 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm dark:bg-gray-700"
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
                <span className="text-xl font-bold text-secondary-700 dark:text-secondary-500">
                  KES {getPremiumAmount(plan, selectedFrequency)?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalPlanSelector;
