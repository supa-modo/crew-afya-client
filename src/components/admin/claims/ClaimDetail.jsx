import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiDownload, FiChevronLeft, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { TbFileInvoice, TbClock, TbUser, TbCalendar, TbCurrencyDollar, TbNotes, TbBuildingHospital, TbStethoscope } from 'react-icons/tb';
import ClaimStatusBadge from './ClaimStatusBadge';
import ClaimTypeIcon from './ClaimTypeIcon';
import { updateClaimStatus } from '../../../services/claimsService';

const ClaimDetail = ({ claim, onDelete, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    amountApproved: 0,
    notes: ''
  });
  const [error, setError] = useState(null);

  if (!claim) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleStatusChange = (e) => {
    setStatusUpdateData({
      ...statusUpdateData,
      status: e.target.value
    });
  };

  const handleAmountChange = (e) => {
    setStatusUpdateData({
      ...statusUpdateData,
      amountApproved: parseFloat(e.target.value) || 0
    });
  };

  const handleNotesChange = (e) => {
    setStatusUpdateData({
      ...statusUpdateData,
      notes: e.target.value
    });
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdateData.status) {
      setError('Please select a status');
      return;
    }

    if (statusUpdateData.status === 'approved' && statusUpdateData.amountApproved <= 0) {
      setError('Please enter an approved amount greater than zero');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await updateClaimStatus(
        claim.id,
        statusUpdateData.status,
        statusUpdateData.amountApproved,
        statusUpdateData.notes
      );

      if (response.success) {
        onStatusUpdate(response.data);
        setStatusUpdateData({
          status: '',
          amountApproved: 0,
          notes: ''
        });
      } else {
        setError(response.message || 'Failed to update claim status');
      }
    } catch (err) {
      console.error('Error updating claim status:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <TbFileInvoice className="mr-2 h-6 w-6 text-admin-600" />
            Claim Details
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Claim ID: {claim.id.substring(0, 8)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/admin/claims/${claim.id}/edit`}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
          >
            <FiEdit className="mr-1.5 h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={() => onDelete(claim.id)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FiTrash2 className="mr-1.5 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Status and type */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center mb-2 sm:mb-0">
            <ClaimTypeIcon type={claim.type} className="mr-2 h-6 w-6" />
            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {claim.type} Claim
            </span>
          </div>
          <ClaimStatusBadge status={claim.status} />
        </div>

        {/* Claim details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member info */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
              <TbUser className="mr-1.5 h-5 w-5" />
              Member Information
            </h4>
            <div className="text-sm text-gray-900 dark:text-white">
              <p className="font-medium">{claim.user?.firstName} {claim.user?.lastName}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{claim.user?.email}</p>
              <p className="text-gray-500 dark:text-gray-400">{claim.user?.phoneNumber}</p>
            </div>
          </div>

          {/* Provider info */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
              <TbBuildingHospital className="mr-1.5 h-5 w-5" />
              Provider Information
            </h4>
            <div className="text-sm text-gray-900 dark:text-white">
              <p className="font-medium">{claim.providerName}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{claim.providerLocation}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
              <TbCalendar className="mr-1.5 h-5 w-5" />
              Dates
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Service Date:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(claim.serviceDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Submission Date:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(claim.submissionDate)}</span>
              </div>
              {claim.processedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Processed Date:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(claim.processedDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amounts */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
              <TbCurrencyDollar className="mr-1.5 h-5 w-5" />
              Financial Details
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount Claimed:</span>
                <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(claim.amountClaimed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount Approved:</span>
                <span className={`font-medium ${claim.amountApproved > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {formatCurrency(claim.amountApproved)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical details */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
              <TbStethoscope className="mr-1.5 h-5 w-5" />
              Medical Details
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis</h5>
                <p className="text-gray-900 dark:text-white whitespace-pre-line">{claim.diagnosis}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Treatment</h5>
                <p className="text-gray-900 dark:text-white whitespace-pre-line">{claim.treatment}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {claim.notes && (
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <TbNotes className="mr-1.5 h-5 w-5" />
                Additional Notes
              </h4>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line">{claim.notes}</p>
            </div>
          )}

          {/* Documents */}
          {claim.documents && claim.documents.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <TbFileInvoice className="mr-1.5 h-5 w-5" />
                Supporting Documents
              </h4>
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {claim.documents.map((doc, index) => (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-900 dark:text-white">{doc}</span>
                    <button
                      type="button"
                      className="text-admin-600 hover:text-admin-900 dark:text-admin-400 dark:hover:text-admin-300"
                    >
                      <FiDownload className="h-5 w-5" />
                      <span className="sr-only">Download</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Status update section */}
        {claim.status === 'pending' && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <TbClock className="mr-2 h-5 w-5 text-admin-600" />
              Update Claim Status
            </h4>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={statusUpdateData.status}
                  onChange={handleStatusChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select status</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="processing">Processing</option>
                </select>
              </div>

              {statusUpdateData.status === 'approved' && (
                <div>
                  <label htmlFor="amountApproved" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Approved Amount (KES)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
                    </div>
                    <input
                      type="number"
                      id="amountApproved"
                      name="amountApproved"
                      value={statusUpdateData.amountApproved}
                      onChange={handleAmountChange}
                      min="0"
                      step="0.01"
                      className="block w-full pl-12 border-gray-300 dark:border-gray-600 rounded-md focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div className={statusUpdateData.status === 'approved' ? 'md:col-span-3' : 'md:col-span-2'}>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={statusUpdateData.notes}
                  onChange={handleNotesChange}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="Add notes about this status update"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdating || !statusUpdateData.status}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  <>
                    {statusUpdateData.status === 'approved' ? (
                      <FiCheck className="-ml-1 mr-2 h-4 w-4" />
                    ) : statusUpdateData.status === 'rejected' ? (
                      <FiX className="-ml-1 mr-2 h-4 w-4" />
                    ) : (
                      <FiCheck className="-ml-1 mr-2 h-4 w-4" />
                    )}
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <Link
            to="/admin/claims"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
          >
            <FiChevronLeft className="-ml-1 mr-2 h-4 w-4" />
            Back to Claims
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
