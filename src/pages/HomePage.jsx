import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiArrowRight, FiCheckCircle, FiActivity } from "react-icons/fi";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { PiChartLineUpDuotone, PiUserDuotone } from "react-icons/pi";
import {
  TbCalendarCheck,
  TbCreditCardFilled,
  TbFileText,
  TbLockSquareRounded,
  TbShieldHalfFilled,
} from "react-icons/tb";
import FeatureIcon from "../components/ui/FeatureIcon";
import ColorBar from "../components/ui/ColorBar";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700">
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
          <div className="absolute -top-24 -right-24 rounded-full w-64 h-64 bg-primary-500 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 rounded-full w-96 h-96 bg-secondary-500 opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 rounded-full w-80 h-80 bg-primary-400 opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:pb-48 md:pt-56 relative z-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-12 md:-mb-10 flex flex-col justify-end ">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight animate-fadeIn pt-10">
                Empowering
                <br />
                <span className="text-secondary-300 mr-1 sm:mr-2">Matatu Workers</span>
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
                    className="text-sm sm:text-base btn bg-white text-primary-700 hover:bg-gray-100 hover:text-primary-800 px-10 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                  >
                    Go to Your Dashboard <FiArrowRight className="ml-2" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/register")}
                      className="text-[0.8rem] sm:text-sm md:text-base btn bg-white text-primary-700 hover:bg-gray-100 hover:text-primary-800 px-5 md:px-8 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                    >
                      Join the Union <FiArrowRight className="ml-2" />
                    </button>
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                      className="text-[0.8rem] sm:text-sm md:text-base btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-5 md:px-9 py-3 font-medium rounded-lg flex items-center"
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
                          className="w-8 h-8 rounded-full border-2 border-white bg-primary-500 overflow-hidden flex items-center justify-center text-xs text-white"
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
                <div className="absolute -bottom-6 -left-6 bg-primary-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform">
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

                <div className="absolute -top-6 -right-6 bg-primary-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform">
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
      <div id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Union Benefits
            </h2>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-white">
              Comprehensive Support for Matatu Operators
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our union provides matatu operators with access to essential
              services including affordable loans, medical insurance, and
              supportive community resources.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <TbShieldHalfFilled className="h-6 w-6" />,
                title: "Medical Coverage",
                description:
                  "Access to affordable health insurance plans for you and your family with comprehensive benefits.",
                color: "primary",
              },
              {
                icon: <TbCreditCardFilled className="h-6 w-6" />,
                title: "Affordable Loans",
                description:
                  "Low-interest loans for emergency needs, vehicle improvements, and business expansion.",
                color: "red",
              },
              {
                icon: <MdOutlinePhoneIphone className="h-6 w-6" />,
                title: "USSD Access",
                description:
                  "Manage your membership, loans, and insurance via USSD on any feature phone.",
                color: "orange",
              },
              {
                icon: <PiChartLineUpDuotone className="h-6 w-6" />,
                title: "Financial Growth",
                description:
                  "Track your savings, loan repayments, and insurance contributions with detailed analytics.",
                color: "indigo",
              },
              {
                icon: <PiUserDuotone className="h-6 w-6" />,
                title: "Union Membership",
                description:
                  "Official recognition as a union member with representation and collective bargaining.",
                color: "purple",
              },
              {
                icon: <TbLockSquareRounded className="h-7 w-7" />,
                title: "Secure Transactions",
                description:
                  "Safe payment processing for dues, loan repayments, and insurance premiums via M-Pesa.",
                color: "blue",
              },
              {
                icon: <TbCalendarCheck className="h-6 w-6" />,
                title: "Flexible Payments",
                description:
                  "Set up daily, weekly, or monthly payment schedules for premiums and loan repayments.",
                color: "red",
              },
              {
                icon: <TbFileText className="h-6 w-6" />,
                title: "Documentation Support",
                description:
                  "Access and store important documents including membership certificates and loan agreements.",
                color: "pink",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <ColorBar color={feature.color} />
                <div className="py-4 px-3 sm:p-5 md:p-6">
                  <div className="flex items-center space-x-2 mb-1 sm:mb-2 md:mb-3 ">
                    <FeatureIcon icon={feature.icon} color={feature.color} />
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className=" text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 ">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Membership Process
            </h2>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 dark:text-white">
              How to Join & Benefit
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Becoming a member of our matatu workers union is simple and
              provides immediate access to benefits.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-primary-200 dark:bg-primary-900 hidden md:block"></div>

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
                  <div className="bg-primary-100 dark:bg-gray-700 rounded-xl shadow-lg p-6 z-10 relative h-full flex flex-col items-center text-center">
                    <div className="mb-2 w-16 h-16 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      {step.icon}
                    </div>
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white text-lg md:text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center">
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
      <div id="insurance-plans" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Medical Insurance
            </h2>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-white">
              Affordable Health Coverage Plans
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our carefully selected medical insurance plans
              designed specifically for matatu operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-transform hover:scale-105">
              <div className="bg-primary-500 p-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold">
                  Crew Afya Lite
                </h3>
                <p className="mt-1 text-primary-100">For Driver/Conductor</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-bold">KSh 24</span>
                  <span className="ml-1 text-sm">/day</span>
                </div>
                <p className="mt-1 text-sm text-primary-100">
                  or KSh 713/month (KSh 8,565/year)
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Inpatient Coverage: KSh 200,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Maternity: KSh 20,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Outpatient: Up to KSh 20,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Optical Coverage: KSh 5,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Accident Coverage: KSh 50,000</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {isAuthenticated ? "Select Plan" : "Join & Select"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-transform hover:scale-105">
              <div className="bg-secondary-500 p-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold">
                  Crew Afya - (Up to M+3)
                </h3>
                <p className="mt-1 text-secondary-100">
                  For Driver/Conductor + Dependents
                </p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-bold">KSh 55</span>
                  <span className="ml-1 text-sm">/day</span>
                </div>
                <p className="mt-1 text-sm text-secondary-100">
                  or KSh 1,661/month (KSh 19,933/year)
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Inpatient Coverage: KSh 200,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Maternity: KSh 20,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Outpatient: Up to KSh 20,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Covers Spouse & Up to 3 Children</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Individual Wellness Support Sessions</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="block w-full text-center bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {isAuthenticated ? "Select Plan" : "Join & Select"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Services Section */}
      <div id="loan-services" className="py-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Financial Support
            </h2>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-white">
              Union Loan Products
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access low-interest loans designed for matatu operators at various
              stages of business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Emergency Loan",
                amount: "KSh 50,000",
                interest: "10% p.a.",
                period: "Up to 6 months",
                eligibility: "Active membership for 3+ months",
                color: "red",
              },
              {
                title: "Vehicle Improvement",
                amount: "KSh 200,000",
                interest: "12% p.a.",
                period: "Up to 24 months",
                eligibility: "Active membership for 6+ months",
                color: "blue",
              },
              {
                title: "Business Expansion",
                amount: "KSh 500,000",
                interest: "14% p.a.",
                period: "Up to 36 months",
                eligibility:
                  "Active membership for 12+ months, good repayment history",
                color: "green",
              },
              {
                title: "Fleet Addition",
                amount: "KSh 1,000,000",
                interest: "15% p.a.",
                period: "Up to 48 months",
                eligibility:
                  "Active membership for 24+ months, collateral required",
                color: "purple",
              },
            ].map((loan, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-transform hover:scale-105"
              >
                <div className={`bg-${loan.color}-500 p-5 text-white`}>
                  <h3 className="text-lg sm:text-xl font-bold">{loan.title}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-xl sm:text-2xl font-bold">
                      {loan.amount}
                    </span>
                    <span className="ml-2 text-sm">max</span>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Interest Rate: {loan.interest}</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Repayment: {loan.period}</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">
                        Eligibility: {loan.eligibility}
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link
                      to={isAuthenticated ? "/loans" : "/register"}
                      className={`block w-full text-center bg-${loan.color}-500 hover:bg-${loan.color}-600 text-white py-2 px-4 rounded-lg font-medium`}
                    >
                      {isAuthenticated ? "Apply Now" : "Join to Apply"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Union Member Stories
            </h2>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-white">
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
      <div className="py-16 bg-primary-600">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Join the Matatu Workers Union Today
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
            Get access to affordable medical coverage, low-interest loans, and
            the security of being part of Kenya's largest matatu operators
            union.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="text-base sm:text-lg px-8 py-3 bg-white text-primary-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
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
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 dark:text-white">
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
