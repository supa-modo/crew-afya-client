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

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (token) {
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
              await refreshUserToken();
              const userData = await getUserProfile();
              if (userData && userData.data) {
                setUser(userData.data);
                setIsAuthenticated(true);
                setIsAdmin(
                  userData.data.role === "admin" ||
                    userData.data.role === "superadmin"
                );
              }
            } catch (refreshErr) {
              // If refresh fails, clear storage
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              setUser(null);
              setIsAuthenticated(false);
              setIsAdmin(false);
            }
          }
        } else {
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

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);

      // Login and get tokens
      const response = await loginUser(identifier, password);

      // Extract user data from the response
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
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
      setError(err.message || "Failed to login");
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Login and get tokens
      const response = await adminLoginUser(email, password);

      // Extract user data from the response
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
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
      setError(err.message || "Failed to login");
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
      const data = await registerUser(userData);
      return data;
    } catch (err) {
      setError(err.message || "Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      // Note: tokens are now cleared in the logoutUser function
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (err) {
      setError(err.message || "Failed to logout");
      // Still set user to null even if logout fails
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
        clearError,
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
