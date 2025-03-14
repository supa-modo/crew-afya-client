import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "../components/auth/RegisterForm";
import {
  FiHeart,
  FiShield,
  FiSmile,
  FiCreditCard,
  FiUser,
  FiCheckCircle,
  FiPhone,
} from "react-icons/fi";

const RegisterPage = () => {
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
        <div className="absolute top-1/3 right-1/3 w-48 h-48 border-4 border-blue-200/30 dark:border-blue-700/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-teal-300/40 dark:border-teal-600/30 rounded-full"></div>

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
        className="w-full max-w-2xl z-20"
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
            className="px-8 pt-8 pb-2 text-center relative"
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
              <FiHeart className="h-8 w-8" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
            >
              Create Your Account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-gray-500 dark:text-gray-400 mb-6"
            >
              Join CrewAfya to manage your health insurance with ease
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50"
          >
            <RegisterForm />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="mt-6 text-center text-sm"
            >
              <p className="text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </motion.span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Benefits section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-4 flex items-center backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Easy Payments
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track and manage all payments in one place
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-4 flex items-center backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
              <FiCreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Secure Platform
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your health data is protected and secure
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-4 flex items-center backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
              <FiHeart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Health First
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Always putting your health coverage first
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
