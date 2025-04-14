import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

import { getCoverageUtilization } from "../../services/subscriptionService";
import { useAuth } from "../../context/AuthContext";

const CoverageUtilization = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverageData, setCoverageData] = useState(null);

  useEffect(() => {
    fetchCoverageData();
  }, [user]);

  const fetchCoverageData = async () => {
    if (!user || !user.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getCoverageUtilization(user.id);

      if (response && response.data) {
        setCoverageData(response.data);
      } else {
        throw new Error("Failed to fetch coverage data");
      }
    } catch (error) {
      console.error("Error fetching coverage data:", error);
      setError(error.message || "Failed to fetch coverage data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="px-2 flex items-center mb-4">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Inpatient Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="flex justify-between mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>

          {/* Outpatient Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="flex justify-between mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>

          {/* Optical Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="flex justify-between mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>

          {/* Maternity Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="flex justify-between mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
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
          onClick={fetchCoverageData}
          className="mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Try Again
        </button>
      </div>
    );
  }


if (!coverageData || !coverageData.coverage || !coverageData.coverage.plan) {
  return (
    <div className="relative">
      {/* Skeleton Background with Reduced Opacity */}
      <div className="opacity-30 pointer-events-none">
        <div className="space-y-3">
          {/* Inpatient Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Inpatient</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">0%</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">used</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Used: KES 0</span>
              <span className="font-medium">Remaining: KES 0</span>
            </div>
          </div>

          {/* Outpatient Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-700 border border-emerald-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Outpatient</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">0%</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">used</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Used: KES 0</span>
              <span className="font-medium">Remaining: KES 0</span>
            </div>
          </div>

          {/* Optical Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-700 border border-indigo-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Optical</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">0%</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">used</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Used: KES 0</span>
              <span className="font-medium">Remaining: KES 0</span>
            </div>
          </div>

          {/* Maternity Skeleton */}
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-50 to-pink-50/50 dark:from-gray-800 dark:to-gray-700 border border-pink-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Maternity</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">0%</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">used</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Used: KES 0</span>
              <span className="font-medium">Remaining: KES 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Message with Subscribe Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gradient-to-r from-gray-50 via-gray-200/60 to-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center max-w-xs w-full dark:border-gray-700">
          <FiAlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="text-[0.8rem] sm:text-sm text-gray-700 dark:text-gray-300 mb-4">
            No coverage information available.
          </p>
          <Link
            to="/payments"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            Subscribe to a plan
          </Link>
        </div>
      </div>
    </div>
  );
}

  const { utilization } = coverageData;
  const { inpatient, outpatient, optical, maternity } = utilization;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressBackground = (percentage) => {
    if (percentage < 50) return "bg-green-100 dark:bg-green-900/30";
    if (percentage < 75) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {/* Inpatient */}
        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
              Inpatient
            </h4>
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getProgressBackground(
                  inpatient.percentage
                )}`}
              >
                {inpatient.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                used
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${getProgressColor(
                inpatient.percentage
              )}`}
              style={{ width: `${inpatient.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">
              Used: {formatCurrency(inpatient.used)}
            </span>
            <span className="font-medium">
              Remaining: {formatCurrency(inpatient.remaining)}
            </span>
          </div>
        </div>

        {/* Outpatient */}
        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-700 border border-emerald-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200">
              Outpatient
            </h4>
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getProgressBackground(
                  outpatient.percentage
                )}`}
              >
                {outpatient.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                used
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${getProgressColor(
                outpatient.percentage
              )}`}
              style={{ width: `${outpatient.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">
              Used: {formatCurrency(outpatient.used)}
            </span>
            <span className="font-medium">
              Remaining: {formatCurrency(outpatient.remaining)}
            </span>
          </div>
        </div>

        {/* Optical */}
        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-700 border border-indigo-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
              Optical
            </h4>
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getProgressBackground(
                  optical.percentage
                )}`}
              >
                {optical.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                used
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${getProgressColor(
                optical.percentage
              )}`}
              style={{ width: `${optical.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">
              Used: {formatCurrency(optical.used)}
            </span>
            <span className="font-medium">
              Remaining: {formatCurrency(optical.remaining)}
            </span>
          </div>
        </div>

        {/* Maternity */}
        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-50 to-pink-50/50 dark:from-gray-800 dark:to-gray-700 border border-pink-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="flex justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors duration-200">
              Maternity
            </h4>
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getProgressBackground(
                  maternity.percentage
                )}`}
              >
                {maternity.percentage}%
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                used
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${getProgressColor(
                maternity.percentage
              )}`}
              style={{ width: `${maternity.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">
              Used: {formatCurrency(maternity.used)}
            </span>
            <span className="font-medium">
              Remaining: {formatCurrency(maternity.remaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageUtilization;
