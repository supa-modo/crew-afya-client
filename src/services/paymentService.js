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
};
