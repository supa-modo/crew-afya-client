import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  FiShield,
  FiCreditCard,
  FiSmartphone,
  FiBarChart2,
  FiCheckCircle,
  FiChevronDown,
  FiUsers,
  FiClock,
  FiArrowRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animationVisible, setAnimationVisible] = useState({});

  // Handle scroll event for navbar transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Animation triggers for sections
      const sections = document.querySelectorAll(".animate-on-scroll");
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.75) {
          setAnimationVisible((prev) => ({ ...prev, [section.id]: true }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance features showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper function for authentication-aware navigation
  const handleAuthAwareNavigation = (e, path) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate(path);
    }
  };

  // Features data
  const features = [
    {
      icon: <FiShield className="h-8 w-8" />,
      title: "Insurance Coverage Tracking",
      description:
        "Real-time monitoring of your insurance coverage limits and usage with intuitive visualizations.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FiCreditCard className="h-8 w-8" />,
      title: "Easy Premium Payments",
      description:
        "Effortlessly pay your premiums via M-Pesa and other convenient payment methods with just a few taps.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FiSmartphone className="h-8 w-8" />,
      title: "USSD Access",
      description:
        "Access your account and make payments via USSD on any phone, even without internet connectivity.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FiBarChart2 className="h-8 w-8" />,
      title: "Payment Analytics",
      description:
        "Comprehensive visual analytics to track payment history and optimize your insurance spending.",
      color: "from-orange-500 to-orange-600",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content:
        "This platform has completely transformed how I manage my employees' health insurance payments. The tracking features and M-Pesa integration save me hours each month!",
      avatar: "/api/placeholder/100/100",
    },
    {
      name: "David Mwangi",
      role: "IT Professional",
      content:
        "The USSD feature is a game-changer for our remote team members. Everyone can manage their insurance regardless of smartphone access or internet connectivity.",
      avatar: "/api/placeholder/100/100",
    },
    {
      name: "Patricia Njeri",
      role: "Healthcare Administrator",
      content:
        "The detailed analytics have given us unprecedented visibility into our insurance spending patterns. We've optimized our coverage and saved significantly.",
      avatar: "/api/placeholder/100/100",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Navigation Bar - Transforms on scroll */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white dark:bg-gray-900 shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                HealthPay
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                About
              </Link>
              <div>
                {!isAuthenticated ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                      className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      Sign In
                    </button>
                    <Link
                      to="/register"
                      className="btn bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/dashboard"
                    className="btn bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-900 dark:text-white"
              >
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg p-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                About
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {!isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                      className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      Sign In
                    </button>
                    <Link
                      to="/register"
                      className="btn bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/dashboard"
                    className="btn bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium text-center"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Animated Elements */}
      <div className="pt-20 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800 dark:from-gray-900 dark:via-primary-900 dark:to-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 relative z-10">
              <div className="animate-fade-in-up">
                <span className="inline-block bg-primary-700/30 text-primary-200 px-4 py-1 rounded-full text-sm font-medium mb-6">
                  Simplify Insurance Management
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Modern Health Insurance{" "}
                  <span className="text-primary-300">Payment Platform</span>
                </h1>
                <p className="mt-6 text-xl text-primary-100 text-opacity-90 max-w-lg">
                  Manage your insurance premiums, track payments, and monitor
                  your coverage all in one intuitive platform built for modern
                  healthcare needs.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="btn bg-white text-primary-700 hover:bg-gray-100 hover:text-primary-800 px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}{" "}
                    <FiArrowRight className="ml-2" />
                  </Link>
                  {!isAuthenticated && (
                    <button
                      onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                      className="btn bg-primary-700 bg-opacity-30 backdrop-blur-sm border border-primary-500 text-white hover:bg-primary-600/40 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
                    >
                      See How It Works
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2 mt-10 md:mt-0 relative">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary-500 rounded-full filter blur-2xl opacity-20"></div>
              <div className="relative z-10 shadow-2xl rounded-2xl overflow-hidden transform perspective-1000 rotate-1">
                <img
                  src="/api/placeholder/600/400"
                  alt="Health Insurance Dashboard"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 to-transparent pointer-events-none"></div>
              </div>
              <div className="absolute top-1/4 -right-12 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl transform rotate-6 animate-float">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <FiCheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Payment Successful
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Insurance premium for March
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1/4 -left-12 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl transform -rotate-3 animate-float-delayed">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <FiShield className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Coverage Updated
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      85% of limit remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-24 bg-gradient-to-b from-transparent to-white dark:to-gray-900"></div>
      </div>

      {/* Trusted By Section */}
      <div className="py-12 bg-white dark:bg-gray-900" id="trusted-by-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-400">
              Trusted by leading organizations
            </h2>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-12 opacity-70">
              {/* Replace with actual logos */}
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div
        className="py-16 bg-gray-50 dark:bg-gray-800 animate-on-scroll"
        id="features-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform simplifies insurance management with intuitive tools
              designed for today's healthcare needs.
            </p>
          </div>

          <div className="md:flex md:items-start md:space-x-8">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                      activeFeature === index
                        ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                        : "bg-white dark:bg-gray-700 hover:shadow-md"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start">
                      <div
                        className={`${
                          activeFeature !== index
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-white"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div className="ml-4">
                        <h3
                          className={`text-lg font-semibold ${
                            activeFeature !== index
                              ? "text-gray-900 dark:text-white"
                              : "text-white"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={`mt-2 ${
                            activeFeature !== index
                              ? "text-gray-600 dark:text-gray-300"
                              : "text-white text-opacity-90"
                          }`}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-2/3 bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-2">
                {/* Feature showcase image/mockup - would be dynamic based on activeFeature */}
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-600 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <span className="text-lg">
                      Feature {activeFeature + 1} Preview
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {features[activeFeature].title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {features[activeFeature].description}
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/features"
                      className="text-primary-600 dark:text-primary-400 font-medium flex items-center"
                    >
                      Learn more about this feature{" "}
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div
        className="py-16 bg-white dark:bg-gray-900 animate-on-scroll"
        id="benefits-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We've designed our solution to address the unique challenges of
              healthcare insurance management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                User-Friendly Experience
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Intuitive interface designed for users of all technical
                abilities, making insurance management accessible to everyone.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                <FiClock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Time-Saving Automation
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Automated payment reminders and processing save hours of
                administrative work each month for both individuals and
                organizations.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Data-Driven Insights
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Comprehensive analytics help you understand your insurance usage
                patterns and optimize your coverage for maximum value.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        className="py-16 bg-gray-50 dark:bg-gray-800 animate-on-scroll"
        id="testimonials-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Don't just take our word for it - hear from some of our satisfied
              users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 animate-on-scroll"
        id="cta-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Simplify Your Insurance Management?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-3xl mx-auto">
            Join thousands of users who have transformed how they manage their
            healthcare insurance.
          </p>
          <div className="mt-10">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="btn bg-white text-primary-700 hover:bg-gray-100 hover:text-primary-800 px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}{" "}
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/testimonials"
                    className="text-gray-400 hover:text-white"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-gray-400 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-gray-400 hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-gray-400 hover:text-white">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/status" className="text-gray-400 hover:text-white">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compliance"
                    className="text-gray-400 hover:text-white"
                  >
                    Compliance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-gray-400 hover:text-white"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} HealthPay. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.75 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
