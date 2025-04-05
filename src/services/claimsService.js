import api from './api';

/**
 * Get all claims with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise} Promise with claims data
 */
export const getAllClaims = async (options = {}) => {
  try {
    const { page = 1, limit = 10, type, status, startDate, endDate } = options;
    
    // Build query params
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await api.get(`/claims?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch claims',
      data: { claims: [], total: 0 }
    };
  }
};

/**
 * Get claim details by ID
 * @param {string} claimId - Claim ID
 * @returns {Promise} Promise with claim data
 */
export const getClaimById = async (claimId) => {
  try {
    const response = await api.get(`/claims/${claimId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching claim ${claimId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch claim details'
    };
  }
};

/**
 * Create a new claim
 * @param {Object} claimData - Claim data
 * @returns {Promise} Promise with created claim data
 */
export const createClaim = async (claimData) => {
  try {
    const response = await api.post('/claims', claimData);
    return response.data;
  } catch (error) {
    console.error('Error creating claim:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create claim'
    };
  }
};

/**
 * Update claim details
 * @param {string} claimId - Claim ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Promise with updated claim data
 */
export const updateClaim = async (claimId, updateData) => {
  try {
    const response = await api.put(`/claims/${claimId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating claim ${claimId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update claim'
    };
  }
};

/**
 * Update claim status
 * @param {string} claimId - Claim ID
 * @param {string} status - New status
 * @param {number} amountApproved - Approved amount (for approved claims)
 * @param {string} notes - Notes about the status change
 * @returns {Promise} Promise with updated claim data
 */
export const updateClaimStatus = async (claimId, status, amountApproved, notes) => {
  try {
    const response = await api.put(`/claims/${claimId}/status`, {
      status,
      amountApproved,
      notes
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating claim status ${claimId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update claim status'
    };
  }
};

/**
 * Delete a claim
 * @param {string} claimId - Claim ID
 * @returns {Promise} Promise with success message
 */
export const deleteClaim = async (claimId) => {
  try {
    const response = await api.delete(`/claims/${claimId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting claim ${claimId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete claim'
    };
  }
};

/**
 * Get claims for a specific user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise} Promise with user claims data
 */
export const getUserClaims = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 10, status } = options;
    
    // Build query params
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    
    const response = await api.get(`/claims/user/${userId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching claims for user ${userId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user claims',
      data: { claims: [], total: 0 }
    };
  }
};

/**
 * Get remaining coverage limits for a user
 * @param {string} userId - User ID
 * @returns {Promise} Promise with coverage limits data
 */
export const getCoverageLimits = async (userId) => {
  try {
    const response = await api.get(`/claims/coverage/${userId}/limits`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching coverage limits for user ${userId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch coverage limits'
    };
  }
};

export default {
  getAllClaims,
  getClaimById,
  createClaim,
  updateClaim,
  updateClaimStatus,
  deleteClaim,
  getUserClaims,
  getCoverageLimits
};
