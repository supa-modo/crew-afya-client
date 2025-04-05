import React, { useState, useEffect } from "react";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { TbShieldPlus, TbCalendarTime, TbShieldHalfFilled, TbFileInvoice } from "react-icons/tb";
import { Link } from "react-router-dom";

// Import our new component structure
import CoverageUtilizationCard from "./medical/CoverageUtilizationCard";
import PlanDetailsCard from "./medical/PlanDetailsCard";
import BenefitsCard from "./medical/BenefitsCard";
import EmergencyContactsCard from "./medical/EmergencyContactsCard";
import ClaimsHistoryTable from "./medical/ClaimsHistoryTable";
import CoverageLimitsCard from "./medical/CoverageLimitsCard";
import { BiSupport } from "react-icons/bi";

// Import services
import { getUserClaims, getCoverageLimits } from "../../services/claimsService";

const MedicalCoverTab = ({ 
  userSubscription, 
  coverageUtilization, 
  isLoading, 
  error, 
  handleOpenFrequencyModal 
}) => {
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState(null);
  
  const [coverageLimits, setCoverageLimits] = useState(null);
  const [limitsLoading, setLimitsLoading] = useState(false);
  const [limitsError, setLimitsError] = useState(null);
  // Fetch user's claims and coverage limits when subscription data is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (userSubscription?.userId) {
        // Fetch user claims
        setClaimsLoading(true);
        try {
          const response = await getUserClaims(userSubscription.userId);
          if (response.success) {
            setClaims(response.data.claims || []);
          } else {
            setClaimsError(response.message || 'Failed to fetch claims');
          }
        } catch (err) {
          console.error('Error fetching user claims:', err);
          setClaimsError('An error occurred while fetching claims');
        } finally {
          setClaimsLoading(false);
        }
        
        // Fetch coverage limits
        setLimitsLoading(true);
        try {
          const response = await getCoverageLimits(userSubscription.userId);
          if (response.success) {
            setCoverageLimits(response.data);
          } else {
            setLimitsError(response.message || 'Failed to fetch coverage limits');
          }
        } catch (err) {
          console.error('Error fetching coverage limits:', err);
          setLimitsError('An error occurred while fetching coverage limits');
        } finally {
          setLimitsLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [userSubscription]);

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
    maternity: 0
  };
  
  const utilization = coverageUtilization?.utilization || {
    inpatient: 0,
    outpatient: 0,
    dental: 0,
    optical: 0,
    maternity: 0
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-lg sm-text-xl md:text-2xl font-bold mb-2">Your Medical Coverage</h2>
          <p className="text-primary-100 text-sm sm:text-base">
            View your plan details, benefits, and coverage utilization
          </p>
          {userSubscription.frequency && (
            <div className="mt-4 flex items-center text-xs sm:text-sm text-primary-100">
              <TbCalendarTime className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>
                Payment Plan: <span className="font-medium capitalize text-secondary-400">{userSubscription.frequency}</span> 
                <button 
                  onClick={handleOpenFrequencyModal}
                  className="ml-2 underline hover:text-white transition-colors"
                >
                  Change
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-8 rounded-sm overflow-hidden border-r-2 dark:border-gray-700">
          {/* Coverage Utilization Card */}
          <CoverageUtilizationCard utilization={utilization} />

          {/* Benefits Card */}
          <BenefitsCard plan={userSubscription.plan} />
        </div>

        {/* Right column - 1/3 width on large screens */}
        <div className="space-y-8">
          {/* Plan Details Card */}
          <PlanDetailsCard 
            plan={userSubscription.plan} 
            coverage={coverage}
            frequency={userSubscription.frequency}
            handleOpenFrequencyModal={handleOpenFrequencyModal}
          />

          {/* Emergency Contacts Card */}
          <EmergencyContactsCard />
        </div>
      </div>

      {/* Bottom section - Claims and Coverage Limits */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coverage Limits Card - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <CoverageLimitsCard 
            coverageLimits={coverageLimits} 
            loading={limitsLoading} 
          />
        </div>
        
        {/* Claims History - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-amber-700 dark:text-white flex items-center">
                <TbFileInvoice className="mr-2 h-5 w-5 text-amber-600" />
                Claims History
              </h3>
              <Link 
                to="/claims/new" 
                className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Submit New Claim
              </Link>
            </div>
            
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
                claims={claims} 
                loading={claimsLoading} 
                coverageLimits={coverageLimits}
              />
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          to="/payments"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <TbShieldHalfFilled className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Change Coverage Plan
        </Link>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-primary-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <BiSupport className="mr-2 h-4 w-4 sm:h-5 sm:w-5"/>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default MedicalCoverTab;
