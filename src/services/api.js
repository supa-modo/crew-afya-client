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
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for auth endpoints (login, register, etc.)
    const isAuthEndpoint =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/admin-login");

    // If error is 401 and we haven't tried to refresh token yet and it's not an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token - check both storage locations
        const refreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Store the new token in the same storage that had the refresh token
        if (response.data && response.data.data && response.data.data.token) {
          const newToken = response.data.data.token;

          if (localStorage.getItem("refreshToken")) {
            localStorage.setItem("token", newToken);
          } else if (sessionStorage.getItem("refreshToken")) {
            sessionStorage.setItem("token", newToken);
          }

          // Update the Authorization header for the retry
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Invalid token response format");
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens from both storages
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");

        // Redirect to login page if refresh fails
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorData = error.response.data;

    // Try to extract the most specific error message available
    let errorMessage;

    if (errorData.message) {
      // Use the server's error message if available
      errorMessage = errorData.message;
    } else if (errorData.error) {
      // Fallback to error field
      errorMessage = errorData.error;
    } else if (error.response.status === 401) {
      // Special case for 401 errors
      errorMessage =
        "Invalid credentials. Please check your login details and try again.";
    } else if (error.response.status === 404) {
      // Special case for 404 errors
      errorMessage = "Resource not found. Please check your request.";
    } else if (error.response.status === 403) {
      // Special case for 403 errors
      errorMessage = "You don't have permission to access this resource.";
    } else if (error.response.status >= 500) {
      // Server errors
      errorMessage = "Server error. Please try again later.";
    } else {
      // Generic error message as last resort
      errorMessage = "An error occurred while processing your request.";
    }

    console.error("API Error:", {
      status: error.response.status,
      data: errorData,
      message: errorMessage,
    });

    // Create an error object with the message and additional properties
    const apiError = new Error(errorMessage);
    apiError.status = error.response.status;
    apiError.isApiError = true;
    return apiError;
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network Error:", error.request);
    const networkError = new Error(
      "Network error. Please check your internet connection and try again."
    );
    networkError.isNetworkError = true;
    return networkError;
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Request Setup Error:", error.message);
    return new Error(error.message || "An error occurred. Please try again.");
  }
};

// Export common API methods
export const apiGet = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiPost = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiPut = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiDelete = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiDownload = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, {
      responseType: "blob",
    });

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;
