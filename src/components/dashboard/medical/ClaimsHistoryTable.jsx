import React, { useState, useEffect } from "react";
import { FiEye, FiFileText, FiLoader } from "react-icons/fi";
import {
  TbFileInvoice,
  TbCalendarTime,
  TbCurrencyDollar,
  TbAlertCircle,
} from "react-icons/tb";
import { Link } from "react-router-dom";
import ClaimStatusBadge from "../../admin/claims/ClaimStatusBadge";
import ClaimTypeIcon from "../../admin/claims/ClaimTypeIcon";
import { getUserClaims } from "../../../services/claimsService";
import { formatDate } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";

const ClaimsHistoryTable = ({
  userId,
  loading: externalLoading,
  coverageLimits,
}) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      if (!userId) {
        console.error("No userId provided to ClaimsHistoryTable");
        return;
      }

      setLoading(true);
      try {
        const response = await getUserClaims(userId);
        if (response.success) {
          setClaims(response.data.claims || []);
        } else {
          setError(response.message || "Failed to fetch claims");
          console.error("Failed to fetch claims:", response.message);
        }
      } catch (err) {
        console.error("Error fetching claims:", err);
        setError("An error occurred while fetching claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Loading claims...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <TbAlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-[0.83rem] sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
        <TbFileInvoice className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-[0.9rem] sm:text-base md:text-lg   font-medium text-gray-700 dark:text-gray-300 mb-2">
          No Claims History
        </h3>
        <p className="text-center text-[0.8rem] sm:text-sm">
          Once your medical claims are recorded, they will appear here.
        </p>
        <p className="mt-2 text-center text-xs text-primary-600 dark:text-primary-400">
          Need to make a claim? Contact our support team for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
                className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
                className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Provider
            </th>
            <th
              scope="col"
                className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
                className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
                className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
                className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {claims.map((claim) => (
            <tr
              key={claim.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <ClaimTypeIcon type={claim.type} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {claim.type?.toLowerCase()}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {claim.providerName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {claim.providerLocation}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TbCalendarTime className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {formatDate(claim.serviceDate)}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white flex items-center">
                    <TbCurrencyDollar className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {formatCurrency(claim.amountClaimed)}
                </div>
                {claim.amountApproved > 0 && claim.status === "approved" && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Approved: {formatCurrency(claim.amountApproved)}
                  </div>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <ClaimStatusBadge status={claim.status} />
              </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-3">
                <Link
                  to={`/claims/${claim.id}`}
                      className="p-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  title="View Claim Details"
                >
                      <FiEye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
                {claim.receiptUrl && (
                  <a
                    href={claim.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    title="View Receipt"
                  >
                        <FiFileText className="h-4 w-4" />
                    <span className="sr-only">Receipt</span>
                  </a>
                )}
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ClaimsHistoryTable;
