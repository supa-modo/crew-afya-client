import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiArrowRight,
  FiCheckCircle,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { MdOutlinePhoneIphone } from "react-icons/md";
import { PiChartLineUpDuotone, PiUserDuotone } from "react-icons/pi";
import {
  TbCalendarCheck,
  TbCreditCardFilled,
  TbFileText,
  TbLockSquareRounded,
  TbShieldHalfFilled,
} from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { getInsurancePlans } from "../services/insuranceService";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Monitor scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Authentication-aware navigation
  const handleAuthAwareNavigation = (e, path) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate(path);
    }
  };

  // Animation for counter
  const animateValue = (id, start, end, duration) => {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;

    const run = () => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - remaining * range);
      document.getElementById(id).innerHTML = value;
      if (value === end) {
        clearInterval(timer);
      }
    };

    timer = setInterval(run, stepTime);
    run();
  };

  // Trigger animation when component loads
  useEffect(() => {
    // Add a small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      const counterUsers = document.getElementById("counter-users");
      const counterPayments = document.getElementById("counter-payments");
      const counterProviders = document.getElementById("counter-providers");

      if (counterUsers) {
        animateValue("counter-users", 0, 10000, 1500);
      }

      if (counterPayments) {
        animateValue("counter-payments", 0, 500000, 2000);
      }

      if (counterProviders) {
        animateValue("counter-providers", 0, 85, 1000);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  // Fetch insurance plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getInsurancePlans();
        if (response && response.success && response.data) {
          setInsurancePlans(response.data);
        } else {
          setError("Failed to fetch insurance plans");
        }
      } catch (err) {
        console.error("Error fetching insurance plans:", err);
        setError("Failed to fetch insurance plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle carousel navigation
  const nextSlide = () => {
    if (insurancePlans.length <= 3) return;
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(insurancePlans.length / 3)
    );
  };

  const prevSlide = () => {
    if (insurancePlans.length <= 3) return;
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(insurancePlans.length / 3) - 1 : prev - 1
    );
  };

  // Calculate visible plans based on current slide
  const getVisiblePlans = () => {
    const startIndex = currentSlide * 3;
    return insurancePlans.slice(startIndex, startIndex + 3);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate daily, monthly, and yearly prices
  const calculatePrices = (price) => {
    const daily = parseFloat(price);
    const monthly = daily * 30;
    const yearly = daily * 365;

    return {
      daily: formatCurrency(daily),
      monthly: formatCurrency(monthly),
      yearly: formatCurrency(yearly),
    };
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600/95 via-primary-700 to-secondary-800">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/matwana.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute -top-24 -right-24 rounded-full w-64 h-64 bg-secondary-500 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 rounded-full w-96 h-96 bg-secondary-500 opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 rounded-full w-80 h-80 bg-secondary-400 opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:pb-48 md:pt-56 relative z-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-12 md:-mb-10 flex flex-col justify-end ">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight animate-fadeIn pt-10">
                Empowering
                <br />
                <span className="text-secondary-400 mr-1 sm:mr-2">
                  Matatu Workers
                </span>
                Through Unity & Benefits
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white text-opacity-90 max-w-2xl">
                Our comprehensive platform provides matatu operators with union
                membership management, affordable loan services, and quality
                medical insurance coverage, all in one place.
              </p>

              <div className="mt-8 flex space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm sm:text-base btn bg-white text-secondary-700 hover:bg-gray-100 hover:text-secondary-800 px-10 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                  >
                    Go to Your Dashboard <FiArrowRight className="ml-2" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/register")}
                      className="text-[0.8rem] sm:text-sm md:text-base btn bg-white text-secondary-700 hover:bg-gray-100 hover:text-secondary-800 px-5 md:px-8 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                    >
                      Join the Union <FiArrowRight className="ml-2" />
                    </button>
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                      className="text-[0.8rem] sm:text-sm md:text-base btn bg-transparent border-2 border-white text-white hover:bg-white/30 px-5 md:px-9 py-3 font-medium rounded-lg flex items-center"
                    >
                      Member Login
                    </button>
                  </>
                )}
              </div>

              <div className="mt-12 flex items-center space-x-8">
                {!isAuthenticated && (
                  <>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-secondary-500 overflow-hidden flex items-center justify-center text-xs text-white"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    <p className="text-white text-opacity-90">
                      <span className="font-semibold">10,000+</span> matatu
                      operators trust our union
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center md:justify-end sm:mb-8 md:mb-16">
              <div className="relative w-full max-w-2xl">
                {/* Dashboard preview image */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <img
                    src="/dash1.png"
                    alt="Dashboard preview"
                    className="w-full h-auto"
                  />
                </div>

                {/* Floating card elements */}
                <div className="absolute -bottom-6 -left-6 bg-secondary-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Membership Active
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Union dues paid successfully
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-secondary-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FiActivity className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Medical Cover Active
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expires in 30 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#F9FAFB"
              className="dark:fill-gray-900"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,58.7C840,64,960,96,1080,96C1200,96,1320,64,1380,48L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="pb-14 bg-white dark:bg-gray-900 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg px-8 py-6 border-b-4 border-primary-500">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span
                    className="text-primary-600 dark:text-primary-400 text-4xl font-bold"
                    id="counter-users"
                  >
                    0
                  </span>
                  <span className="ml-1 text-primary-600 dark:text-primary-400 text-2xl font-semibold">
                    +
                  </span>
                </div>

                <h3 className="mt-1  text-green-700 font-semibold dark:text-gray-300 ">
                  Registered Members
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  Active matatu operators in our union
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg px-8 py-6 border-b-4 border-primary-500">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span
                    className="text-primary-600 dark:text-primary-400 text-4xl font-bold"
                    id="counter-payments"
                  >
                    0
                  </span>
                  <span className="ml-1 text-primary-600 dark:text-primary-400 text-2xl font-semibold">
                    +
                  </span>
                </div>

                <h3 className="mt-1 text-green-700 font-semibold dark:text-gray-300 ">
                  Loans Disbursed
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  In KSh to matatu operators
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg px-8 py-6 border-b-4 border-primary-500">
              <div className="text-center">
                <div className="flex justify-center">
                  <span
                    className="text-primary-600 dark:text-primary-400 text-4xl font-bold"
                    id="counter-providers"
                  >
                    0
                  </span>
                  <span className="ml-1 text-primary-600 dark:text-primary-400 text-2xl font-semibold">
                    %
                  </span>
                </div>

                <h3 className="mt-1 text-green-700 font-semibold dark:text-gray-300 ">
                  Medical Coverage
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  Operators with active health insurance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Animations */}
      <div
        id="features"
        className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 dark:bg-secondary-900/20 rounded-full opacity-50 blur-3xl"></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block bg-secondary-100 dark:bg-secondary-900/30 rounded-full px-4 py-1.5 mb-4">
                <h2 className="text-sm sm:text-base font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">
                  Union Benefits
                </h2>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-600 dark:text-white">
                Comprehensive Support for{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  Matatu Operators
                </span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our union provides matatu operators with access to essential
                services including affordable healthcare, financial support, and
                community resources.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {/* Feature 1 - Medical Coverage */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary-500"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-5 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mb-2 text-secondary-600 dark:text-secondary-400 group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300">
                      <TbShieldHalfFilled className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white group-hover:text-secondary-500 dark:group-hover:text-secondary-400 transition-colors duration-300">
                      Medical Coverage
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base dark:text-gray-400 mb-6">
                    Access to affordable health insurance plans for you and your
                    family with comprehensive benefits including inpatient,
                    outpatient, and emergency care.
                  </p>
                  <Link
                    to="/payments"
                    className="inline-flex items-center text-sm sm:text-base text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-300 font-medium"
                  >
                    Explore Plans <FiArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Feature 2 - Flexible Payments */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-5 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                      <TbCalendarCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                      Flexible Payments
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base dark:text-gray-400 mb-6">
                    Set up daily, weekly, or monthly payment schedules for
                    premiums that fit your cash flow. Pay as little as KSh 24
                    per day for comprehensive coverage.
                  </p>
                  <Link
                    to="/payments"
                    className="inline-flex items-center text-sm sm:text-base text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 font-medium"
                  >
                    Payment Options <FiArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Feature 3 - USSD Access */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-5 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-2 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <MdOutlinePhoneIphone className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300">
                      USSD Access
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                    Manage your membership, payments, and insurance via USSD on
                    any feature phone. No smartphone or internet connection
                    required.
                  </p>
                  <div className="inline-flex items-center text-sm sm:text-base text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 font-medium">
                    Dial *123# <FiArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Feature 4 - Secure Transactions */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-5 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <TbLockSquareRounded className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Secure Transactions
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                    Safe payment processing for dues, loan repayments, and
                    insurance premiums via M-Pesa with instant confirmation.
                  </p>
                  <Link
                    to="/support"
                    className="inline-flex items-center text-sm sm:text-base text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-medium"
                  >
                    Learn More <FiArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Feature 5 - Union Membership */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-5 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                      <PiUserDuotone className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                      Union Membership
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base dark:text-gray-400 mb-6">
                    Official recognition as a union member with representation,
                    collective bargaining, and access to exclusive benefits.
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-sm sm:text-base text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-medium"
                  >
                    Join Now <FiArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Feature 6 - Financial Growth */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-5 mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-2 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      <PiChartLineUpDuotone className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      Financial Growth
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base dark:text-gray-400 mb-6">
                    Track your savings, insurance contributions, and financial
                    health with detailed analytics and personalized
                    recommendations.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center text-sm sm:text-base text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 font-medium"
                  >
                    View Dashboard <FiArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 ">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm sm:text-base font-semibold text-secondary-700 dark:text-secondary-400 uppercase tracking-wide">
              Membership Process
            </h2>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 dark:text-white">
              How to Join & Benefit
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Becoming a member of our matatu workers union is simple and
              provides immediate access to benefits.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-secondary-500 dark:bg-secondary-900 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Register as Member",
                  description:
                    "Sign up with your ID number, phone number, and route details to become an official union member.",
                  icon: <PiUserDuotone className="h-8 w-8" />,
                },
                {
                  step: "02",
                  title: "Select Your Benefits",
                  description:
                    "Choose from our loan products and medical insurance plans based on your needs and eligibility.",
                  icon: <TbShieldHalfFilled className="h-8 w-8" />,
                },
                {
                  step: "03",
                  title: "Set Up Payments",
                  description:
                    "Configure your payment schedule for union dues, loan repayments, and insurance premiums.",
                  icon: <TbCreditCardFilled className="h-8 w-8" />,
                },
                {
                  step: "04",
                  title: "Access Benefits",
                  description:
                    "Track your membership status, loan applications, and insurance coverage through your dashboard.",
                  icon: <PiChartLineUpDuotone className="h-8 w-8" />,
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-secondary-50 dark:bg-gray-700 border border-secondary-200/70 rounded-xl shadow-lg p-6 z-10 relative h-full flex flex-col items-center text-center">
                    <div className="mb-2 w-16 h-16 rounded-full bg-secondary-200 dark:bg-secondary-900 flex items-center justify-center text-secondary-600 dark:text-secondary-400">
                      {step.icon}
                    </div>
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-secondary-500 text-white text-lg md:text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center">
                      {step.step}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-700 dark:text-white mt-1 sm:mt-2 md:mt-4">
                      {step.title}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Plans Section */}
      <div
        id="insurance-plans"
        className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary-100 dark:bg-secondary-900/20 rounded-full opacity-50 blur-3xl"></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block bg-primary-100 dark:bg-primary-900/30 rounded-full px-4 py-1.5 mb-4">
                <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  Medical Insurance
                </h2>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-600 dark:text-white">
                Affordable Health{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  Coverage Plans
                </span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Choose from our carefully selected medical insurance plans
                designed specifically for matatu operators and their families.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : insurancePlans.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No insurance plans available at the moment. Please check back
                  later.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Carousel controls */}
                {insurancePlans.length > 3 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                      aria-label="Previous slide"
                    >
                      <FiChevronLeft className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                      aria-label="Next slide"
                    >
                      <FiChevronRight className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </button>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getVisiblePlans().map((plan, index) => {
                    const prices = calculatePrices(plan.dailyPrice || 24);
                    const isPremium =
                      plan.name.toLowerCase().includes("premium") ||
                      index === 1;
                    const isFamily =
                      plan.name.toLowerCase().includes("family") ||
                      plan.name.toLowerCase().includes("plus");

                    return (
                      <div
                        key={plan.id || index}
                        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                          isPremium
                            ? "ring-4 ring-secondary-500 dark:ring-secondary-400 ring-opacity-50"
                            : ""
                        }`}
                      >
                        {isPremium && (
                          <div className="absolute top-0 right-0 bg-secondary-500 text-white py-1 px-4 rounded-bl-lg font-medium text-sm">
                            Popular
                          </div>
                        )}
                        <div
                          className={`${
                            isPremium
                              ? "bg-secondary-600"
                              : isFamily
                              ? "bg-primary-600"
                              : "bg-blue-600"
                          } p-6 text-white`}
                        >
                          <h3 className="text-xl sm:text-2xl font-bold">
                            {plan.name || "Crew Afya Plan"}
                          </h3>
                          <p className="mt-1 text-secondary-100">
                            {plan.shortDescription ||
                              (isFamily
                                ? "For Driver/Conductor + Dependents"
                                : "For Driver/Conductor")}
                          </p>
                          <div className="mt-4 flex items-baseline">
                            <span className="text-2xl sm:text-3xl font-bold">
                              {prices.daily}
                            </span>
                            <span className="ml-1 text-sm">/day</span>
                          </div>
                          <p className="mt-1 text-sm text-secondary-100">
                            or {prices.monthly}/month ({prices.yearly}/year)
                          </p>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <IoMdCheckmarkCircleOutline className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>
                                Inpatient Coverage:{" "}
                                {formatCurrency(plan.inpatientLimit || 200000)}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <IoMdCheckmarkCircleOutline className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>
                                Outpatient: Up to{" "}
                                {formatCurrency(plan.outpatientLimit || 20000)}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <IoMdCheckmarkCircleOutline className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>
                                Maternity:{" "}
                                {formatCurrency(plan.maternityLimit || 20000)}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <IoMdCheckmarkCircleOutline className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>
                                Optical Coverage:{" "}
                                {formatCurrency(plan.opticalLimit || 5000)}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <IoMdCheckmarkCircleOutline className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>
                                {isFamily
                                  ? "Covers Spouse & Up to 3 Children"
                                  : "Accident Coverage: " +
                                    formatCurrency(plan.accidentLimit || 50000)}
                              </span>
                            </li>
                          </ul>
                          <div className="mt-6">
                            <Link
                              to={isAuthenticated ? "/dashboard" : "/register"}
                              className={`block w-full text-center ${
                                isPremium
                                  ? "bg-secondary-600 hover:bg-secondary-700"
                                  : isFamily
                                  ? "bg-primary-600 hover:bg-primary-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              } text-white py-2 px-4 rounded-lg font-medium`}
                            >
                              {isAuthenticated
                                ? "Select Plan"
                                : "Join & Select"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel indicators */}
                {insurancePlans.length > 3 && (
                  <div className="flex justify-center mt-8">
                    {Array.from({
                      length: Math.ceil(insurancePlans.length / 3),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 w-2 mx-1 rounded-full ${
                          currentSlide === index
                            ? "bg-primary-600 w-4"
                            : "bg-gray-300 dark:bg-gray-600"
                        } transition-all duration-300`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-sm sm:text-base font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">
              Union Member Stories
            </h2>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-primary-600 dark:text-white">
              What Our Members Say
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from matatu operators who have benefited from our union
              services and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Mwangi",
                role: "Matatu Driver, Route 125",
                image: "/testimonial1.jpg",
                quote:
                  "The union helped me access affordable medical coverage for my family. When my son got sick, I didn't have to worry about the hospital bills.",
              },
              {
                name: "Mary Kamau",
                role: "Matatu Owner, Nairobi East",
                image: "/testimonial2.jpg",
                quote:
                  "I took a vehicle improvement loan to upgrade my matatu's safety features. The low interest rate and flexible payment terms made it very manageable.",
              },
              {
                name: "David Ochieng",
                role: "Matatu Conductor, Route 58",
                image: "/testimonial3.jpg",
                quote:
                  "The USSD service is incredibly convenient. I can check my insurance status and make payments even when I'm on the road without a smartphone.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={testimonial.image || "/avatar-placeholder.png"}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-secondary-700">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Join the Matatu Workers Union Today
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-secondary-100 max-w-2xl mx-auto">
            Get access to affordable medical coverage, low-interest loans, and
            the security of being part of Kenya's largest matatu operators
            union.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="text-base sm:text-lg px-8 py-3 bg-white text-secondary-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
            >
              Register Now
            </Link>
            <Link
              to="/about"
              className="ml-4 text-base sm:text-lg px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm sm:text-base font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 dark:text-white">
              Common Questions About Our Union
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question:
                  "How do I become a member of the Matatu Workers Union?",
                answer:
                  "To become a member, you need to register with your ID number, phone number, and route details. You can register online through our website or via USSD by dialing *456*789#.",
              },
              {
                question: "What are the membership fees?",
                answer:
                  "The union charges a monthly membership fee of KSh 300, which can be paid daily, weekly, or monthly through M-Pesa. This fee gives you access to all union benefits including loan eligibility and representation.",
              },
              {
                question:
                  "How do I access medical insurance through the union?",
                answer:
                  "After becoming a member, you can select one of our medical insurance plans and set up your payment schedule. Coverage begins immediately after your first payment is processed.",
              },
              {
                question: "What types of loans does the union offer?",
                answer:
                  "We offer emergency loans (up to KSh 50,000), vehicle improvement loans (up to KSh 200,000), business expansion loans (up to KSh 500,000), and fleet addition loans (up to KSh 1,000,000), with interest rates ranging from 10% to 15% p.a.",
              },
              {
                question:
                  "How long does it take to process a loan application?",
                answer:
                  "Emergency loans are processed within 24 hours, while other loan types typically take 3-5 business days for approval and disbursement after all required documentation is submitted.",
              },
              {
                question:
                  "Can I manage my account if I don't have a smartphone?",
                answer:
                  "Yes, our USSD service allows you to register, check your membership status, view loan balances, check insurance coverage, and make payments using any mobile phone by dialing *456*789#.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
