import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import AdminLayout from '../../components/admin/adminLayout/AdminLayout';
import ClaimForm from '../../components/admin/claims/ClaimForm';
import { getClaimById } from '../../services/claimsService';

const ClaimFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        setLoading(true);
        const response = await getClaimById(id);
        
        if (response.success) {
          setClaim(response.data);
        } else {
          setError(response.message || 'Failed to fetch claim details');
        }
      } catch (err) {
        console.error('Error fetching claim details:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClaimDetails();
    }
  }, [id]);

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Claim' : 'Create New Claim'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing 
              ? 'Update the claim information below'
              : 'Fill in the details to create a new medical claim'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="h-8 w-8 text-admin-600 animate-spin" />
            <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">Loading claim details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ClaimForm claim={claim} isEditing={isEditing} />
        )}
      </div>
  );
};

export default ClaimFormPage;
