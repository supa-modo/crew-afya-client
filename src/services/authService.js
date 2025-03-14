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
    const token = localStorage.getItem("token");
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

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Store the new token
        if (response.data && response.data.data && response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);

          // Update the Authorization header for the retry
          originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
          return api(originalRequest);
        } else {
          throw new Error("Invalid token response format");
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and return the error
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login user with phone number or ID number
export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post("/auth/login", { identifier, password });

    // Check if response has the expected structure
    if (response.data && response.data.data) {
      const { token, refreshToken, user } = response.data.data;

      // Store tokens in localStorage
      if (token) localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      return response.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login admin with email
export const adminLoginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/admin-login", { email, password });

    // Check if response has the expected structure
    if (response.data && response.data.data) {
      const { token, refreshToken, user } = response.data.data;

      // Store tokens in localStorage
      if (token) localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      return response.data;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/auth/logout", { refreshToken });

    // Always clear tokens on logout
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    return response.data;
  } catch (error) {
    // Still clear tokens even if the logout request fails
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw handleApiError(error);
  }
};

// Refresh token
export const refreshUserToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });

    // Check if response has the expected structure
    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      return response.data;
    } else {
      throw new Error("Invalid token response format");
    }
  } catch (error) {
    // Clear tokens on refresh failure
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw handleApiError(error);
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorMessage =
      error.response.data.message ||
      (error.response.data.error
        ? error.response.data.error
        : "An error occurred");
    return new Error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    return new Error(
      "No response from server. Please check your internet connection."
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    return new Error("Error setting up request. Please try again.");
  }
};

export default api;
