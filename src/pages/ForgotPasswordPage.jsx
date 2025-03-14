import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiHeart, FiArrowLeft, FiShield } from "react-icons/fi";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmitSuccess = (email) => {
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-gray-900/80 dark:to-blue-900/80">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/afya1.jpg"
          alt="Health background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 via-blue-50/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-transparent to-blue-50/50 z-10 backdrop-blur-sm" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-100/40 to-blue-100/30 dark:from-cyan-800/20 dark:to-blue-800/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-teal-100/30 to-blue-100/20 dark:from-teal-800/20 dark:to-blue-800/10 rounded-full blur-3xl opacity-70"></div>

        {/* Abstract medical-themed decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 border-4 border-blue-200/30 dark:border-blue-700/20 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border-2 border-teal-300/40 dark:border-teal-600/30 rounded-full"></div>

        {/* Plus symbols - medical theme */}
        <div className="absolute top-24 left-16 text-blue-300/30 dark:text-blue-700/20 text-4xl font-bold">
          +
        </div>
        <div className="absolute bottom-20 right-24 text-teal-300/30 dark:text-teal-700/20 text-5xl font-bold">
          +
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md z-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-8 pt-8 pb-6 text-center relative"
          >
            {/* Logo & branding */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white mb-5 shadow-lg"
            >
              {emailSent ? (
                <FiMail className="h-8 w-8" />
              ) : (
                <FiHeart className="h-8 w-8" />
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
            >
              {emailSent ? "Check Your Email" : "Forgot Password"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-gray-500 dark:text-gray-400 mb-6"
            >
              {emailSent
                ? "We've sent you instructions to reset your password"
                : "Enter your email to receive password reset instructions"}
            </motion.p>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mx-auto"
            ></motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50"
          >
            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-6"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FiMail className="h-8 w-8" />
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-sm text-gray-600 dark:text-gray-300 mb-2"
                  >
                    Please check your email and follow the instructions to reset
                    your password.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    If you don't see the email, check your spam folder.
                  </motion.p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    Return to Login
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <ForgotPasswordForm onSubmitSuccess={handleSubmitSuccess} />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="mt-6 flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, x: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      <FiArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8 flex justify-center"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
            className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-3 flex items-center backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
          >
            <FiShield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Your data is protected with enterprise-grade security
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
