import React from "react";
import { FiArrowRight, FiArrowLeft, FiLoader } from "react-icons/fi";
import { TbShieldCheckFilled } from "react-icons/tb";

const Step2PhoneVerification = ({
  formData,
  otpCode,
  handleOtpChange,
  handleOtpKeyDown,
  otpResendTimer,
  handleResendOtp,
  handlePrevStep,
  handleVerifyOtp,
  isSubmitting,
}) => {
  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center h-16 w-20 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-500 mb-4">
          <TbShieldCheckFilled className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold font-geist text-gray-700 dark:text-white">
          Verify Your Phone
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit code to {formData.phoneNumber}
        </p>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-3 mb-5">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={otpCode[index]}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-gray-600 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:ring-secondary-600 focus:border-secondary-600 dark:bg-gray-700 dark:text-white dark:focus:ring-secondary-600 dark:focus:border-secondary-600 transition-colors duration-200"
            required
            disabled={isSubmitting}
          />
        ))}
      </div>

      <div className="text-center mb-2">
        {otpResendTimer > 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resend code in{" "}
            <span className="font-medium">{otpResendTimer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isSubmitting}
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
          >
            Resend verification code
          </button>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex-1 flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
          disabled={isSubmitting}
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={isSubmitting}
          className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-600 dark:to-secondary-700 hover:from-secondary-600 hover:to-secondary-700 dark:hover:from-secondary-500 dark:hover:to-secondary-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-600 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Verifying...
            </div>
          ) : (
            <>
              Verify
              <FiArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step2PhoneVerification;
