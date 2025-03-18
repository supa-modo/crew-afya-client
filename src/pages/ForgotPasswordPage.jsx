import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiPhone } from "react-icons/fi";
import {
  TbLockFilled,
  TbMailFilled,
  TbPhone,
  TbShieldCheckFilled,
} from "react-icons/tb";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const [resetSent, setResetSent] = useState(false);
  const [resetMethod, setResetMethod] = useState("email"); // "phone" or "email"
  const [resetIdentifier, setResetIdentifier] = useState("");

  const handleSubmitSuccess = (identifier) => {
    setResetSent(true);
    setResetIdentifier(identifier);
    setResetMethod(identifier.includes("@") ? "email" : "phone");
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 via-blue-50/60 to-transparent dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-transparent to-blue-50/50 dark:from-gray-900/70 dark:via-gray-900/40 dark:to-gray-900/60 z-10 backdrop-blur-sm" />
      </div>

      {/* Background decorative elements - improved for smaller screens */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-100/40 to-blue-100/30 dark:from-cyan-800/20 dark:to-blue-800/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 sm:translate-x-1/3 sm:-translate-y-1/3"></div>
        <div className="absolute -bottom-12 -left-12 sm:-bottom-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-teal-100/30 to-blue-100/20 dark:from-teal-800/20 dark:to-blue-800/10 rounded-full blur-3xl opacity-70"></div>

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
        className="w-full max-w-lg z-20 mt-12 md:mt-20"
      >
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
            <div className="text-center pt-4 mb-3 md:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-nunito tracking-tight font-extrabold text-primary-500 dark:text-primary-400 mb-1 sm:mb-2 md:mb-3">
                Reset Your Password
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">
                {resetSent
                  ? `We've sent the password reset instructions to your ${resetMethod}`
                  : "Enter your phone number or email address to reset your password"}
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
            {resetSent ? (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center px-4 py-6 bg-primary-100/60 dark:bg-blue-900/20 rounded-xl mb-6"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto flex items-center justify-center h-14 w-20 rounded-xl bg-blue-100 dark:bg-blue-800/30 mb-3"
                  >
                    {resetMethod === "email" ? (
                      <TbMailFilled className="h-8 w-8 text-primary-600 dark:text-blue-400" />
                    ) : (
                      <TbPhone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    )}
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg font-bold font-geist text-gray-600 dark:text-white"
                  >
                    {resetMethod === "email"
                      ? "Check your email"
                      : "Check your phone"}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    Your password reset instructions have been sent to{" "}
                    <span className="font-medium">{resetIdentifier}</span>
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    {resetMethod === "email"
                      ? "If you don't see the email, check your spam folder."
                      : "If you don't receive the SMS, make sure your phone number is correct."}
                  </motion.p>
                </motion.div>
                {resetSent ? (
                  <Link
                    to="/login"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                  >
                    Return to Login
                  </Link>
                ) : (
                  <div>
                    <p></p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mx-1 sm:mx-4">
                  <ForgotPasswordForm onSubmitSuccess={handleSubmitSuccess} />
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="text-[0.83rem] sm:text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 inline-flex items-center"
                  >
                    <FiArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </>
            )}
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

export default ForgotPasswordPage;
