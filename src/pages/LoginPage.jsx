import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { TbLockFilled, TbShieldCheckFilled } from "react-icons/tb";

const LoginPage = () => {
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-gray-900/80 dark:to-blue-900/80">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/afya1.jpg"
          alt="Health background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 via-blue-50/60 to-transparent dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-transparent to-blue-50/50 dark:from-gray-900/70 dark:via-gray-900/40 dark:to-gray-900/60 z-10 backdrop-blur-sm" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-100/40 to-blue-100/30 dark:from-cyan-800/20 dark:to-blue-800/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-teal-100/30 to-blue-100/20 dark:from-teal-800/20 dark:to-blue-800/10 rounded-full blur-3xl opacity-70"></div>

        {/* Abstract medical-themed decorative elements - adjusted for smaller screens */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 border-4 border-blue-200/30 dark:border-blue-700/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 sm:w-32 sm:h-32 border-2 border-teal-300/40 dark:border-teal-600/30 rounded-full"></div>

        {/* Heartbeat line */}
        <svg
          className="absolute bottom-24 left-0 right-0 mx-auto w-3/4 sm:w-auto opacity-20 dark:opacity-10"
          width="400"
          height="50"
          viewBox="0 0 400 50"
        >
          <path
            d="M0,25 L50,25 L60,10 L70,40 L80,15 L90,25 L400,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500 dark:text-blue-400"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-lg z-20 mt-24"
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
            <div className="text-center mb-3 md:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl  font-bold text-primary-500 dark:text-primary-400 mb-1 sm:mb-2 md:mb-3">
                CrewAfya Care
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">
                Enter your login credentials to access your dashboard
              </p>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "8rem" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full mx-auto"
            ></motion.div>
          </motion.div>

          <div className="px-4 pb-10 bg-gray-50 dark:bg-gray-800/50">
            <LoginForm />
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
            <TbShieldCheckFilled className="w-4 h-4 mr-1" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <TbLockFilled className="w-4 h-4 mr-1" />
            <span>HIPAA Compliant</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
