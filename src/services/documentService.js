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
 * Upload a document
 * @param {File} file - The file to upload
 * @param {string} name - Document name
 * @param {string} type - Document type (identity, insurance, medical, receipt, other)
 * @param {string} description - Document description (optional)
 * @returns {Promise} Promise with uploaded document data
 */
export const uploadDocument = async (file, name, type, description = "") => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);
    if (description) {
      formData.append("description", description);
    }

    // Get the token directly to ensure it's available
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }

    // Create custom config for multipart/form-data with explicit token
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${API_URL}/documents`, formData, config);
    return response.data;
  } catch (error) {
    console.error("Document upload error:", error);
    throw error.response?.data || { message: "Failed to upload document" };
  }
};

/**
 * Get all user documents
 * @returns {Promise} Promise with user documents data
 */
export const getUserDocuments = async () => {
  try {
    const response = await api.get("/documents");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch documents" };
  }
};

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise} Promise with document data
 */
export const getDocumentById = async (id) => {
  try {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch document" };
  }
};

/**
 * Delete document
 * @param {string} id - Document ID
 * @returns {Promise} Promise with success message
 */
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete document" };
  }
};
