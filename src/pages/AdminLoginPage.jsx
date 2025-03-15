import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLoginForm from "../components/auth/AdminLoginForm";
import { FiCheckCircle, FiShield, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { TbAlertTriangle, TbLockFilled, TbUserShield } from "react-icons/tb";

const AdminLoginPage = () => {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || null);
  const { error: authError } = useAuth();

  // Clear the success message after 5 seconds, but keep error messages
  useEffect(() => {
    if (message && !authError) {
      const timer = setTimeout(() => {
        setMessage(null);
        // Clear the message from location state
        window.history.replaceState({}, document.title);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, authError]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-indigo-900/80">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/afya1.jpg"
          alt="Health background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/70 via-indigo-50/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-transparent to-indigo-50/50 z-10 backdrop-blur-sm" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-100/40 to-indigo-100/30 dark:from-blue-800/20 dark:to-indigo-800/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-indigo-100/30 to-blue-100/20 dark:from-indigo-800/20 dark:to-blue-800/10 rounded-full blur-3xl opacity-70"></div>

        {/* Abstract admin-themed decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 border-4 border-indigo-200/30 dark:border-indigo-700/20 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border-2 border-blue-300/40 dark:border-blue-600/30 rounded-full"></div>

        {/* Shield symbols - admin theme */}
        <div className="absolute top-24 left-64 text-indigo-300/50 dark:text-indigo-700/20 text-5xl">
          <TbUserShield className="h-16 w-16" />
        </div>
        <div className="absolute bottom-24 right-24 text-blue-200 dark:text-blue-700/20 text-5xl">
          <TbLockFilled className="h-20 w-20" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full max-w-lg z-20"
      >
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl shadow-lg flex items-start animate-fadeIn border border-green-100 dark:border-green-800/50"
          >
            <FiCheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="px-8 pt-10 pb-6 text-center relative"
          >
            <div className="w-full ">
              <img
                src="/logo.png"
                alt="crewafya-logo"
                className="w-16 h-16 md:w-20 md:h-20 mx-auto"
              />
            </div>
            <div className="text-center mt-2 mb-3 sm:mb-4">
              <h1 className="text-2xl md:text-3xl font-nunito font-extrabold text-secondary-500 dark:text-secondary-400 mb-3">
                CrewAfya Admin
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">
                Sign in withyour admin credentials to continue
              </p>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "8rem" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-1 bg-gradient-to-r from-secondary-500 to-secondary-700 rounded-full mx-auto"
            ></motion.div>
          </motion.div>

          <div className="px-8 pb-6 bg-gray-50 dark:bg-gray-800/50">
            <AdminLoginForm />
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8 flex justify-center space-x-6 opacity-70"
        >
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <svg
              className="h-4 w-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            Secure Admin Access
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <svg
              className="h-4 w-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            Advanced Security
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
