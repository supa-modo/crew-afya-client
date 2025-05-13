import { apiGet, apiPost, apiPut, apiDelete } from "./api";

/**
 * Get admin dashboard statistics
 * @returns {Promise} Promise object with dashboard statistics
 */
export const getAdminDashboardStats = async () => {
  return apiGet("/admin/dashboard/stats");
};

/**
 * Get all users with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @param {string} params.search - Search term
 * @param {string} params.sortBy - Field to sort by
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise} Promise object with users data
 */
export const getUsers = async (params = {}) => {
  return apiGet("/admin/users", params);
};

/**
 * Get user details by ID
 * @param {string} userId - User ID
 * @returns {Promise} Promise object with user details
 */
export const getUserById = async (userId) => {
  return apiGet(`/admin/users/${userId}`);
};

/**
 * Update user details
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} Promise object with updated user data
 */
export const updateUser = async (userId, userData) => {
  return apiPut(`/admin/users/${userId}`, userData);
};

/**
 * Activate or deactivate a user
 * @param {string} userId - User ID
 * @param {boolean} isActive - Whether to activate or deactivate
 * @returns {Promise} Promise object with updated user status
 */
export const toggleUserStatus = async (userId, isActive) => {
  return apiPut(`/admin/users/${userId}/status`, { isActive });
};

/**
 * Get payment analytics data
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date for analytics
 * @param {string} params.endDate - End date for analytics
 * @param {string} params.groupBy - Group by (day, week, month)
 * @returns {Promise} Promise object with payment analytics data
 */
export const getPaymentAnalytics = async (params = {}) => {
  return apiGet("/admin/analytics/payments", params);
};

/**
 * Get insurance coverage analytics
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise object with insurance analytics data
 */
export const getInsuranceAnalytics = async (params = {}) => {
  return apiGet("/admin/analytics/insurance", params);
};

/**
 * Get system health metrics
 * @returns {Promise} Promise object with system health data
 */
export const getSystemHealth = async () => {
  return apiGet("/admin/system/health");
};

/**
 * Get system logs
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @param {string} params.level - Log level (error, warn, info)
 * @param {string} params.startDate - Start date for logs
 * @param {string} params.endDate - End date for logs
 * @returns {Promise} Promise object with system logs
 */
export const getSystemLogs = async (params = {}) => {
  return apiGet("/admin/system/logs", params);
};

/**
 * Generate a report
 * @param {string} reportType - Type of report
 * @param {Object} params - Report parameters
 * @returns {Promise} Promise object with report data
 */
export const generateReport = async (reportType, params = {}) => {
  return apiPost(`/admin/reports/${reportType}`, params);
};

/**
 * Download a report
 * @param {string} reportId - Report ID
 * @returns {Promise} Promise object with report download URL
 */
export const downloadReport = async (reportId) => {
  return apiGet(`/admin/reports/${reportId}/download`);
};

/**
 * Get all payment transactions with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise object with transactions data
 */
export const getTransactions = async (params = {}) => {
  return apiGet("/admin/transactions", params);
};

/**
 * Get transaction details by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise} Promise object with transaction details
 */
export const getTransactionById = async (transactionId) => {
  return apiGet(`/admin/transactions/${transactionId}`);
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} status - New status
 * @returns {Promise} Promise object with updated transaction
 */
export const updateTransactionStatus = async (transactionId, status) => {
  return apiPut(`/admin/transactions/${transactionId}/status`, { status });
};

/**
 * Change user password by admin
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise} Promise with success message
 */
export const changeUserPasswordByAdmin = async (userId, newPassword) => {
  return apiPut(`/users/admin/change-password`, {userId, newPassword });
};
