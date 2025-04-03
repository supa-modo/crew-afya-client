import React from "react";
import { TbListCheck, TbCheck } from "react-icons/tb";

/**
 * Component for displaying insurance plan benefits
 */
const BenefitsCard = ({ plan }) => {
  if (!plan) return null;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Not covered";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Define benefits based on plan attributes with fallback values
  const benefits = [
    {
      name: "Inpatient Coverage",
      value: formatCurrency(plan.inpatientLimit || 0),
      description: "Covers hospital stays, surgeries, and related services",
    },
    {
      name: "Outpatient Coverage",
      value: formatCurrency(plan.outpatientLimit || 0),
      description: "Covers doctor visits, lab tests, and medications",
    },
    {
      name: "Maternity Coverage",
      value: formatCurrency(plan.maternityLimit || 0),
      description: "Covers prenatal care, delivery, and postnatal care",
    },
    {
      name: "Optical Coverage",
      value: formatCurrency(plan.opticalLimit || 0),
      description: "Covers eye exams, glasses, and contact lenses",
    },
    {
      name: "Dental Coverage",
      value: formatCurrency(plan.dentalLimit || 0),
      description: "Covers dental checkups, treatments, and procedures",
    },
    {
      name: "Last Expense",
      value: formatCurrency(plan.lastExpense || 0),
      description: "Funeral expenses coverage",
    },
    {
      name: "Emergency Evacuation",
      value: formatCurrency(plan.emergencyEvacuation || 0),
      description: "Covers emergency medical transportation",
    },
    {
      name: "Disability Compensation",
      value: formatCurrency(plan.disabilityCompensation || 0),
      description: "Compensation for permanent disability",
    },
    {
      name: "Wellness Support",
      value: plan.wellnessSupport || "Included",
      description: "Mental health and wellness programs",
    },
  ];

  // Filter out benefits with "Not covered" value
  const availableBenefits = benefits.filter(benefit => 
    benefit.value !== "Not covered" && benefit.value !== "KSh 0"
  );

  return (
    <div className="rounded-sm overflow-hidden ">
      <div className=" px-4">
        <h3 className="text-amber-700 dark:text-amber-600 font-semibold flex items-center">
          <TbListCheck className="mr-2 h-5 w-5" />
          Plan Benefits
        </h3>
      </div>
      <div className="p-5">
        {availableBenefits.length > 0 ? (
          <div className="space-y-4">
            {availableBenefits.map((benefit, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white flex items-center">
                      <TbCheck className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                      {benefit.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-5">
                      {benefit.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {benefit.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">
              Benefit details not available for this plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitsCard;
