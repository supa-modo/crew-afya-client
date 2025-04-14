import React from "react";
import {
  TbChartBar,
  TbMedicalCross,
  TbHeartbeat,
  TbEye,
  TbBabyCarriage,
  TbGraph,
} from "react-icons/tb";

/**
 * Component for displaying coverage utilization with progress bars
 */
const CoverageUtilizationCard = ({ utilization, loading }) => {
  // If loading, show skeleton
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="px-2 flex items-center">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>

        <div className="py-5 space-y-3 sm:space-y-4">
          {/* Inpatient Skeleton */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between">
              <div className="flex items-center mb-3">
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="flex justify-between mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>

          {/* Outpatient Skeleton */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between">
              <div className="flex items-center mb-3">
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="flex justify-between mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>

          {/* Optical Skeleton */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between">
              <div className="flex items-center mb-3">
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
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

  if (!utilization) return null;

  const { inpatient, outpatient, optical, maternity } = utilization;

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
    if (percentage < 50) return "bg-green-200 dark:bg-green-900/30";
    if (percentage < 75) return "bg-yellow-200 dark:bg-yellow-900/30";
    return "bg-red-200 dark:bg-red-900/30";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "inpatient":
        return (
          <TbMedicalCross className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 dark:text-blue-400" />
        );
      case "outpatient":
        return (
          <TbHeartbeat className="h-5 sm:h-6 w-5 sm:w-6 text-emerald-600 dark:text-emerald-400" />
        );
      case "optical":
        return (
          <TbEye className="h-5 sm:h-6 w-5 sm:w-6 text-indigo-600 dark:text-indigo-400" />
        );
      case "maternity":
        return (
          <TbBabyCarriage className="h-5 sm:h-6 w-5 sm:w-6 text-pink-600 dark:text-pink-400" />
        );
      default:
        return (
          <TbChartBar className="h-5 sm:h-6 w-5 sm:w-6 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  return (
    <div className="">
      <div className="space-y-3">
        {/* Inpatient */}
        <div className="p-4 flex flex-row space-x-2 items-center rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="p-2 rounded-lg bg-blue-200 dark:bg-blue-900/30 mr-3">
            {getCategoryIcon("inpatient")}
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                  Inpatient
                </h4>
              </div>
              <div className="flex items-center">
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
        </div>

        {/* Outpatient */}
        <div className="p-4 flex flex-row space-x-2 items-center rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-700 border border-emerald-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="p-2 rounded-lg bg-emerald-200 dark:bg-emerald-900/30 mr-3">
            {getCategoryIcon("outpatient")}
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200">
                  Outpatient
                </h4>
              </div>
              <div className="flex items-center ">
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
        </div>

        {/* Optical */}
        <div className="p-4 flex flex-row space-x-2 items-center rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-700 border border-indigo-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="p-2 rounded-lg bg-indigo-200 dark:bg-indigo-900/30 mr-3">
            {getCategoryIcon("optical")}
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
                  Optical
                </h4>
              </div>
              <div className="flex items-center">
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
        </div>

        {/* Maternity */}
        <div className="p-4 flex flex-row space-x-2 items-center rounded-xl bg-gradient-to-r from-pink-50 to-pink-50/50 dark:from-gray-800 dark:to-gray-700 border border-pink-100 dark:border-gray-700 group hover:shadow-sm transition-all duration-300">
          <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 mr-3">
            {getCategoryIcon("maternity")}
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors duration-200">
                  Maternity
                </h4>
              </div>
              <div className="flex items-center">
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
    </div>
  );
};

export default CoverageUtilizationCard;
