import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import {
  TbAlertTriangle,
  TbLockFilled,
  TbPhoneDone,
  TbShieldCheckFilled,
} from "react-icons/tb";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  PiIdentificationBadgeDuotone,
  PiPhoneListDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear form error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Update form error when auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  // OTP resend timer
  useEffect(() => {
    let interval;
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpResendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formError) {
      setFormError("");
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.idNumber) {
      setFormError("Please fill in all required fields");
      return false;
    }

    // Full name validation - must have at least first and last name
    const nameParts = formData.fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setFormError("Please enter your full name (first and last name)");
      return false;
    }

    // Email validation - only if email is provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormError("Please enter a valid email address or leave it blank");
        return false;
      }
    }

    // Phone validation (simple check for now)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setFormError("Please enter a valid phone number");
      return false;
    }

    // ID number validation (simple check for now)
    if (formData.idNumber.length < 5) {
      setFormError("Please enter a valid ID number");
      return false;
    }

    setFormError("");
    return true;
  };

  const validateStep2 = () => {
    // Check if OTP is complete
    if (otpCode.some((digit) => !digit)) {
      setFormError("Please enter the complete verification code");
      return false;
    }

    setFormError("");
    return true;
  };

  const validateStep3 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setFormError("Please fill in all fields");
      return false;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSendOtp = async () => {
    try {
      setIsSubmitting(true);
      setFormError("");

      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOtpSent(true);
      setOtpResendTimer(60); // 60 seconds countdown
      setIsSubmitting(false);

      // Focus the first OTP input
      setTimeout(() => {
        const firstInput = document.getElementById("otp-0");
        if (firstInput) firstInput.focus();
      }, 100);
    } catch (error) {
      setFormError("Failed to send verification code. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsSubmitting(true);
      setFormError("");

      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, any 6-digit code is valid
      setOtpVerified(true);
      setStep(3);
      setIsSubmitting(false);
    } catch (error) {
      setFormError("Invalid verification code. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);
      setFormError("");

      // Simulate OTP resending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOtpResendTimer(60); // Reset the timer
      setIsSubmitting(false);
    } catch (error) {
      setFormError("Failed to resend verification code. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      if (!otpSent) {
        handleSendOtp();
      }
    } else if (step === 2 && validateStep2()) {
      handleVerifyOtp();
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate final step
    if (!validateStep3()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      clearError();

      // Split the full name into parts
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      // If there are parts in between, combine them as otherNames
      let otherNames = null;
      if (nameParts.length > 2) {
        otherNames = nameParts.slice(1, nameParts.length - 1).join(" ");
      }

      const userData = {
        firstName,
        lastName,
        otherNames,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber,
        idNumber: formData.idNumber,
        password: formData.password,
      };

      await register(userData);

      // Navigate to login with success message
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please log in with your credentials.",
          type: "success",
        },
      });
    } catch (error) {
      // Error is already set in the auth context
      // and propagated to formError via the useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-4 overflow-hidden transition-all duration-300">
      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-1 sm:mx-3 bg-red-500/10 dark:bg-red-700/20 border border-red-500/30 rounded-lg p-3 mb-6 flex items-center gap-3"
        >
          <TbAlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-500 text-xs sm:text-sm">{formError}</p>
        </motion.div>
      )}

      <form
        onSubmit={
          step === 3
            ? handleSubmit
            : (e) => {
                e.preventDefault();
                handleNextStep();
              }
        }
        className="px-1 sm:px-3"
      >
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PiUserDuotone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="idNumber"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
              >
                ID Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PiIdentificationBadgeDuotone className="h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
                </div>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="Enter your ID number"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
              >
                Email Address(Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="example@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PiPhoneListDuotone className="h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="+254700000000"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                We'll send a verification code to this number
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 focus:outline-none focus:border-p focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <span>Continue</span>
              <FiArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center h-16 w-20 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary-500 dark:text-blue-400 mb-4">
                <TbShieldCheckFilled className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-600 dark:text-white">
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
                  className="w-10 h-12 sm:w-12 sm:h-14 text-gray-600 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
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
                className="flex-1 flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                disabled={isSubmitting}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <div className="flex items-center gap-2 justify-center">
                <TbPhoneDone className="h-6 w-6 text-green-600 " />
                <h3 className="text-lg font-semibold text-green-600 ">
                  Phone Number Verified
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Create a password to complete your registration
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <TbLockFilled className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <TbLockFilled className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                disabled={isSubmitting}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-[0.83rem] sm:text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
