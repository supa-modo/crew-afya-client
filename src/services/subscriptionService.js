import { apiGet, apiPost, apiPut } from "./api";

/**
 * Save user subscription to the server
 * @param {Object} subscriptionData - Subscription data object
 * @param {Object} subscriptionData.plan - Selected plan
 * @param {string} subscriptionData.frequency - Payment frequency (daily, weekly, monthly, annual)
 * @param {string} subscriptionData.userId - User ID
 * @returns {Promise<Object>} - Response data
 */
export const saveSubscription = async (subscriptionData) => {
  try {
    // Ensure all required fields are present
    if (!subscriptionData.userId) {
      console.error("Missing userId in subscription data");
      return { success: false, message: "User ID is required" };
    }
    
    if (!subscriptionData.planId) {
      console.error("Missing planId in subscription data");
      return { success: false, message: "Plan ID is required" };
    }
    
    if (!subscriptionData.paymentFrequency && !subscriptionData.frequency) {
      console.error("Missing frequency in subscription data");
      return { success: false, message: "Payment frequency is required" };
    }
    
    // Normalize the data
    const normalizedData = {
      userId: subscriptionData.userId,
      planId: subscriptionData.planId,
      frequency: subscriptionData.paymentFrequency || subscriptionData.frequency,
    };
    
    // Add startDate if provided
    if (subscriptionData.startDate) {
      normalizedData.startDate = subscriptionData.startDate;
    }
    
    const response = await apiPost("/subscriptions", normalizedData);
    return response;
  } catch (error) {
    console.error("Error saving subscription:", error);
    // Return a structured error response instead of throwing
    return {
      success: false,
      message: error.message || "Failed to save subscription",
      error: error
    };
  }
};

/**
 * Get user subscription from the server
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response data with user subscription
 */
export const getUserSubscription = async (userId) => {
  try {
    if (!userId) {
      console.error("Missing userId in getUserSubscription");
      return {
        success: false,
        message: "User ID is required",
        data: null
      };
    }
    
    const response = await apiGet(`/subscriptions/user/${userId}`);
    return response;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    
    // If it's a 404 (no subscription found), return a structured response
    if (error.status === 404) {
      return {
        success: false,
        message: "No active subscription found",
        data: null
      };
    }
    
    // For server errors (500), provide a more specific message
    if (error.status >= 500) {
      return {
        success: false,
        message: "Server error while retrieving subscription. Please try again later.",
        data: null
      };
    }
    
    // For other errors, return a structured error response
    return {
      success: false,
      message: error.message || "Failed to get user subscription",
      error: error,
      data: null // Ensure data is always present in the response
    };
  }
};

/**
 * Update user subscription
 * @param {string} subscriptionId - Subscription ID
 * @param {Object} subscriptionData - Updated subscription data
 * @returns {Promise<Object>} - Response data
 */
export const updateSubscription = async (subscriptionId, subscriptionData) => {
  try {
    return await apiPut(`/subscriptions/${subscriptionId}`, subscriptionData);
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};

/**
 * Get premium amount based on plan and frequency
 * @param {Object} plan - Plan object
 * @param {string} frequency - Payment frequency
 * @returns {number} - Premium amount
 */
export const getPremiumAmount = (plan, frequency) => {
  if (!plan) return 0;
  
  // Handle plans with premiums object
  if (plan.premiums && plan.premiums[frequency] !== undefined) {
    return plan.premiums[frequency];
  }
  
  // Handle plans with individual premium fields (e.g., dailyPremium, monthlyPremium)
  const premiumField = `${frequency}Premium`;
  if (plan[premiumField] !== undefined) {
    return plan[premiumField];
  }
  
  return 0;
};

/**
 * Get coverage utilization data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Coverage utilization data
 */
export const getCoverageUtilization = async (userId) => {
  try {
    if (!userId) {
      console.error("Missing userId in getCoverageUtilization");
      return {
        success: false,
        message: "User ID is required",
        data: getDefaultCoverageData()
      };
    }
    
    const response = await apiGet(`/subscriptions/coverage/${userId}`);
    
    // Ensure the response has the expected structure
    if (response.data && (!response.data.coverage || !response.data.utilization)) {
      console.warn("Coverage data has unexpected structure, applying defaults");
      return {
        ...response,
        data: {
          ...response.data,
          coverage: response.data.coverage || getDefaultCoverageValues(),
          utilization: response.data.utilization || getDefaultCoverageValues()
        }
      };
    }
    
    return response;
  } catch (error) {
    console.error("Error getting coverage utilization:", error);
    
    // Handle specific error codes
    if (error.status === 404) {
      return {
        success: false,
        message: "No coverage data found for this user",
        data: getDefaultCoverageData()
      };
    }
    
    if (error.status >= 500) {
      return {
        success: false,
        message: "Server error while retrieving coverage data. Please try again later.",
        data: getDefaultCoverageData()
      };
    }
    
    // Return a structured error response with default data
    return {
      success: false,
      message: error.message || "Failed to get coverage utilization",
      data: getDefaultCoverageData()
    };
  }
};

/**
 * Helper function to get default coverage values
 * @returns {Object} - Default coverage values
 */
const getDefaultCoverageValues = () => ({
  inpatient: 0,
  outpatient: 0,
  dental: 0,
  optical: 0,
  maternity: 0
});

/**
 * Helper function to get default coverage data structure
 * @returns {Object} - Default coverage data
 */
const getDefaultCoverageData = () => ({
  coverage: getDefaultCoverageValues(),
  utilization: getDefaultCoverageValues()
});

export default {
  saveSubscription,
  getUserSubscription,
  updateSubscription,
  getPremiumAmount,
  getCoverageUtilization
};
