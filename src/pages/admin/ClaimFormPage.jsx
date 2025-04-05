import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import { TbAlertCircle, TbChevronRight, TbFileInvoice, TbHome2 } from 'react-icons/tb';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/adminLayout/AdminLayout';
import ClaimForm from '../../components/admin/claims/ClaimForm';
import { getClaimById } from '../../services/claimsService';

const ClaimFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
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
                <TbAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
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
