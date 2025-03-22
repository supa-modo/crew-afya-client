import { apiGet, apiPost, apiPut } from "./api";
import axios from "axios";

// Mock payment data for development
const MOCK_PAYMENT_HISTORY = [
  {
    id: "pay_1",
    date: new Date(2023, 2, 15).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "MPESA123456",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_2",
    date: new Date(2023, 1, 15).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "MPESA789012",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_3",
    date: new Date(2023, 0, 15).toISOString(),
    amount: 500,
    method: "Card",
    reference: "CARD345678",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_4",
    date: new Date(2022, 11, 15).toISOString(),
    amount: 500,
    method: "Bank Transfer",
    reference: "BNK901234",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_5",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "",
    status: "pending",
    description: "Upcoming payment",
  },
  {
    id: "pay_6",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "",
    status: "pending",
    description: "Monthly Premium Payment",
  },
  {
    id: "pay_7",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "TLKOT123",
    status: "completed",
    description: "Monthly Premium Payment",
  },
  {
    id: "pay_8",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "TLKOT123",
    status: "completed",
    description: "Monthly Premium Payment",
  },
  {
    id: "pay_9",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "TLKOT123",
    status: "completed",
    description: "Monthly Premium Payment",
  },
  {
    id: "pay_10",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "TLKOT123",
    status: "completed",
    description: "Monthly Premium Payment",
  },
  {
    id: "pay_11",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "TLKOT123",
    status: "completed",
    description: "Monthly Premium Payment",
  },
];

// Initiate M-Pesa payment
export const initiateMpesaPayment = async (paymentData) => {
  try {
    return await apiPost("/payments/mpesa", paymentData);
  } catch (error) {
    throw error;
  }
};

/**
 * Initiates an M-Pesa payment request with enhanced validation and error handling
 * @param {Object} paymentData - Payment data object
 * @param {number} paymentData.amount - Amount to be paid
 * @param {string} paymentData.phoneNumber - Phone number in format 254XXXXXXXXX
 * @param {string} paymentData.description - Payment description
 * @returns {Promise<Object>} - Response data
 */
export const initiateM_PesaPayment = async (paymentData) => {
  try {
    // Validate required fields
    if (!paymentData.amount || !paymentData.phoneNumber) {
      throw new Error("Amount and phone number are required");
    }

    // Format phone number
    let formattedPhone = paymentData.phoneNumber;

    // Remove all non-numeric characters
    formattedPhone = formattedPhone.replace(/\D/g, "");

    // Format based on prefix
    if (formattedPhone.startsWith("0")) {
      formattedPhone = `254${formattedPhone.substring(1)}`;
    } else if (
      formattedPhone.startsWith("7") ||
      formattedPhone.startsWith("1")
    ) {
      formattedPhone = `254${formattedPhone}`;
    } else if (formattedPhone.startsWith("254")) {
      // Already formatted correctly
    } else {
      throw new Error(
        "Invalid phone number format. Please use a valid Kenyan number."
      );
    }

    // Validate phone number format (must be 254 followed by 9 digits)
    if (!/^254\d{9}$/.test(formattedPhone)) {
      throw new Error(
        "Invalid phone number format. Please use a valid Kenyan number."
      );
    }

    // Make sure amount is a positive number
    const amount = Number(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Amount must be a valid positive number");
    }

    // Create final payload
    const payload = {
      amount: Math.max(1, Math.round(amount)), // Ensure amount is at least 1 KES and rounded
      phoneNumber: formattedPhone,
      description: paymentData.description || "M-Pesa Payment",
    };

    console.log("Sending M-Pesa payment request:", payload);

    // Make the API call
    const response = await apiPost("/payments/mpesa", payload);

    if (!response || response.error) {
      throw new Error(
        response?.message || "Failed to process payment. Please try again."
      );
    }

    return response;
  } catch (error) {
    console.error("M-Pesa payment initiation error:", error);

    // Extract the error message from various possible error formats
    let errorMessage = "Failed to process payment. Please try again.";

    if (error.response?.data?.message) {
      // Error from axios response
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      // Alternative error format
      errorMessage = error.response.data.error;
    } else if (error.message && error.message.includes("network")) {
      // Network error
      errorMessage =
        "Network error. Please check your internet connection and try again.";
    } else if (error.message) {
      // Direct error message
      errorMessage = error.message;
    }

    // If it's an M-Pesa specific error, try to extract more details
    if (error.response?.data?.errorMessage) {
      errorMessage = `M-Pesa error: ${error.response.data.errorMessage}`;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
};

// Create payment schedule
export const createPaymentSchedule = async (scheduleData) => {
  try {
    return await apiPost("/payments/schedule", scheduleData);
  } catch (error) {
    throw error;
  }
};

// Update payment schedule
export const updatePaymentSchedule = async (scheduleId, scheduleData) => {
  try {
    return await apiPut(`/payments/schedule/${scheduleId}`, scheduleData);
  } catch (error) {
    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async (params = {}) => {
  try {
    // In a real app, this would be an API call
    // return await apiGet("/payments/history", params);

    // For now, return mock data
    return {
      success: true,
      data: MOCK_PAYMENT_HISTORY,
    };
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw new Error("Failed to fetch payment history");
  }
};

// Get payment details
// export const getPaymentDetails = async (paymentId) => {
//   try {
//     // In a real app, this would be an API call
//     // return await apiGet(`/payments/${paymentId}`);

//     // For now, find the payment in our mock data
//     const payment = MOCK_PAYMENT_HISTORY.find((p) => p.id === paymentId);

//     if (!payment) {
//       throw new Error("Payment not found");
//     }

//     return {
//       success: true,
//       data: payment,
//     };
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     throw new Error("Failed to fetch payment details");
//   }
// };

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    // In a real app, this would be an API call
    // return await apiGet("/payments/methods");

    // For now, return mock payment methods
    return {
      success: true,
      data: [
        { id: "mpesa", name: "M-Pesa", icon: "mobile" },
        { id: "card", name: "Credit/Debit Card", icon: "credit-card" },
        { id: "bank", name: "Bank Transfer", icon: "bank" },
      ],
    };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw new Error("Failed to fetch payment methods");
  }
};

/**
 * Get all payments for a user
 * @param {string} userId - User ID
 * @returns {Promise} Promise with payments data
 */
export const getUserPayments = async (userId) => {
  try {
    const response = await apiGet(`/users/${userId}/payments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch payments" };
  }
};

/**
 * Get payment receipt
 * @param {string} paymentId - Payment ID
 * @returns {Promise} Promise with receipt URL
 */
export const getPaymentReceipt = async (paymentId) => {
  try {
    const response = await apiGet(`/payments/${paymentId}/receipt`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get receipt" };
  }
};

/**
 * Get payment details
 * @param {string} paymentId - Payment ID
 * @returns {Promise} Promise with payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await apiGet(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get payment details" };
  }
};

export default {
  getUserPayments,
  getPaymentReceipt,
  getPaymentDetails,
  initiateM_PesaPayment,
  initiateMpesaPayment,
};
