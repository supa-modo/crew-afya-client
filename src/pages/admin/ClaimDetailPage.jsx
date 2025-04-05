import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import AdminLayout from '../../components/admin/adminLayout/AdminLayout';
import ClaimDetail from '../../components/admin/claims/ClaimDetail';
import { getClaimById, deleteClaim } from '../../services/claimsService';
import { TbAlertCircle, TbChevronRight, TbHome2 } from 'react-icons/tb';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ClaimDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteClaim(id);
      
      if (response.success) {
        navigate('/admin/claims', { 
          state: { 
            notification: {
              type: 'success',
              message: 'Claim deleted successfully'
            }
          }
        });
      } else {
        setError(response.message || 'Failed to delete claim');
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Error deleting claim:', err);
      setError('An unexpected error occurred. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = (updatedClaim) => {
    setClaim(updatedClaim);
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto ">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-admin-600 flex items-center"
                >
                  <TbHome2 className="h-5 w-5 mr-2" />
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <TbChevronRight className="w-4 h-4" />
                <Link to="/admin/claims" className="ml-2 hover:text-admin-600">
                  Medical Claims
                </Link>
              </li>
              <li className="flex items-center">
                <TbChevronRight className="w-4 h-4" />
                <span className="ml-2 text-admin-700 dark:text-gray-300 font-semibold">
                Claim - {id}
                </span>
              </li>
            </ol>
          </nav>
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
          <ClaimDetail 
            claim={claim} 
            onDelete={handleDeleteClick}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (


          <ConfirmationModal 
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteConfirm}
            type='error'
            title="Delete Claim"
            message="Are you sure you want to delete this claim? This action cannot be undone."
          />
      )}
    </>
  );
};

export default ClaimDetailPage;
