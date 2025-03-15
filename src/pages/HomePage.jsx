import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiArrowRight, FiCheckCircle, FiActivity } from "react-icons/fi";
import { FcCellPhone } from "react-icons/fc";
import { PiChartLineUpDuotone, PiUserDuotone } from "react-icons/pi";
import {
  TbCalendarCheck,
  TbCreditCardFilled,
  TbFileText,
  TbLockSquareRounded,
  TbShieldHalfFilled,
} from "react-icons/tb";

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

  // Sample testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Healthcare Administrator",
      content:
        "This platform has completely transformed how we manage insurance payments. The tracking feature saved us countless hours of administrative work.",
      avatar: "/api/placeholder/48/48",
    },
    {
      name: "Michael Kimani",
      role: "Insurance Broker",
      content:
        "The integration with M-Pesa and the detailed analytics dashboard gives our clients unprecedented insight into their insurance spending.",
      avatar: "/api/placeholder/48/48",
    },
    {
      name: "Elizabeth Njeri",
      role: "HR Director",
      content:
        "The USSD functionality has been a game-changer for our staff members without smartphones, ensuring everyone has equal access to their healthcare benefits.",
      avatar: "/api/placeholder/48/48",
    },
  ];

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
        animateValue("counter-providers", 0, 100, 1000);
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
            src="/afya1.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
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
                Transform Your
                <br />
                <span className="text-secondary-300 mr-2">Health Coverage</span>
                Payment Experience & Management
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white text-opacity-90 max-w-2xl">
                Our comprehensive platform streamlines your medical cover
                management, making premium payments, coverage tracking, and
                financial planning seamless.
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
                      className="text-sm sm:text-base btn bg-white text-primary-700 hover:bg-gray-100 hover:text-primary-800 px-10 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                    >
                      Get Started <FiArrowRight className="ml-2" />
                    </button>
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                      className="text-sm sm:text-base btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-12 py-3 font-medium rounded-lg flex items-center"
                    >
                      Sign In
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
                      <span className="font-semibold">10,000+</span> users trust
                      our platform
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
                        Payment Complete
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Insurance premium paid
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
                        Coverage Active
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
                  Active Users
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  Managing their health coverage
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
                  Payments Processed
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  Secure transactions completed
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
                  Satisfaction Rate
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  From our subscribed members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Animations */}
      <div id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Features
            </h2>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-white">
              Everything You Need in One Place
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform provides you with all the tools to
              manage your health insurance payments and coverage effectively.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <TbShieldHalfFilled className="h-6 w-6" />,
                title: "Coverage Tracking",
                description:
                  "Monitor your insurance coverage limits and usage in real-time with detailed visualizations.",
                color: "primary",
              },
              {
                icon: <TbCreditCardFilled className="h-6 w-6" />,
                title: "Premium Payments",
                description:
                  "Pay your premiums easily using M-Pesa and track your payment history in one place.",
                color: "secondary",
              },
              {
                icon: <FcCellPhone className="h-6 w-6" />,
                title: "USSD Access",
                description:
                  "Access your account and make payments via USSD on any feature phone for universal access.",
                color: "primary",
              },
              {
                icon: <PiChartLineUpDuotone className="h-6 w-6" />,
                title: "Payment Analytics",
                description:
                  "Track your payment history and analyze your insurance spending with interactive charts.",
                color: "secondary",
              },
              {
                icon: <PiUserDuotone className="h-6 w-6" />,
                title: "User Profiles",
                description:
                  "Manage your personal details and upload required documents securely in your profile.",
                color: "secondary",
              },
              {
                icon: <TbLockSquareRounded className="h-7 w-7" />,
                title: "Secure Access",
                description:
                  "Multi-factor authentication and encryption ensure your financial data stays protected.",
                color: "primary",
              },
              {
                icon: <TbCalendarCheck className="h-6 w-6" />,
                title: "Scheduled Payments",
                description:
                  "Set up recurring payments on daily, weekly, or monthly schedules for your convenience.",
                color: "secondary",
              },
              {
                icon: <TbFileText className="h-6 w-6" />,
                title: "Insurance Documentation",
                description:
                  "Access and store all your insurance policy documents in one secure location.",
                color: "primary",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className={`h-1 bg-${feature.color}-500`}></div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div
                    className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-full w-12 h-12 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-2 sm:mb-3 md:mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
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
              Simple Process
            </h2>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform makes managing your health insurance payments as
              simple as possible.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-primary-200 dark:bg-primary-900 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  description:
                    "Sign up with your email or phone number and verify your identity with a one-time password.",
                  icon: <PiUserDuotone className="h-8 w-8" />,
                },
                {
                  step: "02",
                  title: "Choose Coverage",
                  description:
                    "Select your preferred insurance coverage type from our available options.",
                  icon: <TbShieldHalfFilled className="h-8 w-8" />,
                },
                {
                  step: "03",
                  title: "Set Up Payments",
                  description:
                    "Configure your payment schedule and link your preferred payment method.",
                  icon: <TbCreditCardFilled className="h-8 w-8" />,
                },
                {
                  step: "04",
                  title: "Monitor Coverage",
                  description:
                    "Track your coverage, payments, and account status through your personalized dashboard.",
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

      {/* Demo Video Section */}
      {/* <div
        id="demo-video"
        className="py-24 bg-gray-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary-400 uppercase tracking-wide">
              See It In Action
            </h2>
            <h2 className="mt-2 text-4xl font-bold text-white">
              Watch How Our Platform Works
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
              Get a quick overview of our platform's key features and how they
              can help you manage your health insurance.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 aspect-w-16 aspect-h-9 max-w-4xl mx-auto">
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-primary-700 transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-300">
                  Click to play demo video
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Testimonials Section */}
      {/* <div id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Testimonials
            </h2>
            <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from our satisfied users about how our platform has
              transformed their insurance management experience.
            </p>
          </div>

          <div className="relative">
            <div className="flex overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full">
                      <div className="flex items-center mb-6">
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                        "{testimonial.content}"
                      </p>
                      <div className="mt-6 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            // Navigation dots 
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeTestimonial === index
                      ? "bg-primary-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            // Navigation arrows 
            <div className="hidden md:block">
              <button
                onClick={() =>
                  setActiveTestimonial(Math.max(0, activeTestimonial - 1))
                }
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setActiveTestimonial(
                    Math.min(testimonials.length - 1, activeTestimonial + 1)
                  )
                }
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
          <div className="bg-white border border-gray-200  dark:border-gray-700 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Ready to transform your insurance management?
                </h2>
                <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">
                  Join thousands of users who are simplifying their health
                  insurance payments and coverage tracking.
                </p>
                <div className="mt-6 md:mt-8">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="btn btn-primary px-8 py-3 text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 border-l border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-500 to-secondary-600 dark:from-primary-700 dark:to-secondary-800 p-8 md:p-12 text-white">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Why Choose Us?
                </h3>
                <ul className="mt-3 md:mt-6 space-y-3 sm:space-y-4 ">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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
                    <span className="text-sm md:text-base">
                      Comprehensive medical insurance coverage tracking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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
                    <span className="text-sm md:text-base">
                      Secure payment processing via M-Pesa
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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
                    <span className="text-sm md:text-base">
                      Universal access through web and USSD
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
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
                    <span className="text-sm md:text-base">
                      Payment history tracking and analytics with statements
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
