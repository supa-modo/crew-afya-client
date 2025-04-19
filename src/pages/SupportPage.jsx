import React, { useState } from "react";
import {
  TbMessageDots,
  TbHelpCircle,
  TbSearch,
  TbMailFilled,
  TbPhoneCall,
  TbChevronUp,
  TbChevronDown,
} from "react-icons/tb";
import { MdOutlineHealthAndSafety, MdOutlinePayments } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const SupportPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("help");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    subject: "",
    message: "",
    category: "payment",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Support request submitted:", formData);
    alert(
      "Your support request has been submitted. We'll get back to you soon!"
    );

    // Reset form (except for user details)
    setFormData({
      ...formData,
      subject: "",
      message: "",
      category: "payment",
    });
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      category: "general",
      question: "What is Crew Afya?",
      answer:
        "Crew Afya is a comprehensive healthcare insurance product designed specifically for matatu operators, providing affordable health insurance plans, easy claims processing, and health management tools.",
    },
    {
      category: "general",
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking the 'Sign Up' button on the homepage. You'll need to provide your basic information, contact details, and verify your identity as a matatu operator.",
    },
    {
      category: "payment",
      question: "What payment methods are accepted?",
      answer:
        "We currently accept M-Pesa as our secondary payment method. You can make payments through the app or via USSD by dialing our shortcode.",
    },
    {
      category: "payment",
      question: "My payment is not reflecting in my account",
      answer:
        "Payments typically reflect within 5-10 minutes. If your payment hasn't appeared after 30 minutes, please contact our support team with your transaction ID and we'll resolve the issue promptly.",
    },
    {
      category: "payment",
      question: "Can I change my payment frequency?",
      answer:
        "Yes, you can change your payment frequency (daily, weekly, or monthly) from your dashboard under the 'Payment Settings' section. Changes will take effect from your next billing cycle.",
    },
    {
      category: "insurance",
      question: "What does my insurance cover?",
      answer:
        "Your insurance coverage depends on your selected plan. Generally, our plans cover inpatient, outpatient, maternity, optical, and dental services. You can view your specific coverage details in your dashboard under 'Medical Cover'.",
    },
    {
      category: "insurance",
      question: "How do I make a claim?",
      answer:
        "You can submit a claim through your dashboard by navigating to 'Claims' and clicking 'Submit New Claim'. Fill in the required information about your medical service and submit. Our team will process your claim within 48 hours.",
    },
    {
      category: "insurance",
      question: "Which hospitals can I visit with my insurance?",
      answer:
        "Our insurance is accepted at a wide network of hospitals and clinics across Kenya. You can view the full list of partner facilities in your dashboard under 'Network Hospitals'.",
    },
    {
      category: "account",
      question: "How do I update my personal information?",
      answer:
        "You can update your personal information by going to your profile settings. Click on your profile picture in the top right corner and select 'Profile' to make changes to your personal details.",
    },
    {
      category: "account",
      question: "I forgot my password. How do I reset it?",
      answer:
        "You can reset your password by clicking 'Forgot Password' on the login page. We'll send a password reset link to your registered email address.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeTab === "help" || faq.category === activeTab) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-br from-gray-50/60 to-gray-100/60 dark:from-gray-900/60 dark:to-gray-800/60 min-h-screen py-[4rem] md:py-[5rem]">
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary-900 via-primary-700 to-primary-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/matwana.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative z-20 backdrop-blur-[1px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              How Can We Help You?
            </h1>
            <p className="text-secondary-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8">
              Find answers to common questions or reach out to our support team
              for assistance
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto relative">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200/40 dark:border-gray-700/40">
                <div className="pl-4">
                  <TbSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="w-full py-3 sm:py-3.5 px-4 text-sm sm:text-base focus:outline-none dark:bg-gray-800 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-1.5 sm:px-4 md:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="bg-gradient-to-r from-primary-600/5 to-primary-600/0 dark:from-primary-900/10 dark:to-primary-900/20 p-1 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab("help")}
                  className={`${
                    activeTab === "help"
                      ? "bg-primary-200 dark:bg-primary-900/80 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70"
                  } whitespace-nowrap py-2.5 sm:py-3 px-4 rounded-lg font-medium text-[0.8rem] sm:text-sm md:text-base flex items-center md:mr-1 transition-colors duration-200`}
                >
                  <TbHelpCircle className="mr-2 h-5 w-5" />
                  All Topics
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`${
                    activeTab === "payment"
                      ? "bg-primary-200 dark:bg-primary-900/80 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70"
                  } whitespace-nowrap py-2.5 sm:py-3 px-4 rounded-lg font-medium text-[0.8rem] sm:text-sm md:text-base flex items-center md:mr-1 transition-colors duration-200`}
                >
                  <MdOutlinePayments className="mr-2 h-5 w-5" />
                  Payments
                </button>
                <button
                  onClick={() => setActiveTab("insurance")}
                  className={`${
                    activeTab === "insurance"
                      ? "bg-primary-200 dark:bg-primary-900/80 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70"
                  } whitespace-nowrap py-2.5 sm:py-3 px-4 rounded-lg font-medium text-[0.8rem] sm:text-sm md:text-base flex items-center md:mr-1 transition-colors duration-200`}
                >
                  <MdOutlineHealthAndSafety className="mr-2 h-5 w-5" />
                  Insurance
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`${
                    activeTab === "account"
                      ? "bg-primary-200 dark:bg-primary-900/80 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70"
                  } whitespace-nowrap py-2.5 sm:py-3 px-4 rounded-lg font-medium text-[0.8rem] sm:text-sm md:text-base flex items-center md:mr-1 transition-colors duration-200`}
                >
                  <RiCustomerService2Line className="mr-2 h-5 w-5" />
                  Account
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 dark:from-amber-900/20 dark:to-amber-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-amber-800 dark:text-amber-400 ">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="p-3 sm:p-6">
                {filteredFaqs.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    <AnimatePresence>
                      {filteredFaqs.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                        >
                          <button
                            className="w-full flex justify-between items-center p-3 sm:p-4 text-left focus:outline-none bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => toggleFaq(index)}
                          >
                            <span className="text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-800 dark:text-white">
                              {faq.question}
                            </span>
                            {expandedFaq === index ? (
                              <TbChevronUp className="h-4 sm:h-5 w-4 sm:w-5 text-primary-500" />
                            ) : (
                              <TbChevronDown className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                            )}
                          </button>
                          <AnimatePresence>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-gray-600 dark:text-gray-300 text-[0.83rem] sm:text-sm md:text-base">
                                    {faq.answer}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No results found for "{searchQuery}". Try a different
                      search term or browse our help categories.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="bg-gradient-to-r from-primary-600/10 to-primary-600/5 dark:from-primary-900/20 dark:to-primary-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-primary-800 dark:text-primary-500 flex items-center">
                  <TbMessageDots className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Contact Support
                </h2>
              </div>

              <div className="p-3 sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-[0.83rem] sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-[0.83rem] sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-[0.83rem] sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Issue Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-[0.83rem] sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                      >
                        <option value="payment">Payment Issue</option>
                        <option value="insurance">Insurance Coverage</option>
                        <option value="claim">Claim Processing</option>
                        <option value="account">Account Management</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.83rem] sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-[0.83rem] sm:text-sm md:text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <TbMailFilled className="mr-2 -ml-1 h-5 w-5" />
                        Submit Request
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  We're here to help! If you have any questions or need
                  assistance, please don't hesitate to contact us.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TbMailFilled className="h-5 w-5 mr-3 text-primary-500" />
                    <span>support@crewafya.com</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TbPhoneCall className="h-5 w-5 mr-3 text-primary-500" />
                    <span>+254 700 123 456</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
