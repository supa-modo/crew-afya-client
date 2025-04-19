import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TbCheck,
  TbLoader,
  TbAlertTriangle,
  TbArrowLeft,
  TbArrowRight,
  TbUsers,
  TbUser,
  TbExternalLink,
  TbHospital,
  TbStethoscope,
  TbEye,
  TbMoodSmile,
} from "react-icons/tb";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  PiCaretDownDuotone,
  PiCaretUpDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

const PlanList = ({
  loading,
  plans,
  selectedPlan,
  handleSelectPlan,
  planCategory,
  selectedFrequency,
  setSelectedFrequency,
  onViewDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [plansPerPage, setPlansPerPage] = useState(2);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [paginatedPlans, setPaginatedPlans] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Track window resize to adjust plans per page
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust plans per page based on screen size
  useEffect(() => {
    // Show only 1 plan per page on smaller screens (less than 768px)
    const newPlansPerPage = windowWidth < 768 ? 1 : 2;
    setPlansPerPage(newPlansPerPage);
  }, [windowWidth]);

  // Filter plans based on category
  useEffect(() => {
    if (plans.length > 0) {
      const filtered = plans.filter((plan) => {
        // Individual plans are plans with maxDependents = 0
        if (planCategory === "individual") {
          return plan.maxDependents === 0;
        }
        // Family plans are plans with maxDependents > 0
        return plan.maxDependents > 0;
      });
      setFilteredPlans(filtered);
      setCurrentPage(0); // Reset to first page when filtering changes
    }
  }, [plans, planCategory]);

  // Paginate the filtered plans
  useEffect(() => {
    if (filteredPlans.length > 0) {
      const totalPages = Math.ceil(filteredPlans.length / plansPerPage);
      setTotalPages(totalPages);

      // If we're on a page that no longer exists after filtering, reset to first page
      if (currentPage >= totalPages) {
        setCurrentPage(0);
      }

      // Get the plans for the current page
      const start = currentPage * plansPerPage;
      const end = Math.min(start + plansPerPage, filteredPlans.length);
      const slicedPlans = filteredPlans.slice(start, end);

      setPaginatedPlans(slicedPlans);
    } else {
      setPaginatedPlans([]);
    }
  }, [filteredPlans, currentPage, plansPerPage]);

  // Function to handle pagination
  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    }
  };

  // Function to get premium amount based on frequency
  const getFrequencyAmount = (plan, frequency) => {
    if (!plan) return 0;

    // Direct mapping from frequency to premium field name
    const premiumField = `${frequency}Premium`;
    if (plan[premiumField] !== undefined) {
      return plan[premiumField];
    }
    return 0;
  };

  // Function to handle view details click
  const handleViewDetails = (e, plan) => {
    e.stopPropagation(); // Prevent selection of the plan
    if (onViewDetails) {
      onViewDetails(plan);
    }
  };

  // Function to format coverage amount
  const formatCoverage = (amount) => {
    if (!amount || amount === 0) return "Not covered";
    return formatCurrency(amount);
  };

  // Helper to get dental limit with fallback values
  const getDentalLimit = (plan) => {
    if (plan.dentalLimit) return plan.dentalLimit;
    // Some plans might combine dental and optical or store it differently
    if (plan.opticalLimit) return plan.opticalLimit / 2;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <TbLoader className="h-10 w-10 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading available plans...
          </p>
        </div>
      </div>
    );
  }

  if (filteredPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <TbAlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No plans available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {planCategory === "individual"
            ? "There are no individual plans available at the moment."
            : "There are no family plans available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pagination Controls (show when there are multiple pages) */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => handlePageChange("prev")}
            className="p-2.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <TbArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
            {currentPage + 1} of {totalPages}
          </div>

          <button
            onClick={() => handlePageChange("next")}
            className="p-2.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <TbArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => handleSelectPlan(plan)}
            className={`group cursor-pointer border rounded-xl p-4 sm:p-5 ${
              selectedPlan?.id === plan.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-white">
                {plan.name}
              </h3>
              <div className="flex items-center">
                {plan.maxDependents > 0 && (
                  <span className="inline-flex items-center mr-2 px-2.5 py-0.5 sm:py-1 rounded-full text-[0.7rem] sm:text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 dark:text-blue-300">
                    <PiUsersDuotone className="mr-1 h-3.5 w-3.5" />
                    {plan.maxDependents}{" "}
                    {plan.maxDependents === 1 ? "Dependent" : "Dependents"}
                  </span>
                )}
                {selectedPlan?.id === plan.id && (
                  <div className="flex-shrink-0 bg-blue-200 dark:bg-primary-900/30 rounded-full p-1.5">
                    <TbCheck className="h-5 w-5 text-blue-700 dark:text-primary-400" />
                  </div>
                )}
              </div>
            </div>

            {plan.description && (
              <p className="text-[0.82rem] sm:text-sm text-gray-500 dark:text-gray-400 mb-5">
                {plan.description}
              </p>
            )}

            {/* Premium Display */}
            <div className="mb-2 sm:mb-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 rounded-xl border border-primary-200 dark:border-primary-800/30">
              <p className="text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                Premium
              </p>
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(getFrequencyAmount(plan, selectedFrequency))}
                </span>
                <span className="text-[0.8rem] sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                  /{selectedFrequency}
                </span>
              </div>

              <div className="relative mt-3">
                <select
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-3 pr-8 py-2 text-[0.83rem] sm:text-sm font-medium text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700  shadow-sm appearance-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
                <PiCaretDownDuotone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Coverage Limits */}
            <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-4">
              <div className="p-2 rounded-lg">
                <p className="text-[0.8rem] sm:text-xs text-gray-500 dark:text-gray-400">
                  Inpatient
                </p>
                <p className="text-sm sm:text-[0.9rem] font-semibold text-gray-700 dark:text-white">
                  {formatCoverage(plan.inpatientLimit)}
                </p>
              </div>

              <div className="p-2 rounded-lg">
                <p className="text-[0.8rem] sm:text-xs text-gray-500 dark:text-gray-400">
                  Outpatient
                </p>
                <p className="text-sm sm:text-[0.9rem] font-semibold text-gray-700 dark:text-white">
                  {formatCoverage(plan.outpatientLimit)}
                </p>
              </div>

              <div className="p-2 rounded-lg">
                <p className="text-[0.8rem] sm:text-xs text-gray-500 dark:text-gray-400">
                  Dental
                </p>
                <p className="text-sm sm:text-[0.9rem] font-semibold text-gray-700 dark:text-white">
                  {formatCoverage(getDentalLimit(plan))}
                </p>
              </div>

              <div className="p-2 rounded-lg">
                <p className="text-[0.8rem] sm:text-xs text-gray-500 dark:text-gray-400">
                  Optical
                </p>
                <p className="text-sm sm:text-[0.9rem] font-semibold text-gray-700 dark:text-white">
                  {formatCoverage(plan.opticalLimit)}
                </p>
              </div>
            </div>

            {/* View Full Details Button */}
            <button
              onClick={(e) => handleViewDetails(e, plan)}
              className="w-full py-2.5 px-4 mb-4 text-[0.8rem] sm:text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors flex items-center justify-center"
            >
              <TbExternalLink className="h-4 w-4 mr-1.5" />
              View Full Plan Details
            </button>

            {/* Select Plan Action */}
            <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan(plan);
                }}
                className={`py-2 px-5 flex items-center justify-center rounded-lg text-[0.8rem] sm:text-sm font-medium transition-all ${
                  selectedPlan?.id === plan.id
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
                }`}
              >
                <TbCheck className="h-4 w-4 mr-1.5" />
                {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlanList;
