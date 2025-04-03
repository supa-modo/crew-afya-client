import React from "react";
import { TbChartBar } from "react-icons/tb";

/**
 * Component for displaying coverage utilization with progress bars
 */
const CoverageUtilizationCard = ({ utilization }) => {
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

  return (
    <div className=" rounded-sm overflow-hidden ">
      <div className=" px-4">
        <h3 className="text-amber-700 dark:text-amber-600 font-semibold flex items-center">
          <TbChartBar className="mr-2 h-5 w-5" />
          Medical Coverage Utilization
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {/* Inpatient */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Inpatient
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {inpatient.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                inpatient.percentage
              )}`}
              style={{ width: `${inpatient.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Used: {formatCurrency(inpatient.used)}</span>
            <span>Remaining: {formatCurrency(inpatient.remaining)}</span>
          </div>
        </div>

        {/* Outpatient */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Outpatient
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {outpatient.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                outpatient.percentage
              )}`}
              style={{ width: `${outpatient.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Used: {formatCurrency(outpatient.used)}</span>
            <span>Remaining: {formatCurrency(outpatient.remaining)}</span>
          </div>
        </div>

        {/* Optical */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Optical
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {optical.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                optical.percentage
              )}`}
              style={{ width: `${optical.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Used: {formatCurrency(optical.used)}</span>
            <span>Remaining: {formatCurrency(optical.remaining)}</span>
          </div>
        </div>

        {/* Maternity */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Maternity
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {maternity.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                maternity.percentage
              )}`}
              style={{ width: `${maternity.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Used: {formatCurrency(maternity.used)}</span>
            <span>Remaining: {formatCurrency(maternity.remaining)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageUtilizationCard;
