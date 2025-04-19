import React from "react";
import { motion } from "framer-motion";
import {
  TbX,
  TbCheck,
  TbHospital,
  TbStethoscope,
  TbEye,
  TbMoodSmile,
  TbCalendarTime,
  TbClock,
  TbShieldHalfFilled,
  TbUser,
  TbUsers,
  TbBrandCashapp,
  TbAlertCircle,
  TbWheelchair,
  TbActivity,
  TbAmbulance,
  TbPill,
  TbHeartRateMonitor,
} from "react-icons/tb";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { formatCurrency } from "../../utils/formatCurrency";
import { PiUserDuotone, PiUsersDuotone } from "react-icons/pi";

const PlanDetailsModal = ({ plan, isOpen, onClose }) => {
  if (!isOpen || !plan) return null;

  // Helper to format coverage and benefits
  const formatCoverage = (amount) => {
    if (!amount || amount === 0) return "Not covered";
    return formatCurrency(amount);
  };

  // Benefits section renders
  const BenefitItem = ({ icon: Icon, title, value, description }) => (
    <div className="border-t border-gray-200 dark:border-gray-700 py-3">
      
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
          <span className="text-[0.8rem] sm:text-sm font-semibold text-primary-600 dark:text-primary-400">
            {value}
          </span>
        </div>
        {description && (
          <p className="mt-1 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[295] bg-gray-900 bg-opacity-45 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="relative z-[300] inline-block w-full max-w-3xl px-2 sm:px-4 pt-5 pb-4 overflow-hidden text-left align-bottom bg-white dark:bg-gray-800 rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:p-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Close Button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <TbX className="w-6 h-6" />
            </button>
          </div>

          {/* Plan Header */}
          <div className="flex items-center mb-4 sm:mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
            
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-500">
                {plan.name}
              </h2>
              <p className="text-[0.83rem] sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {plan.description}
              </p>
              <div className="flex items-center mt-2">
                {plan.maxDependents > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 mr-2">
                    <PiUsersDuotone className="mr-1 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    Up to {plan.maxDependents} Dependents
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-2">
                    <PiUserDuotone className="mr-1 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    Individual Plan
                  </span>
                )}
               
              </div>
            </div>
          </div>

          {/* Coverage Amounts Section */}
          <div className="mb-4">
           
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mb-0.5 sm:mb-1.5">
                  <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                    Inpatient
                  </h4>
                </div>
                <p className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.inpatientLimit)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mb-0.5 sm:mb-1.5">
                  <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                    Outpatient
                  </h4>
                </div>
                <p className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.outpatientLimit)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mb-0.5 sm:mb-1.5">
                  <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                    Dental
                  </h4>
                </div>
                <p className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.dentalLimit || plan.opticalLimit / 2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mb-0.5 sm:mb-1.5">
                  <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                    Optical
                  </h4>
                </div>
                <p className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.opticalLimit)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Benefits Section */}
          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-600 dark:text-white mb-3">
              Additional Benefits
            </h3>
            <div className="bg-white dark:bg-gray-800 px-2 sm:px-5 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              <BenefitItem
                title="Maternity Cover"
                value={formatCoverage(plan.maternityLimit)}
                description="Covers pregnancy-related medical expenses"
              />

              <BenefitItem
                title="Emergency Evacuation"
                value={formatCoverage(plan.emergencyEvacuation)}
                description="Emergency medical transportation"
              />

              <BenefitItem
                title="Accident Cover"
                value={formatCoverage(plan.accidentLimit)}
                description="Coverage for accidental injuries"
              />

              <BenefitItem
                title="Disability Compensation"
                value={formatCoverage(plan.disabilityCompensation)}
                description="Benefits for disability due to illness or injury"
              />

              <BenefitItem
                title="Daily Cash Compensation"
                value={formatCurrency(plan.dailyCashCompensation) + " per day"}
                description="Compensation during hospital stays"
              />
            </div>
          </div>

          {/* Plan Terms Section */}
          <div className="mb-2">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="bg-white dark:bg-gray-800 p-2.5 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 ">
                  Waiting Period
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {plan.waitingPeriod} days from enrollment date
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-2.5 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-[0.8rem] sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 ">
                  
                  Pre-existing Conditions
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {plan.preExistingConditions
                    ? `Covered after ${plan.preExistingConditionsWaitingPeriod} days waiting period`
                    : "Not covered under this plan"}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Section */}
          <div className="mt-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-900/80 dark:to-gray-800 rounded-lg px-2 py-2.5 sm:p-3 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm sm:text-base font-semibold text-secondary-700 dark:text-secondary-500 mb-2">
              Premium Options
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs sm:text-[0.8rem] font-medium text-gray-500 dark:text-gray-400">
                  Daily
                </h4>
                <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-white">
                  {formatCurrency(plan.dailyPremium)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs sm:text-[0.8rem] font-medium text-gray-500 dark:text-gray-400">
                  Weekly
                </h4>
                <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-white">
                  {formatCurrency(plan.weeklyPremium)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs sm:text-[0.8rem] font-medium text-gray-500 dark:text-gray-400">
                  Monthly
                </h4>
                <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-white">
                  {formatCurrency(plan.monthlyPremium)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs sm:text-[0.8rem] font-medium text-gray-500 dark:text-gray-400">
                  Annual
                </h4>
                <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-white">
                  {formatCurrency(plan.annualPremium)}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[0.83rem] sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
