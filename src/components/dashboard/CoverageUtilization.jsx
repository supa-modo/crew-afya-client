import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiCalendar, FiClock } from "react-icons/fi";
import { TbCalendarDollar, TbShieldCheck } from "react-icons/tb";
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
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-400">
          No coverage information available.{" "}
          <Link
            to="/payments"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Subscribe to a plan
          </Link>
        </p>
      </div>
    );
  }

  const { coverage, utilization } = coverageData;
  const { plan } = coverage;
  const nextPayment = coverage.nextPaymentDate;
  const paymentFrequency = coverage.paymentFrequency;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      

      {/* Coverage Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Coverage Utilization
        </h3>

        <div className="space-y-4">
          {/* Inpatient */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Inpatient
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {utilization.inpatient.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  utilization.inpatient.percentage < 50
                    ? "bg-green-500"
                    : utilization.inpatient.percentage < 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${utilization.inpatient.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Used: {formatCurrency(utilization.inpatient.used)}</span>
              <span>Remaining: {formatCurrency(utilization.inpatient.remaining)}</span>
            </div>
          </div>

          {/* Outpatient */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Outpatient
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {utilization.outpatient.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  utilization.outpatient.percentage < 50
                    ? "bg-green-500"
                    : utilization.outpatient.percentage < 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${utilization.outpatient.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Used: {formatCurrency(utilization.outpatient.used)}</span>
              <span>Remaining: {formatCurrency(utilization.outpatient.remaining)}</span>
            </div>
          </div>

          {/* Optical */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Optical
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {utilization.optical.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  utilization.optical.percentage < 50
                    ? "bg-green-500"
                    : utilization.optical.percentage < 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${utilization.optical.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Used: {formatCurrency(utilization.optical.used)}</span>
              <span>Remaining: {formatCurrency(utilization.optical.remaining)}</span>
            </div>
          </div>

          {/* Maternity */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maternity
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {utilization.maternity.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  utilization.maternity.percentage < 50
                    ? "bg-green-500"
                    : utilization.maternity.percentage < 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${utilization.maternity.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Used: {formatCurrency(utilization.maternity.used)}</span>
              <span>Remaining: {formatCurrency(utilization.maternity.remaining)}</span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default CoverageUtilization;
