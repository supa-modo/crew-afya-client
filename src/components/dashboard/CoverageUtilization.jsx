import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import insuranceService from "../../services/insuranceService";
import { FiAlertCircle, FiCalendar, FiClock } from "react-icons/fi";
import { TbCalendarDollar, TbShieldCheck } from "react-icons/tb";

const CoverageUtilization = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverageDetails, setCoverageDetails] = useState(null);

  useEffect(() => {
    fetchCoverageDetails();
  }, []);

  const fetchCoverageDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await insuranceService.getCoverageDetails();
      setCoverageDetails(details);
    } catch (error) {
      setError(error.message || "Failed to fetch coverage details");
      console.error("Error fetching coverage details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 bg-gray-200 rounded w-1/3"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="flex justify-between">
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <FiAlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchCoverageDetails}
          className="mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (
    !coverageDetails ||
    !coverageDetails.coverage ||
    !coverageDetails.coverage.plan
  ) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-400">
          No coverage information available.{" "}
          <Link
            to="/plans"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Subscribe to a plan
          </Link>
        </p>
      </div>
    );
  }

  const { coverage, utilization, nextPayment, paymentFrequency } =
    coverageDetails;

  return (
    <div className="space-y-6">
      {/* Plan Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <TbShieldCheck className="h-5 w-5 text-primary-500 mr-2" />
              {coverage.plan?.name || "Unknown Plan"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {coverage.plan?.description || "No description available"}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Active
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Coverage Period
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(coverage.startDate).toLocaleDateString()} -{" "}
                {new Date(coverage.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <TbCalendarDollar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Payment Frequency
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {paymentFrequency || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FiClock className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Next Payment
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {nextPayment
                  ? new Date(nextPayment).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Utilization */}
      {utilization && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Benefits Utilization
          </h3>
          <div className="space-y-4">
            {Object.entries(utilization).map(([benefit, data]) => {
              const { used, total, percentage } = data;
              return (
                <div key={benefit}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {benefit}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage.toFixed(1)}% Used
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        percentage > 75
                          ? "bg-red-600"
                          : percentage > 50
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>KES {used.toLocaleString()} used</span>
                    <span>KES {total.toLocaleString()} limit</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/claims"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          View Claims History
        </Link>
        <Link
          to="/plans"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Manage Plan
        </Link>
      </div>
    </div>
  );
};

export default CoverageUtilization;
