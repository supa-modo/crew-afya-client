import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first, then sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get all available insurance plans
 * @returns {Promise} Promise with plans data
 */
export const getInsurancePlans = async () => {
  try {
    const response = await api.get("/plans");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch plans" };
  }
};

/**
 * Get plan details by ID
 * @param {string} planId - Plan ID
 * @returns {Promise} Promise with plan details
 */
export const getPlanDetails = async (planId) => {
  try {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch plan details" };
  }
};

/**
 * Subscribe to an insurance plan
 * @param {object} subscriptionData - Subscription data
 * @returns {Promise} Promise with subscription details
 */
export const subscribeToPlan = async (subscriptionData) => {
  try {
    const response = await api.post("/plans/subscribe", subscriptionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to subscribe to plan" };
  }
};

/**
 * Update payment frequency
 * @param {string} coverageId - Coverage ID
 * @param {string} newFrequency - New payment frequency
 * @returns {Promise} Promise with updated schedule
 */
export const updatePaymentFrequency = async (coverageId, newFrequency) => {
  try {
    const response = await api.put("/plans/frequency", {
      coverageId,
      newFrequency,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update payment frequency",
      }
    );
  }
};

/**
 * Get user's coverage details with utilization
 * @returns {Promise} Promise with coverage details
 */
export const getCoverageDetails = async () => {
  try {
    const response = await api.get("/plans/coverage/details");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch coverage details",
      }
    );
  }
};

/**
 * Check if user has active coverage
 * @returns {Promise} Promise with coverage status
 */
export const checkCoverageStatus = async () => {
  try {
    const response = await api.get("/plans/coverage/status");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to check coverage status",
      }
    );
  }
};

/**
 * Get user's claims with pagination and filtering
 * @param {object} options - Query options
 * @returns {Promise} Promise with claims data
 */
export const getUserClaims = async (options = {}) => {
  try {
    const response = await api.get("/claims", { params: options });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch claims" };
  }
};

/**
 * Get claim details
 * @param {string} claimId - Claim ID
 * @returns {Promise} Promise with claim details
 */
export const getClaimDetails = async (claimId) => {
  try {
    const response = await api.get(`/claims/${claimId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch claim details" };
  }
};

/**
 * Get remaining benefit limits
 * @param {string} coverageId - Coverage ID
 * @param {string} type - Benefit type
 * @returns {Promise} Promise with remaining limit
 */
export const getRemainingLimit = async (coverageId, type) => {
  try {
    const response = await api.get(`/claims/coverage/${coverageId}/limits`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch remaining limit",
      }
    );
  }
};

export default {
  getInsurancePlans,
  getPlanDetails,
  subscribeToPlan,
  updatePaymentFrequency,
  getCoverageDetails,
  checkCoverageStatus,
  getUserClaims,
  getClaimDetails,
  getRemainingLimit,
};
