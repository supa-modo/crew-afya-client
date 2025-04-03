import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/userLayout/Layout";
import ScrollToTop from "./components/common/ScrollToTop";
import HomePage from "./pages/HomePage";
// import HomePage from "./pages/Homepage2";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PaymentsPage from "./pages/PaymentsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLayout from "./components/admin/adminLayout/AdminLayout";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSystemHealthPage from "./pages/admin/AdminSystemHealthPage";
import AddNewUserPage from "./pages/admin/AddNewUserPage";
import InsurancePlansPage from "./pages/admin/InsurancePlansPage";
import NewMedicalCoverPage from "./pages/admin/NewMedicalCoverPage";
import UsersManagement from "./pages/admin/UsersManagement";
import ClaimsManagementPage from "./pages/admin/ClaimsManagementPage";
import ClaimDetailPage from "./pages/admin/ClaimDetailPage";
import ClaimFormPage from "./pages/admin/ClaimFormPage";
import SupportPage from "./pages/SupportPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <>
      <Analytics />
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="admin-login" element={<AdminLoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route
                  path="forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="reset-password/:token"
                  element={<ResetPasswordPage />}
                />

                {/* Protected routes for regular users */}
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="payments"
                  element={
                    <ProtectedRoute>
                      <PaymentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin routes with AdminLayout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="members" element={<AdminUsersPage />} />
                <Route path="members/new" element={<AddNewUserPage />} />
                <Route path="plans" element={<InsurancePlansPage />} />
                <Route path="new-cover" element={<NewMedicalCoverPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="reports" element={<AdminAnalyticsPage />} />
                <Route path="users-management" element={<UsersManagement />} />
                <Route path="claims" element={<ClaimsManagementPage />} />
                <Route path="claims/:id" element={<ClaimDetailPage />} />
                <Route path="claims/new" element={<ClaimFormPage />} />
                <Route path="claims/:id/edit" element={<ClaimFormPage />} />
                <Route
                  path="system-health"
                  element={<AdminSystemHealthPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
