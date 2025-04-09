import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbAlertTriangle, TbPhoneDone } from "react-icons/tb";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Import the new components
import Step1PersonalInfo from "./register-steps/Step1PersonalInfo";
import Step2PhoneVerification from "./register-steps/Step2PhoneVerification";
import Step3ProfileCompletion from "./register-steps/Step3ProfileCompletion";

// Kenyan counties list in order of priority (moved to constants file)
import { counties, nairobiRoutes } from "../../constants/locationData";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    county: "",
    sacco: "",
    route: "",
    gender: "",
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
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);
  const [countySearchTerm, setCountySearchTerm] = useState("");
  const [filteredCounties, setFilteredCounties] = useState(counties);
  const [routeDropdownOpen, setRouteDropdownOpen] = useState(false);
  const [routeSearchTerm, setRouteSearchTerm] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(nairobiRoutes);

  const countyDropdownRef = useRef(null);
  const routeDropdownRef = useRef(null);

  const {
    register,
    error: authError,
    clearError,
    sendOtp,
    verifyOtp,
  } = useAuth();
  const navigate = useNavigate();

  // Function to format phone number to international format
  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;

    // If it's likely an ID number (not a phone), return as is
    if (phone.length > 10 || isNaN(phone.replace(/\D/g, ""))) {
      return phone;
    }

    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // Handle Kenyan numbers
    if (cleaned.startsWith("0")) {
      // Convert 07xx or 01xx format to +254xxx
      return `+254${cleaned.substring(1)}`;
    } else if (
      (cleaned.startsWith("7") || cleaned.startsWith("1")) &&
      cleaned.length === 9
    ) {
      // Handle numbers without country code or leading zero (7xx or 1xx)
      return `+254${cleaned}`;
    } else if (cleaned.startsWith("254")) {
      // Already in international format, add + prefix
      return `+${cleaned}`;
    } else if (!cleaned.startsWith("254")) {
      // Any other format, add 254 prefix
      return `+254${cleaned}`;
    }

    return phone; // Return original if none of the conditions match
  };

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

  // Filter counties based on search term
  useEffect(() => {
    if (countySearchTerm) {
      const filtered = counties.filter((county) =>
        county.toLowerCase().includes(countySearchTerm.toLowerCase())
      );
      setFilteredCounties(filtered);
    } else {
      setFilteredCounties(counties);
    }
  }, [countySearchTerm]);

  // Filter routes based on search term
  useEffect(() => {
    if (routeSearchTerm) {
      const filtered = nairobiRoutes.filter((route) =>
        route.toLowerCase().includes(routeSearchTerm.toLowerCase())
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(nairobiRoutes);
    }
  }, [routeSearchTerm]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        countyDropdownRef.current &&
        !countyDropdownRef.current.contains(event.target)
      ) {
        setCountyDropdownOpen(false);
      }
      if (
        routeDropdownRef.current &&
        !routeDropdownRef.current.contains(event.target)
      ) {
        setRouteDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleCountySelect = (county) => {
    setFormData((prev) => ({
      ...prev,
      county,
      // Clear route if changing county from Nairobi
      route: county !== "Nairobi" ? "" : prev.route,
    }));
    setCountyDropdownOpen(false);
    setCountySearchTerm("");
  };

  const handleRouteSelect = (route) => {
    setFormData((prev) => ({
      ...prev,
      route,
    }));
    setRouteDropdownOpen(false);
    setRouteSearchTerm("");
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
    if (
      !formData.fullName ||
      !formData.gender ||
      !formData.phoneNumber ||
      !formData.idNumber
    ) {
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
    if (!formData.county || !formData.sacco) {
      setFormError("Please select your county and enter your SACCO");
      return false;
    }

    // If county is Nairobi, route is required
    if (formData.county === "Nairobi" && !formData.route) {
      setFormError("Please select your operating route in Nairobi");
      return false;
    }

    if (!formData.password || !formData.confirmPassword) {
      setFormError("Please create a password and confirm it");
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

      // Send OTP via API
      const response = await sendOtp(formData.phoneNumber);

      setOtpSent(true);
      setOtpResendTimer(60); // 60 seconds countdown

      // For development, automatically fill the OTP if it's returned
      if (response.data && response.data.otp) {
        const otpArray = response.data.otp.split("");
        setOtpCode(otpArray);
      }

      // Focus the first OTP input
      setTimeout(() => {
        const firstInput = document.getElementById("otp-0");
        if (firstInput) firstInput.focus();
      }, 100);
    } catch (error) {
      setFormError(
        error.message || "Failed to send verification code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsSubmitting(true);
      setFormError("");

      // Compile OTP code into a string
      const otpString = otpCode.join("");

      // Verify OTP via API
      // await verifyOtp(formData.phoneNumber, otpString);

      setOtpVerified(true);
      setStep(3);
    } catch (error) {
      setFormError(
        error.message || "Invalid verification code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);
      setFormError("");

      // Resend OTP via API
      await sendOtp(formData.phoneNumber);

      setOtpResendTimer(60); // Reset the timer
    } catch (error) {
      setFormError(
        error.message || "Failed to resend verification code. Please try again."
      );
    } finally {
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

      const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber);

      const userData = {
        firstName,
        lastName,
        otherNames,
        email: formData.email || null,
        phoneNumber: formattedPhoneNumber,
        idNumber: formData.idNumber,
        password: formData.password,
        county: formData.county,
        sacco: formData.sacco,
        route: formData.route,
        gender: formData.gender,
      };

      await register(userData);

      // Navigate to login with success message
      navigate("/login", {
        state: {
          message:
            "Registration successful! You are now a member of Matatu Workers Union. Log in to continue.",
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
    <div className="md:mx-1 overflow-hidden transition-all duration-300">
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

      {/* Show title and animated underline only on step 1 */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-lg sm:text-2xl font-bold text-secondary-600 dark:text-secondary-700 mb-1 sm:mb-2 md:mb-3">
            Create Your Account
          </h1>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-1 bg-gradient-to-r from-secondary-700 to-secondary-500 rounded-full mx-auto"
          ></motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-4"
      >
        <h2 className="text-base sm:text-lg font-semibold text-secondary-700 dark:text-secondary-500">
          {step === 1 ? (
            "Welcome to Matatu Workers Union"
          ) : step === 2 ? (
            "Verify Your Phone Number"
          ) : (
            <div className="text-center mb-2">
              <div className="flex items-center gap-2 justify-center">
                <TbPhoneDone className="h-6 w-6 text-secondary-600 " />
                <h3 className="text-lg font-semibold text-secondary-600 ">
                  Phone Number Verified
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Complete your profile and create a password
              </p>
            </div>
          )}
        </h2>
        <p className="text-gray-500/70 text-sm lg:text-base">
          {step === 1
            ? "Fill in your details below to register as a member"
            : ""}
        </p>
        <div className="flex justify-center items-center mt-3 space-x-1">
          <div
            className={`h-2 w-12 rounded-full ${
              step >= 1 ? "bg-secondary-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-12 rounded-full ${
              step >= 2 ? "bg-secondary-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-12 rounded-full ${
              step >= 3 ? "bg-secondary-600" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </motion.div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 3) {
            handleSubmit(e);
          } else {
            handleNextStep();
          }
        }}
        className="px-1"
      >
        {step === 1 && (
          <Step1PersonalInfo
            formData={formData}
            handleChange={handleChange}
            handleGenderSelect={handleGenderSelect}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && (
          <Step2PhoneVerification
            formData={formData}
            otpCode={otpCode}
            handleOtpChange={handleOtpChange}
            handleOtpKeyDown={handleOtpKeyDown}
            otpResendTimer={otpResendTimer}
            handleResendOtp={handleResendOtp}
            handlePrevStep={handlePrevStep}
            handleVerifyOtp={handleVerifyOtp}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <Step3ProfileCompletion
            formData={formData}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            countyDropdownRef={countyDropdownRef}
            countyDropdownOpen={countyDropdownOpen}
            setCountyDropdownOpen={setCountyDropdownOpen}
            countySearchTerm={countySearchTerm}
            setCountySearchTerm={setCountySearchTerm}
            filteredCounties={filteredCounties}
            handleCountySelect={handleCountySelect}
            routeDropdownRef={routeDropdownRef}
            routeDropdownOpen={routeDropdownOpen}
            setRouteDropdownOpen={setRouteDropdownOpen}
            routeSearchTerm={routeSearchTerm}
            setRouteSearchTerm={setRouteSearchTerm}
            filteredRoutes={filteredRoutes}
            handleRouteSelect={handleRouteSelect}
            handlePrevStep={handlePrevStep}
            isSubmitting={isSubmitting}
          />
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-[0.83rem] sm:text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-secondary-700 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
