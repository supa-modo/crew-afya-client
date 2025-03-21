import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

/**
 * Upload a document for the current user
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

    // Create custom config for multipart/form-data
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await apiPost("/documents", formData, config);
    return response.data;
  } catch (error) {
    console.error("Document upload error:", error);
    throw error;
  }
};

/**
 * Get all documents for the current user
 * @returns {Promise} Promise with documents data
 */
export const getUserDocuments = async () => {
  try {
    const response = await apiGet("/documents");
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    throw error;
  }
};

/**
 * Get document by ID for the current user
 * @param {string} id - Document ID
 * @returns {Promise} Promise with document data
 */
export const getDocumentById = async (id) => {
  try {
    const response = await apiGet(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch document:", error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} id - Document ID
 * @returns {Promise} Promise with success message
 */
export const deleteUserDocument = async (id) => {
  try {
    const response = await apiDelete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete document:", error);
    throw error;
  }
};

/**
 * Upload document for a specific user (admin only)
 * @param {string} userId - User ID
 * @param {FormData} formData - Form data with file and document details
 * @returns {Promise} Promise with uploaded document data
 */
export const uploadUserDocument = async (userId, formData) => {
  try {
    // Create custom config for multipart/form-data
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await apiPost(
      `/users/${userId}/documents`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload document for user:", error);
    throw error;
  }
};

/**
 * Get documents for a specific user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise} Promise with documents data
 */
export const getUserDocumentsByAdmin = async (userId) => {
  try {
    const response = await apiGet(`/users/${userId}/documents`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user documents:", error);
    throw error;
  }
};

/**
 * Verify a document (admin only)
 * @param {string} documentId - Document ID
 * @returns {Promise} Promise with verified document data
 */
export const verifyDocument = async (documentId) => {
  try {
    const response = await apiPatch(`/documents/${documentId}/verify`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify document:", error);
    throw error;
  }
};

export default {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteUserDocument,
  uploadUserDocument,
  getUserDocumentsByAdmin,
  verifyDocument,
};
