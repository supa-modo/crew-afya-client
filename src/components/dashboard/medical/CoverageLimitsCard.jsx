import React from 'react';
import { TbShieldCheck, TbCurrencyDollar } from 'react-icons/tb';

const CoverageLimitsCard = ({ coverageLimits, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-amber-700 dark:text-white mb-4 flex items-center">
          <TbShieldCheck className="mr-2 h-5 w-5 text-amber-600" />
          Coverage Limits
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!coverageLimits) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-amber-700 dark:text-white mb-4 flex items-center">
          <TbShieldCheck className="mr-2 h-5 w-5 text-amber-600" />
          Coverage Limits
        </h3>
        <p className="text-gray-500 dark:text-gray-400">No coverage information available.</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Calculate percentages for progress bars
  const calculatePercentage = (remaining, total) => {
    if (!total || total <= 0) return 0;
    const used = total - remaining;
    return Math.min(Math.round((used / total) * 100), 100);
  };

  const inpatientPercentage = calculatePercentage(
    coverageLimits.remainingInpatientLimit,
    coverageLimits.inpatientLimit || 200000
  );

  const outpatientPercentage = calculatePercentage(
    coverageLimits.remainingOutpatientLimit,
    coverageLimits.outpatientLimit || 20000
  );

  const opticalPercentage = calculatePercentage(
    coverageLimits.remainingOpticalLimit,
    coverageLimits.opticalLimit || 5000
  );

  const maternityPercentage = calculatePercentage(
    coverageLimits.remainingMaternityLimit,
    coverageLimits.maternityLimit || 20000
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-amber-700 dark:text-white mb-4 flex items-center">
        <TbShieldCheck className="mr-2 h-5 w-5 text-amber-600" />
        Coverage Limits
      </h3>
      
      <div className="space-y-4">
        {/* Inpatient */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inpatient</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <TbCurrencyDollar className="mr-1 h-4 w-4" />
              {formatCurrency(coverageLimits.remainingInpatientLimit)}
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                / {formatCurrency(coverageLimits.inpatientLimit || 200000)}
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                inpatientPercentage > 80 ? 'bg-red-500' : 
                inpatientPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${inpatientPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Outpatient */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Outpatient</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <TbCurrencyDollar className="mr-1 h-4 w-4" />
              {formatCurrency(coverageLimits.remainingOutpatientLimit)}
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                / {formatCurrency(coverageLimits.outpatientLimit || 20000)}
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                outpatientPercentage > 80 ? 'bg-red-500' : 
                outpatientPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${outpatientPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Optical */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Optical</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <TbCurrencyDollar className="mr-1 h-4 w-4" />
              {formatCurrency(coverageLimits.remainingOpticalLimit)}
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                / {formatCurrency(coverageLimits.opticalLimit || 5000)}
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                opticalPercentage > 80 ? 'bg-red-500' : 
                opticalPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${opticalPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Maternity */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maternity</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <TbCurrencyDollar className="mr-1 h-4 w-4" />
              {formatCurrency(coverageLimits.remainingMaternityLimit)}
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                / {formatCurrency(coverageLimits.maternityLimit || 20000)}
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                maternityPercentage > 80 ? 'bg-red-500' : 
                maternityPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${maternityPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          These are your remaining coverage limits. When a claim is approved, the amount is deducted from the appropriate limit.
        </p>
      </div>
    </div>
  );
};

export default CoverageLimitsCard;
