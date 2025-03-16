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