import { motion } from "framer-motion";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
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
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-100/40 to-blue-100/30 dark:from-cyan-800/20 dark:to-blue-800/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 sm:translate-x-1/3 sm:-translate-y-1/3"></div>
        <div className="absolute -bottom-12 -left-12 sm:-bottom-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-teal-100/30 to-blue-100/20 dark:from-teal-800/20 dark:to-blue-800/10 rounded-full blur-3xl opacity-70"></div>

        {/* Abstract medical-themed decorative elements  */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 border-4 border-secondary-200/30 dark:border-blue-700/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 sm:w-32 sm:h-32 border-2 border-teal-300/40 dark:border-teal-600/30 rounded-full"></div>

        {/* Medical pattern background */}
        <svg
          className="absolute bottom-16 sm:bottom-14 left-0 right-0 mx-auto w-3/4 sm:w-auto opacity-20 dark:opacity-10"
          width="400"
          height="50"
          viewBox="0 0 400 50"
        >
          <path
            d="M0,25 L50,25 L60,10 L70,40 L80,15 L90,25 L400,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary-500 dark:text-secondary-400"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-[38rem] z-20 mt-8 md:mt-16"
      >
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm  rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="px-8 pt-8 sm:pt-10 pb-2 text-center relative"
          >
            <div className="w-full">
              <img
                src="/mwulogo.png"
                alt="matatu-union-logo"
                className="w-20 h-20 md:w-28 md:h-28 mx-auto"
              />
            </div>
          </motion.div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-10 dark:bg-gray-800/50">
            <RegisterForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
