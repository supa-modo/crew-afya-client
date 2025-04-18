import axios from "axios";
import { getAuthHeader } from "../utils/auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get all dependants for the current user
export const getAllDependants = async () => {
  try {
    const response = await axios.get(`${API_URL}/dependants`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch dependants" };
  }
};

// Create a new dependant
export const createDependant = async (dependantData) => {
  try {
    const response = await axios.post(`${API_URL}/dependants`, dependantData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create dependant" };
  }
};

// Update an existing dependant
export const updateDependant = async (id, dependantData) => {
  try {
    const response = await axios.put(
      `${API_URL}/dependants/${id}`,
      dependantData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update dependant" };
  }
};

// Delete a dependant
export const deleteDependant = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/dependants/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete dependant" };
  }
};

const dependantsService = {
  getAllDependants,
  createDependant,
  updateDependant,
  deleteDependant,
};

export default dependantsService;
