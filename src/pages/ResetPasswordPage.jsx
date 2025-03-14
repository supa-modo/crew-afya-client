import { motion } from "framer-motion";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import { FiLock, FiShield } from "react-icons/fi";

const ResetPasswordPage = () => {
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

      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200 to-blue-200 dark:from-teal-800/30 dark:to-blue-800/30 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-200 to-purple-200 dark:from-blue-800/30 dark:to-purple-800/30 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* Security pattern background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern
            id="lock-pattern"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 20 h30 v20 h-30 v-20 M25 20 v-10 a10 10 0 0 0 -10 -10 a10 10 0 0 0 -10 10 v10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-500 dark:text-gray-400"
            />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#lock-pattern)"
          />
        </svg>
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
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Top security indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-2 bg-gradient-to-r from-teal-500 to-blue-500 origin-left"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-8 pb-6 text-center px-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white mb-4 shadow-lg relative"
            >
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 opacity-30 animate-pulse"
                style={{ animationDuration: "3s" }}
              ></div>
              <FiLock className="h-8 w-8" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400"
            >
              Reset Password
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-3 text-gray-600 dark:text-gray-300"
            >
              Set a new password for your CrewAfya account
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="px-8 pb-8"
          >
            <ResetPasswordForm />
          </motion.div>
        </motion.div>

        {/* Shield icon background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute -bottom-16 -right-16 text-teal-500/10 dark:text-teal-400/5 z-10"
        >
          <FiShield className="h-48 w-48" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
