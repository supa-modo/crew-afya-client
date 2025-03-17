import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  adminLoginUser,
  registerUser,
  logoutUser,
  refreshUserToken,
  getUserProfile,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const currentToken =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (currentToken) {
          setToken(currentToken);
          try {
            // Get user profile
            const userData = await getUserProfile();
            if (userData && userData.data) {
              setUser(userData.data);
              setIsAuthenticated(true);
              setIsAdmin(
                userData.data.role === "admin" ||
                  userData.data.role === "superadmin"
              );
            }
          } catch (err) {
            // Token might be expired, try to refresh
            try {
              const refreshResponse = await refreshUserToken();
              if (
                refreshResponse &&
                refreshResponse.data &&
                refreshResponse.data.token
              ) {
                setToken(refreshResponse.data.token);
                const userData = await getUserProfile();
                if (userData && userData.data) {
                  setUser(userData.data);
                  setIsAuthenticated(true);
                  setIsAdmin(
                    userData.data.role === "admin" ||
                      userData.data.role === "superadmin"
                  );
                }
              }
            } catch (refreshErr) {
              // If refresh fails, clear storage
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("refreshToken");
              setToken(null);
              setUser(null);
              setIsAuthenticated(false);
              setIsAdmin(false);
            }
          }
        } else {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        setError(err.message);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (identifier, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      // Login and get tokens
      const response = await loginUser(identifier, password, rememberMe);

      // Extract user data from the response
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
        setIsAdmin(
          response.data.user.role === "admin" ||
            response.data.user.role === "superadmin"
        );
        return response.data.user;
      } else {
        // If we have a token but no user data in the response,
        // try to fetch the user profile
        try {
          const userData = await getUserProfile();
          if (userData && userData.data) {
            setUser(userData.data);
            setIsAuthenticated(true);
            setIsAdmin(
              userData.data.role === "admin" ||
                userData.data.role === "superadmin"
            );
            return userData.data;
          }
        } catch (profileErr) {
          throw new Error("Failed to get user profile after login");
        }
      }
    } catch (err) {
      console.error("Login error:", err);

      // Set the error state with the specific message from the API
      const errorMessage = err.message || "Failed to login. Please try again.";
      setError(errorMessage);

      setIsAuthenticated(false);
      setIsAdmin(false);
      throw err; // Re-throw to be caught by the component
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      // Login and get tokens
      const response = await adminLoginUser(email, password, rememberMe);

      // Extract user data from the response
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
        setIsAdmin(true);
        return response.data.user;
      } else {
        // If we have a token but no user data in the response,
        // try to fetch the user profile
        try {
          const userData = await getUserProfile();
          if (userData && userData.data) {
            setUser(userData.data);
            setIsAuthenticated(true);
            setIsAdmin(
              userData.data.role === "admin" ||
                userData.data.role === "superadmin"
            );
            return userData.data;
          }
        } catch (profileErr) {
          throw new Error("Failed to get user profile after login");
        }
      }
    } catch (err) {
      console.error("Admin login error:", err);
      // Use the error message from the error object
      setError(err.message || "Failed to login as admin. Please try again.");
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure email is null if it's an empty string
      const processedUserData = { ...userData };
      if (processedUserData.email === "") {
        processedUserData.email = null;
      }

      // Ensure otherNames is null if it's an empty string
      if (processedUserData.otherNames === "") {
        processedUserData.otherNames = null;
      }

      const data = await registerUser(processedUserData);
      return data;
    } catch (err) {
      console.error("Registration error:", err);
      // Use the error message from the error object
      setError(err.message || "Failed to register. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      // Clear tokens from both storage locations
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (err) {
      setError(err.message || "Failed to logout");
      // Still set user to null even if logout fails
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Function to update user data in context
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
