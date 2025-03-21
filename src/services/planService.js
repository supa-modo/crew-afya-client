import api from "./api";

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
 * Create new plan
 * @param {Object} planData - Plan data
 * @returns {Promise} Promise with created plan data
 */
export const createPlan = async (planData) => {
  try {
    const response = await api.post("/plans", planData);
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
    throw { message: "Failed to create plan. Please try again." };
  }
};

/**
 * Update plan
 * @param {string} id - Plan ID
 * @param {Object} planData - Updated plan data
 * @returns {Promise} Promise with updated plan data
 */
export const updatePlan = async (id, planData) => {
  try {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update plan" };
  }
};

/**
 * Delete plan
 * @param {string} id - Plan ID
 * @returns {Promise} Promise with success message
 */
export const deletePlan = async (id) => {
  try {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete plan" };
  }
};

/**
 * Initialize default plans
 * @returns {Promise} Promise with success message
 */
export const initializeDefaultPlans = async () => {
  try {
    const response = await api.post("/plans/init");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to initialize default plans" }
    );
  }
};
