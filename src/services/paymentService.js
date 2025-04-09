import { apiGet, apiPost, apiPut } from "./api";

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
 * @param {string} paymentData.paymentType - Type of payment (e.g., "medical", "membership")
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
      paymentType: paymentData.paymentType || "other", // Include payment type
    };

    console.log("Sending M-Pesa payment request:", payload);

    // Save payment attempt to localStorage before making the API call
    try {
      localStorage.setItem(
        "crewAfya_pendingPayment",
        JSON.stringify({
          type: "mpesa_initiation",
          payload,
          status: "pending",
          initiatedAt: new Date().toISOString(),
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error saving payment to localStorage:", error);
    }

    // Make the API call
    const response = await apiPost("/payments/mpesa", payload);

    if (!response || response.error) {
      throw new Error(
        response?.message || "Failed to process payment. Please try again."
      );
    }

    // Update localStorage with payment ID and checkout request ID
    if (response.success && response.data && response.data.payment) {
      try {
        localStorage.setItem(
          "crewAfya_pendingPayment",
          JSON.stringify({
            type: "mpesa_initiation",
            payload,
            status: "waiting",
            paymentId: response.data.payment.id,
            checkoutRequestId: response.data.stkResponse?.CheckoutRequestID,
            initiatedAt: new Date().toISOString(),
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error updating payment in localStorage:", error);
      }
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

    // Update localStorage with error
    try {
      const pendingPaymentData = localStorage.getItem(
        "crewAfya_pendingPayment"
      );
      if (pendingPaymentData) {
        const pendingPayment = JSON.parse(pendingPaymentData);
        if (pendingPayment && pendingPayment.type === "mpesa_initiation") {
          localStorage.setItem(
            "crewAfya_pendingPayment",
            JSON.stringify({
              ...pendingPayment,
              status: "error",
              error: errorMessage,
              errorAt: new Date().toISOString(),
              timestamp: Date.now(),
            })
          );
        }
      }
    } catch (error) {
      console.error("Error updating payment error in localStorage:", error);
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
 * Get payments for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response containing payments data
 */
export const getUserPayments = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await apiGet(`/payments/admin/${userId}/history`);
    return response;
  } catch (error) {
    console.error("Error getting user payments:", error);

    let errorMessage = "Failed to fetch payments";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
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

/**
 * Check the status of a payment
 * @param {string} paymentId - Payment ID to check
 * @returns {Promise<Object>} Response with payment status details
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    const response = await apiGet(`/payments/${paymentId}/status`);

    // If payment is completed or failed, clear it from localStorage
    if (response.success && response.data) {
      try {
        // Update payment status in localStorage
        const pendingPaymentData = localStorage.getItem(
          "crewAfya_pendingPayment"
        );
        if (pendingPaymentData) {
          const pendingPayment = JSON.parse(pendingPaymentData);
          if (pendingPayment && pendingPayment.paymentId === paymentId) {
            // If payment is completed or failed, remove from localStorage
            if (
              response.data.status === "completed" ||
              response.data.status === "failed"
            ) {
              localStorage.removeItem("crewAfya_pendingPayment");
            } else {
              // Otherwise update the status
              localStorage.setItem(
                "crewAfya_pendingPayment",
                JSON.stringify({
                  ...pendingPayment,
                  status: response.data.status,
                  lastChecked: new Date().toISOString(),
                  timestamp: Date.now(),
                })
              );
            }
          }
        }
      } catch (error) {
        console.error("Error updating payment status in localStorage:", error);
      }
    }

    return response;
  } catch (error) {
    console.error("Error checking payment status:", error);

    // Extract the error message from various possible error formats
    let errorMessage = "Failed to check payment status";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Verify payment with M-Pesa directly using transaction code
 * @param {string} transactionCode - M-Pesa transaction code
 * @returns {Promise<Object>} Response with verification result
 */
export const verifyMpesaPayment = async (transactionCode) => {
  try {
    if (!transactionCode) {
      throw new Error("M-Pesa transaction code is required");
    }

    const response = await apiPost("/payments/mpesa/verify", {
      transactionCode,
    });
    return response;
  } catch (error) {
    console.error("Error verifying M-Pesa payment:", error);

    let errorMessage = "Failed to verify payment";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get pending payment from localStorage
 * @returns {Object|null} Pending payment information or null if none exists
 */
export const getPendingPayment = () => {
  try {
    const paymentData = localStorage.getItem("crewAfya_pendingPayment");
    if (!paymentData) return null;

    const payment = JSON.parse(paymentData);

    // Check if payment is too old (older than 24 hours)
    if (Date.now() - payment.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("crewAfya_pendingPayment");
      return null;
    }

    return payment;
  } catch (error) {
    console.error("Error retrieving payment from localStorage:", error);
    return null;
  }
};

/**
 * Clear pending payment from localStorage
 */
export const clearPendingPayment = () => {
  try {
    localStorage.removeItem("crewAfya_pendingPayment");
  } catch (error) {
    console.error("Error clearing payment from localStorage:", error);
  }
};

/**
 * Recover from a failed or interrupted payment process
 * @returns {Promise<Object|null>} Recovery result or null if no recovery needed
 */
export const recoverPaymentProcess = async () => {
  const pendingPayment = getPendingPayment();

  if (!pendingPayment) return null;

  // If the payment is too old (more than 1 hour), clear it and return null
  if (
    Date.now() - new Date(pendingPayment.initiatedAt).getTime() >
    60 * 60 * 1000
  ) {
    clearPendingPayment();
    return null;
  }

  // If we have a payment ID, check its status
  if (pendingPayment.paymentId) {
    try {
      const statusResponse = await checkPaymentStatus(pendingPayment.paymentId);

      if (statusResponse.success) {
        return {
          recovered: true,
          status: statusResponse.data.status,
          paymentId: pendingPayment.paymentId,
          checkoutRequestId: pendingPayment.checkoutRequestId,
          data: statusResponse.data,
        };
      }
    } catch (error) {
      console.error("Error recovering payment:", error);
    }
  }

  // If we couldn't recover with the payment ID, return the pending payment info
  return {
    recovered: false,
    pendingPayment,
  };
};

export default {
  getUserPayments,
  getPaymentReceipt,
  getPaymentDetails,
  initiateM_PesaPayment,
  initiateMpesaPayment,
  checkPaymentStatus,
  verifyMpesaPayment,
  getPendingPayment,
  clearPendingPayment,
  recoverPaymentProcess,
};
