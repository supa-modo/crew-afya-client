import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiLoader, FiSearch } from 'react-icons/fi';
import { TbFileInvoice, TbSearch, TbArrowRight, TbUser, TbId, TbAlertCircle } from 'react-icons/tb';
import { PiCaretDown } from 'react-icons/pi';
import { createClaim, updateClaim } from '../../../services/claimsService';
import { getAllPlans } from '../../../services/planService';
import { getUserSubscription } from '../../../services/subscriptionService';
import { getAllUsers } from '../../../services/userService';
import ClaimTypeIcon from './ClaimTypeIcon';
import { FaSave } from 'react-icons/fa';

const ClaimForm = ({ claim, isEditing = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [coverageId, setCoverageId] = useState('');
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  
  const memberDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  
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

       // Fetch all users/members
const usersResponse = await getAllUsers();
if (usersResponse.success) {
  // Check if data is an array or has a users property
  const usersData = Array.isArray(usersResponse.data) 
    ? usersResponse.data 
    : (usersResponse.data.users || []);
  
  setMembers(usersData);
  setFilteredMembers(usersData);
}

        // If editing, fetch the member's subscription
        if (isEditing && claim?.userId) {
          const subscriptionResponse = await getUserSubscription(claim.userId);
          if (subscriptionResponse.success && subscriptionResponse.data) {
            setCoverageId(subscriptionResponse.data.id);
            setSelectedMember(subscriptionResponse.data.user);
          }
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load initial data. Please try again.');
      }
    };

    fetchData();
  }, [isEditing, claim]);

  // Filter members based on search term
  useEffect(() => {
    if (memberSearchTerm) {
      const filtered = members.filter((member) => {
        const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase();
        const membershipNumber = member.membershipNumber?.toLowerCase() || '';
        return fullName.includes(memberSearchTerm.toLowerCase()) || 
               membershipNumber.includes(memberSearchTerm.toLowerCase());
      });
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [memberSearchTerm, members]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target)) {
        setMemberDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleMemberSelect = async (member) => {
    const userId = member.id;
    setMemberDropdownOpen(false);
    setSelectedMember(member);
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
        } else {
          setError('Selected member has no active insurance coverage');
        }
      } catch (err) {
        console.error('Error fetching member subscription:', err);
        setError('Failed to fetch member subscription');
      }
    }
  };
  
  const handleClaimTypeSelect = (type) => {
    setTypeDropdownOpen(false);
    setFormData({
      ...formData,
      type
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.userId) {
        setError('Please select a member');
        setLoading(false);
        return;
      }

      if (!coverageId) {
        setError('Selected member has no active insurance coverage');
        setLoading(false);
        return;
      }

      const claimData = {
        ...formData,
        coverageId,
        // Ensure all required fields are present with the correct names
        userId: formData.userId,
        planId: formData.planId,
        type: formData.type,
        providerName: formData.providerName,
        providerLocation: formData.providerLocation,
        serviceDate: formData.serviceDate,
        amountClaimed: parseFloat(formData.amountClaimed) || 0,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes || ''
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
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-600 flex items-center">
          <TbFileInvoice className="mr-2 h-6 w-6 " />
          {isEditing ? `Edit Claim - ${claim.user.firstName} ${claim.user.lastName} (${claim.id})` : 'Create New Claim'}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEditing
            ? 'Update the claim information below'
            : 'Fill in the details to create a new medical claim'}
        </p>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <TbAlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Member selection (only for new claims) */}
          {!isEditing && (
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Member
              </label>
              <div className="relative" ref={memberDropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbUser className="h-5 w-5 text-gray-400 dark:text-gray-400" />
                </div>
                <div
                  className="relative text-sm text-gray-700 dark:text-gray-300 font-medium w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-1 focus-within:outline-none focus-within:border-admin-500 focus-within:ring-admin-500 dark:bg-gray-700 dark:focus-within:ring-admin-500 dark:focus-within:border-admin-500 transition-colors duration-200 cursor-pointer"
                  onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                >
                  {selectedMember ? (
                    <div>
                      <span>{selectedMember.firstName} {selectedMember.lastName}</span>
                      {selectedMember.membershipNumber && (
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Membership #: {selectedMember.membershipNumber}
                        </span>
                      )}
                    </div>
                  ) : (
                    "Select a member"
                  )}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <PiCaretDown className="h-5 w-5 text-gray-400 dark:text-gray-400" />
                  </div>
                </div>

                {memberDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <TbSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Search by name or membership #..."
                          value={memberSearchTerm}
                          onChange={(e) => setMemberSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <ul className="py-1">
                      {filteredMembers.map((member) => (
                        <li key={member.id}>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleMemberSelect(member)}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {member.firstName} {member.lastName}
                            </div>
                            {member.membershipNumber && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                                <TbId className="mr-1 h-4 w-4" />
                                {member.membershipNumber}
                              </div>
                            )}
                          </button>
                        </li>
                      ))}
                      {filteredMembers.length === 0 && (
                        <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          No members found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Claim type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Claim Type
            </label>
            <div className="relative" ref={typeDropdownRef}>
              <div
                className="relative text-sm text-gray-700 dark:text-gray-300 font-medium w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-1 focus-within:outline-none focus-within:border-admin-500 focus-within:ring-admin-500 dark:bg-gray-700 dark:focus-within:ring-admin-500 dark:focus-within:border-admin-500 transition-colors duration-200 cursor-pointer"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClaimTypeIcon type={formData.type} />
                </div>
                {claimTypes.find(type => type.id === formData.type)?.label || 'Select claim type'}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <PiCaretDown className="h-5 w-5 text-gray-400 dark:text-gray-400" />
                </div>
              </div>

              {typeDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {claimTypes.map((type) => (
                      <li key={type.id}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          onClick={() => handleClaimTypeSelect(type.id)}
                        >
                          <ClaimTypeIcon type={type.id} className="mr-2 h-5 w-5" />
                          <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Service date */}
          <div>
            <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Date
            </label>
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Provider name */}
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Provider Name
            </label>
            <input
              type="text"
              id="providerName"
              name="providerName"
              value={formData.providerName}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Nairobi Hospital"
            />
          </div>

          {/* Provider location */}
          <div>
            <label htmlFor="providerLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Provider Location
            </label>
            <input
              type="text"
              id="providerLocation"
              name="providerLocation"
              value={formData.providerLocation}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Nairobi, Kenya"
            />
          </div>

          

          {/* Amount claimed */}
          <div>
            <label htmlFor="amountClaimed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount Claimed (KES)
            </label>
            <div className="relative rounded-md shadow-sm">
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
                className="block w-full pl-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
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
            className="mt-1 px-4 py-3 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-1 focus:ring-admin-500 focus:border-admin-500 sm:text-sm bg-gray-50 dark:bg-gray-700 dark:text-white"
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
            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-1 focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
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
            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-admin-500 focus:border-admin-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Any additional notes or comments"
          />
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
                  <FaSave className="-ml-1 mr-2 h-4 w-4" />
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
