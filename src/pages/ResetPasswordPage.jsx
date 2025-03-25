import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLockFilled, TbShieldCheckFilled } from "react-icons/tb";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-gray-900/80 dark:to-blue-900/80">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/matwana.jpg"
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

        {/* Abstract medical-themed decorative elements */}
        <div className="absolute top-1/3 right-1/4 w-16 h-16 sm:w-32 sm:h-32 border-2 border-blue-200/30 dark:border-blue-700/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-8 h-8 sm:w-16 sm:h-16 border border-teal-300/40 dark:border-teal-600/30 rounded-full"></div>
      
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
        className="w-full max-w-lg z-20 mt-12 md:mt-24"
      >
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="px-8 pt-10 pb-6 text-center relative"
          >
            <div className="w-full">
              <img
                src="/mwulogo.png"
                alt="crewafya-logo"
                className="w-16 h-16 md:w-20 md:h-20 mx-auto"
              />
            </div>
            <div className="text-center pt-4 mb-3 md:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-700 dark:text-secondary-600 mb-1 sm:mb-2 md:mb-3">
                Reset Your Password
              </h1>
              <p className="text-gray-500/85 text-sm lg:text-base">
                Set a new password for your CrewAfya account
              </p>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "8rem" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-1 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-full mx-auto"
            ></motion.div>
          </motion.div>

          <div className="px-4 pb-10">
            <div className="mx-1 sm:mx-4">
              <ResetPasswordForm />
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-[0.83rem] sm:text-sm font-medium text-secondary-700 hover:text-secondary-600 dark:text-secondary-600 dark:hover:text-secondary-500 transition-colors duration-200"
              >
                Back to login
              </Link>
            </div>
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
            <span>Secure Process</span>
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

export default ResetPasswordPage;
