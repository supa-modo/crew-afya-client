import { apiGet, apiPost } from "./api";

/**
 * Fetch all payments with optional filtering and pagination
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise} Promise with payments data
 */
export const fetchAllPayments = async (params = {}) => {
  try {
    const response = await apiGet("/payments/admin", params);
    return response;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error.response?.data || { message: "Failed to fetch payments" };
  }
};

/**
 * Get payment statistics
 * @returns {Promise} Promise with payment statistics
 */
export const getPaymentStats = async () => {
  try {
    const response = await apiGet("/payments/admin/stats");
    return response;
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    throw (
      error.response?.data || { message: "Failed to fetch payment statistics" }
    );
  }
};

/**
 * Get payment details by ID
 * @param {string} paymentId - Payment ID
 * @returns {Promise} Promise with payment details
 */
export const getPaymentById = async (paymentId) => {
  try {
    const response = await apiGet(`/payments/admin/${paymentId}`);
    return response;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw (
      error.response?.data || { message: "Failed to fetch payment details" }
    );
  }
};

/**
 * Get payment audit trail
 * @param {string} paymentId - Payment ID
 * @returns {Promise} Promise with payment audit trail
 */
export const getPaymentAuditTrail = async (paymentId) => {
  try {
    const response = await apiGet(`/payments/admin/${paymentId}/audit`);
    return response;
  } catch (error) {
    console.error("Error fetching payment audit trail:", error);
    throw (
      error.response?.data || { message: "Failed to fetch payment audit trail" }
    );
  }
};

/**
 * Generate and download payment receipt
 * @param {string} paymentId - Payment ID
 * @returns {Promise} Promise with receipt data or download URL
 */
export const generatePaymentReceipt = async (paymentId) => {
  try {
    const response = await apiGet(`/payments/admin/${paymentId}/receipt`);
    return response;
  } catch (error) {
    console.error("Error generating payment receipt:", error);
    throw (
      error.response?.data || { message: "Failed to generate payment receipt" }
    );
  }
};

/**
 * Export payments data in specified format
 * @param {string} format - Export format (csv, excel, pdf)
 * @param {Object} filters - Filters to apply to the export
 * @returns {Promise} Promise with export data or URL
 */
export const exportPaymentsData = async (format, filters = {}) => {
  try {
    const response = await apiPost(`/payments/admin/export/${format}`, filters);
    return response;
  } catch (error) {
    console.error(`Error exporting payments data as ${format}:`, error);
    throw (
      error.response?.data || {
        message: `Failed to export payments as ${format}`,
      }
    );
  }
};

export default {
  fetchAllPayments,
  getPaymentStats,
  getPaymentById,
  getPaymentAuditTrail,
  generatePaymentReceipt,
  exportPaymentsData,
};
