import React from "react";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import {
  TbShieldPlus,
  TbCalendarTime,
  TbShieldHalfFilled,
  TbFileInvoice,
} from "react-icons/tb";
import { Link } from "react-router-dom";
import { BiSupport } from "react-icons/bi";

// Import our new component structure
import CoverageUtilizationCard from "./medical/CoverageUtilizationCard";
import BenefitsCard from "./medical/BenefitsCard";
import EmergencyContactsCard from "./medical/EmergencyContactsCard";
import ClaimsHistoryTable from "./medical/ClaimsHistoryTable";
import HealthInsuranceCard from "./HealthInsuranceCard";

const MedicalCoverTab = ({
  userId,
  userSubscription,
  coverageUtilization,
  isLoading,
  error,
  handleOpenFrequencyModal,
  claims = [],
  claimsLoading = false,
  claimsError = null,
  coverageLimits = null,
  limitsLoading = false,
  limitsError = null,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userSubscription || !userSubscription.plan) {
    return (
      <div className="text-center py-12">
        <TbShieldPlus className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Active Medical Cover
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          You currently don't have an active medical cover. Subscribe to a plan
          to get started with your healthcare coverage.
        </p>
        <Link
          to="/payments"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          View Insurance Plans
        </Link>
      </div>
    );
  }

  // Handle the case where coverageUtilization might not be available yet
  const coverage = coverageUtilization?.coverage || {
    inpatient: 0,
    outpatient: 0,
    dental: 0,
    optical: 0,
    maternity: 0,
  };

  const utilization = coverageUtilization?.utilization || {
    inpatient: 0,
    outpatient: 0,
    dental: 0,
    optical: 0,
    maternity: 0,
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-0 sm:px-2 md:px-6">
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Insurance Card */}
        <div className="space-y-8">
          <HealthInsuranceCard
            user={userId}
            subscription={userSubscription}
            handleOpenFrequencyModal={handleOpenFrequencyModal}
          />
        </div>

        {/* Right column - Coverage Utilization */}
        <div className="space-y-8">
          <CoverageUtilizationCard
            utilization={utilization}
            loading={isLoading}
          />
        </div>
      </div>

      <div className="mt-8">
        {/* Benefits Card */}
        <BenefitsCard plan={userSubscription.plan} />
      </div>

      {/* Bottom section - Claims */}
      <div className="mt-8">
        {/* Claims History  */}
        <div className="w-full">
          <div className="">
            <div className="px-4">
              <h3 className="text-base font-semibold text-amber-800 dark:text-amber-400 flex items-center">
                <TbFileInvoice className="mr-2 h-5 w-5" />
                Medical Claims History
              </h3>
            </div>

            <div className="p-4">
              {claimsError ? (
                <div className="text-center py-4 text-red-500 dark:text-red-400">
                  <p>{claimsError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <ClaimsHistoryTable
                  userId={userId}
                  loading={claimsLoading}
                  coverageLimits={coverageLimits}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          to="/payments"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <TbShieldHalfFilled className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Change Coverage Plan
        </Link>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <BiSupport className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default MedicalCoverTab;
