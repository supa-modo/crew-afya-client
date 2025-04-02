import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiLoader } from 'react-icons/fi';
import { TbFileInvoice } from 'react-icons/tb';
import { createClaim, updateClaim } from '../../../services/claimsService';
import { getAllPlans } from '../../../services/planService';
import { getUserSubscription } from '../../../services/subscriptionService';
import ClaimTypeIcon from './ClaimTypeIcon';

const ClaimForm = ({ claim, isEditing = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [coverageId, setCoverageId] = useState('');
  const [formData, setFormData] = useState({
    userId: claim?.userId || '',
    planId: claim?.planId || '',
    type: claim?.type || 'outpatient',
    providerName: claim?.providerName || '',
    providerLocation: claim?.providerLocation || '',
    serviceDate: claim?.serviceDate ? new Date(claim.serviceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    amountClaimed: claim?.amountClaimed || 0,
    diagnosis: claim?.diagnosis || '',
    treatment: claim?.treatment || '',
    notes: claim?.notes || '',
    documents: claim?.documents || []
  });

  // Fetch plans and members on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const plansResponse = await getAllPlans();
        if (plansResponse.success) {
          setPlans(plansResponse.data);
        }

        // If editing, fetch the member's subscription
        if (isEditing && claim?.userId) {
          const subscriptionResponse = await getUserSubscription(claim.userId);
          if (subscriptionResponse.success && subscriptionResponse.data) {
            setCoverageId(subscriptionResponse.data.id);
          }
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load initial data. Please try again.');
      }
    };

    fetchData();
  }, [isEditing, claim]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'amountClaimed') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleMemberChange = async (e) => {
    const userId = e.target.value;
    setFormData({
      ...formData,
      userId
    });

    if (userId) {
      try {
        // Fetch member's subscription to get coverage ID and plan ID
        const response = await getUserSubscription(userId);
        if (response.success && response.data) {
          setCoverageId(response.data.id);
          setFormData(prev => ({
            ...prev,
            planId: response.data.plan.id
          }));
          setSelectedMember(response.data.user);
        } else {
          setError('Selected member has no active insurance coverage');
        }
      } catch (err) {
        console.error('Error fetching member subscription:', err);
        setError('Failed to fetch member subscription');
      }
    }
  };

  const handleFileUpload = (e) => {
    // In a real app, this would upload files to a server
    // For now, we'll just store the file names
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    
    setFormData({
      ...formData,
      documents: [...formData.documents, ...fileNames]
    });
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    
    setFormData({
      ...formData,
      documents: updatedDocuments
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const claimData = {
        ...formData,
        coverageId
      };

      let response;
      if (isEditing) {
        response = await updateClaim(claim.id, claimData);
      } else {
        response = await createClaim(claimData);
      }

      if (response.success) {
        navigate('/admin/claims');
      } else {
        setError(response.message || 'Failed to save claim');
      }
    } catch (err) {
      console.error('Error saving claim:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const claimTypes = [
    { id: 'inpatient', label: 'Inpatient' },
    { id: 'outpatient', label: 'Outpatient' },
    { id: 'maternity', label: 'Maternity' },
    { id: 'optical', label: 'Optical' },
    { id: 'dental', label: 'Dental' },
    { id: 'accident', label: 'Accident' },
    { id: 'emergency', label: 'Emergency' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <TbFileInvoice className="mr-2 h-6 w-6 text-admin-600" />
          {isEditing ? 'Edit Claim' : 'Create New Claim'}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEditing
            ? 'Update the claim information below'
            : 'Fill in the details to create a new medical claim'}
        </p>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member selection (only for new claims) */}
          {!isEditing && (
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Member
              </label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleMemberChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Claim type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Claim Type
            </label>
            <div className="mt-1 relative">
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-admin-500 focus:border-admin-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {claimTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ClaimTypeIcon type={formData.type} />
              </div>
            </div>
          </div>

          {/* Provider name */}
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Provider Name
            </label>
            <input
              type="text"
              id="providerName"
              name="providerName"
              value={formData.providerName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Nairobi Hospital"
            />
          </div>

          {/* Provider location */}
          <div>
            <label htmlFor="providerLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Provider Location
            </label>
            <input
              type="text"
              id="providerLocation"
              name="providerLocation"
              value={formData.providerLocation}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Nairobi, Kenya"
            />
          </div>

          {/* Service date */}
          <div>
            <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Service Date
            </label>
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Amount claimed */}
          <div>
            <label htmlFor="amountClaimed" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount Claimed (KES)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
              </div>
              <input
                type="number"
                id="amountClaimed"
                name="amountClaimed"
                value={formData.amountClaimed}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="block w-full pl-12 border-gray-300 dark:border-gray-600 rounded-md focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Diagnosis
          </label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            rows={3}
            value={formData.diagnosis}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Describe the diagnosis"
          />
        </div>

        {/* Treatment */}
        <div>
          <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Treatment
          </label>
          <textarea
            id="treatment"
            name="treatment"
            rows={3}
            value={formData.treatment}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Describe the treatment provided"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Any additional notes or comments"
          />
        </div>

        {/* Document upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supporting Documents
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-admin-600 hover:text-admin-500 dark:text-admin-400 dark:hover:text-admin-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-admin-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, PDF up to 10MB each
              </p>
            </div>
          </div>

          {/* Document list */}
          {formData.documents.length > 0 && (
            <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
              {formData.documents.map((doc, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FiX className="h-5 w-5" />
                    <span className="sr-only">Remove</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form actions */}
        <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/claims')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="-ml-1 mr-2 h-4 w-4" />
                  {isEditing ? 'Update Claim' : 'Create Claim'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;
