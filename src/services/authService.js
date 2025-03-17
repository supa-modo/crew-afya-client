import api, { apiGet, apiPost } from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance with default config
const apiInstance = api.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
apiInstance.interceptors.request.use(
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
apiInstance.interceptors.response.use(
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

        const response = await apiInstance.post("/auth/refresh-token", {
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
          return apiInstance(originalRequest);
        } else {
          throw new Error("Invalid token response format");
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens from both storages
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Register a new user
export const registerUser = async (userData) => {
  try {
    // Create a copy of userData to avoid modifying the original
    const userDataToSend = { ...userData };

    // If email is empty string, set it to null
    if (userDataToSend.email === "") {
      userDataToSend.email = null;
    }

    // If otherNames is empty string, set it to null
    if (userDataToSend.otherNames === "") {
      userDataToSend.otherNames = null;
    }

    return await apiPost("/auth/register", userDataToSend);
  } catch (error) {
    throw error;
  }
};

// Login user with phone number or ID number
export const loginUser = async (identifier, password, rememberMe = false) => {
  try {
    const response = await apiPost("/auth/login", { identifier, password });

    // Check if response has the expected structure
    if (response && response.data) {
      const { token, refreshToken, user } = response.data;

      // Store tokens based on rememberMe preference
      if (token && refreshToken) {
        if (rememberMe) {
          // Store in localStorage for persistent login
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          // Clear sessionStorage to avoid conflicts
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refreshToken");
        } else {
          // Store in sessionStorage for session-only login
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refreshToken", refreshToken);
          // Clear localStorage to avoid conflicts
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }

      return response;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    throw error;
  }
};

// Login admin with email
export const adminLoginUser = async (email, password, rememberMe = false) => {
  try {
    const response = await apiPost("/auth/admin-login", { email, password });

    // Check if response has the expected structure
    if (response && response.data) {
      const { token, refreshToken, user } = response.data;

      // Store tokens based on rememberMe preference
      if (token && refreshToken) {
        if (rememberMe) {
          // Store in localStorage for persistent login
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          // Clear sessionStorage to avoid conflicts
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refreshToken");
        } else {
          // Store in sessionStorage for session-only login
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refreshToken", refreshToken);
          // Clear localStorage to avoid conflicts
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }

      return response;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Get refresh token from either storage
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    await apiPost("/auth/logout", { refreshToken });

    // Always clear tokens on logout from both storages
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");

    return { success: true };
  } catch (error) {
    // Still clear tokens even if the logout request fails
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    throw error;
  }
};

// Refresh token
export const refreshUserToken = async () => {
  try {
    // Check both storage locations for refresh token
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiPost("/auth/refresh-token", {
      refreshToken,
    });

    // Check if response has the expected structure
    if (response && response.data && response.data.token) {
      const newToken = response.data.token;

      // Store the new token in the same storage that had the refresh token
      if (localStorage.getItem("refreshToken")) {
        localStorage.setItem("token", newToken);
      } else if (sessionStorage.getItem("refreshToken")) {
        sessionStorage.setItem("token", newToken);
      }

      return response;
    } else {
      throw new Error("Invalid token response format");
    }
  } catch (error) {
    // Clear tokens on refresh failure from both storages
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    return await apiGet("/auth/profile");
  } catch (error) {
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (identifier) => {
  try {
    // Determine if the identifier is an email or phone number
    const isEmail = identifier.includes("@");

    const payload = isEmail
      ? { email: identifier }
      : { phoneNumber: identifier };

    return await apiPost("/auth/forgot-password", payload);
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    return await apiPost(`/auth/reset-password/${token}`, {
      password,
    });
  } catch (error) {
    throw error;
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
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

export default apiInstance;
