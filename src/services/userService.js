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
 * Get user profile
 * @returns {Promise} Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - User profile data to update
 * @returns {Promise} Promise with updated user profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Promise with success message
 */
export const changeUserPassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to change password" };
  }
};

/**
 * Request phone number verification
 * @param {string} phoneNumber - Phone number to verify
 * @returns {Promise} Promise with verification code (in development) or success message
 */
export const requestPhoneVerification = async (phoneNumber) => {
  try {
    const response = await api.post("/users/request-phone-verification", {
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to request verification" };
  }
};

/**
 * Verify phone number with code
 * @param {string} phoneNumber - Phone number to verify
 * @param {string} verificationCode - Verification code
 * @returns {Promise} Promise with updated user profile data
 */
export const verifyPhoneNumber = async (phoneNumber, verificationCode) => {
  try {
    const response = await api.post("/users/verify-phone", {
      phoneNumber,
      verificationCode,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to verify phone number" };
  }
};

/**
 * Get all users with pagination and filtering options
 * @param {Object} params - Query parameters for filtering, sorting, and pagination
 * @returns {Promise} Promise with users data
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get("/users", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise} Promise with user data
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise} Promise with created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    // Extract the specific error message from the API response
    if (error.response && error.response.data) {
      // If there's a message in the response data, use it
      if (error.response.data.message) {
        throw {
          message: error.response.data.message,
          status: error.response.status,
          data: error.response.data,
        };
      } else if (typeof error.response.data === "string") {
        // Sometimes the error might be a string
        throw { message: error.response.data };
      }
    }
    // Fallback to a more generic message if we can't extract one
    throw { message: "Failed to create user. Please try again." };
  }
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise with updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user" };
  }
};

/**
 * Toggle user status (active/inactive)
 * @param {string} id - User ID
 * @param {boolean} active - Whether to set the user as active
 * @returns {Promise} Promise with updated user data
 */
export const toggleUserStatus = async (id, active) => {
  try {
    const response = await api.patch(`/users/${id}/status`, {
      isActive: active,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user status" };
  }
};

/**
 * Add insurance plan to user (admin)
 * @param {string} id - User ID
 * @param {Object} insuranceData - Insurance data (planId, paymentFrequency)
 * @returns {Promise} Promise with insurance coverage data
 */
export const addUserInsurance = async (id, insuranceData) => {
  try {
    const response = await api.post(`/users/${id}/insurance`, insuranceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add insurance" };
  }
};

/**
 * Update user insurance plan (admin)
 * @param {string} userId - User ID
 * @param {string} insuranceId - Insurance coverage ID
 * @param {Object} insuranceData - Updated insurance data
 * @returns {Promise} Promise with updated insurance coverage data
 */
export const updateUserInsurance = async (
  userId,
  insuranceId,
  insuranceData
) => {
  try {
    const response = await api.put(
      `/users/${userId}/insurance/${insuranceId}`,
      insuranceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update insurance" };
  }
};

/**
 * Get all plans
 * @returns {Promise} Promise with plans data
 */
export const getAllPlans = async () => {
  try {
    const response = await api.get("/plans");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch plans" };
  }
};

/**
 * Get plan by ID
 * @param {string} id - Plan ID
 * @returns {Promise} Promise with plan data
 */
export const getPlanById = async (id) => {
  try {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch plan" };
  }
};

/**
 * Initialize default plans (admin)
 * @returns {Promise} Promise with success message
 */
export const initializeDefaultPlans = async () => {
  try {
    const response = await api.post("/plans/init");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to initialize plans" };
  }
};
