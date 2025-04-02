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
    return await apiPost("/subscriptions", subscriptionData);
  } catch (error) {
    console.error("Error saving subscription:", error);
    throw error;
  }
};

/**
 * Get user subscription from the server
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response data with user subscription
 */
export const getUserSubscription = async (userId) => {
  try {
    return await apiGet(`/subscriptions/user/${userId}`);
  } catch (error) {
    console.error("Error getting user subscription:", error);
    return null;
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
    return await apiGet(`/subscriptions/coverage/${userId}`);
  } catch (error) {
    console.error("Error getting coverage utilization:", error);
    // Return mock data for now
    return {
      inpatient: {
        limit: 200000,
        used: 45000,
        remaining: 155000
      },
      outpatient: {
        limit: 20000,
        used: 8500,
        remaining: 11500
      },
      maternity: {
        limit: 20000,
        used: 0,
        remaining: 20000
      },
      optical: {
        limit: 5000,
        used: 2000,
        remaining: 3000
      },
      dental: {
        limit: 5000,
        used: 0,
        remaining: 5000
      }
    };
  }
};

export default {
  saveSubscription,
  getUserSubscription,
  updateSubscription,
  getPremiumAmount,
  getCoverageUtilization
};
