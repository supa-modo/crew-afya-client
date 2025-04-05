import React, { useState, useEffect } from 'react';
import { FiEye, FiFileText } from 'react-icons/fi';
import { TbFileInvoice, TbCalendarTime, TbCurrencyDollar } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import ClaimStatusBadge from '../../admin/claims/ClaimStatusBadge';
import ClaimTypeIcon from '../../admin/claims/ClaimTypeIcon';
import { getUserClaims } from '../../../services/claimsService';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

const ClaimsHistoryTable = ({ userId, loading: externalLoading, coverageLimits }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const response = await getUserClaims(userId);
        console.log(response)
        if (response.success) {
          setClaims(response.data.claims || []);
        } else {
          setError(response.message || 'Failed to fetch claims');
        }
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError('An error occurred while fetching claims');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaims();
  }, [userId]);
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <TbFileInvoice className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p>No claims history found.</p>
        <p className="mt-2 text-sm">
          Once your medical claims are recorded, they will appear here.
        </p>
      </div>
    );
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Provider
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {claims.map((claim) => (
            <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <ClaimTypeIcon type={claim.type} className="mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                    {claim.type}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {claim.providerName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {claim.providerLocation}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <TbCalendarTime className="mr-1 h-4 w-4 text-gray-400" />
                  {formatDate(claim.serviceDate)}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white flex items-center">
                  <TbCurrencyDollar className="mr-1 h-4 w-4 text-gray-400" />
                  {formatCurrency(claim.amountClaimed)}
                </div>
                {claim.amountApproved > 0 && claim.status === 'approved' && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Approved: {formatCurrency(claim.amountApproved)}
                  </div>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <ClaimStatusBadge status={claim.status} />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/admin/claims/${claim.id}`}
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                  title="View Claim Details"
                >
                  <FiEye className="h-5 w-5" />
                  <span className="sr-only">View</span>
                </Link>
                <button
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                  title="View Receipt"
                >
                  <FiFileText className="h-5 w-5" />
                  <span className="sr-only">Receipt</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimsHistoryTable;
