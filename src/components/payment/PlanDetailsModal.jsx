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

const PlanDetailsModal = ({ plan, isOpen, onClose }) => {
  if (!isOpen || !plan) return null;

  // Helper to format coverage and benefits
  const formatCoverage = (amount) => {
    if (!amount || amount === 0) return "Not covered";
    return formatCurrency(amount);
  };

  // Benefits section renders
  const BenefitItem = ({ icon: Icon, title, value, description }) => (
    <div className="flex border-t border-gray-200 dark:border-gray-700 py-3">
      <div className="flex-shrink-0 mr-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {value}
          </span>
        </div>
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
          className="fixed inset-0 z-[295] transition-opacity bg-gray-900 bg-opacity-45 backdrop-blur-[2px]"
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
          transition={{ duration: 0.2 }}
          className="relative z-[300] inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-2xl sm:my-8 sm:align-middle sm:p-6 border border-gray-200 dark:border-gray-700"
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
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 mr-4">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <MdOutlineHealthAndSafety className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {plan.description}
              </p>
              <div className="flex items-center mt-2">
                {plan.maxDependents > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                    <TbUsers className="mr-1 h-3 w-3" />
                    Up to {plan.maxDependents} Dependents
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-2">
                    <TbUser className="mr-1 h-3 w-3" />
                    Individual Plan
                  </span>
                )}
                <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <TbShieldHalfFilled className="h-3.5 w-3.5 mr-1" />
                  {plan.category || "Medical"} Coverage
                </span>
              </div>
            </div>
          </div>

          {/* Coverage Amounts Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Coverage Limits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-1.5">
                  <TbHospital className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1.5" />
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Inpatient
                  </h4>
                </div>
                <p className="text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.inpatientLimit)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-1.5">
                  <TbStethoscope className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1.5" />
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Outpatient
                  </h4>
                </div>
                <p className="text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.outpatientLimit)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-1.5">
                  <TbMoodSmile className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1.5" />
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Dental
                  </h4>
                </div>
                <p className="text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.dentalLimit || plan.opticalLimit / 2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-1.5">
                  <TbEye className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1.5" />
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Optical
                  </h4>
                </div>
                <p className="text-base font-bold text-primary-600 dark:text-primary-400">
                  {formatCoverage(plan.opticalLimit)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Benefits Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Additional Benefits
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              <BenefitItem
                icon={TbCalendarTime}
                title="Maternity Cover"
                value={formatCoverage(plan.maternityLimit)}
                description="Covers pregnancy-related medical expenses"
              />

              <BenefitItem
                icon={TbAmbulance}
                title="Emergency Evacuation"
                value={formatCoverage(plan.emergencyEvacuation)}
                description="Emergency medical transportation"
              />

              <BenefitItem
                icon={TbActivity}
                title="Accident Cover"
                value={formatCoverage(plan.accidentLimit)}
                description="Coverage for accidental injuries"
              />

              <BenefitItem
                icon={TbWheelchair}
                title="Disability Compensation"
                value={formatCoverage(plan.disabilityCompensation)}
                description="Benefits for disability due to illness or injury"
              />

              <BenefitItem
                icon={TbBrandCashapp}
                title="Daily Cash Compensation"
                value={formatCurrency(plan.dailyCashCompensation) + " per day"}
                description="Compensation during hospital stays"
              />
            </div>
          </div>

          {/* Plan Terms Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Plan Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <TbClock className="h-4 w-4 mr-1.5 text-primary-600 dark:text-primary-400" />
                  Waiting Period
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.waitingPeriod} days from enrollment date
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <TbAlertCircle className="h-4 w-4 mr-1.5 text-primary-600 dark:text-primary-400" />
                  Pre-existing Conditions
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.preExistingConditions
                    ? `Covered after ${plan.preExistingConditionsWaitingPeriod} days waiting period`
                    : "Not covered under this plan"}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Section */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Premium Options
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Daily
                </h4>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatCurrency(plan.dailyPremium)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Weekly
                </h4>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatCurrency(plan.weeklyPremium)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Monthly
                </h4>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatCurrency(plan.monthlyPremium)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Annual
                </h4>
                <p className="text-base font-bold text-gray-900 dark:text-white">
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
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
