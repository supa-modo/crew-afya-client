import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
} from "react-icons/fi";
import { TbBuildingBank, TbCreditCardPay, TbHeartHandshake, TbShieldCheck, TbShieldHalfFilled, TbShieldHeart } from "react-icons/tb";
import { PiUsersDuotone } from "react-icons/pi";

const AboutUsPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 lg:pt-20">
      {/* Hero Section */}
      <div className="h-[16rem] lg:h-full relative overflow-hidden bg-gradient-to-r from-primary-600/95 via-primary-700 to-secondary-800">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/matwana.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-20 backdrop-blur-[1px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-white mb-2 lg:mb-6">
              About <span className="text-secondary-400">Matatu Workers Union</span>
            </h1>
            <p className="text-base md:text-xl lg:text-xl text-white/90 max-w-3xl mx-auto">
              Empowering Kenyan matatu workers through comprehensive healthcare solutions, 
              financial services, and a supportive community.
            </p>
          </motion.div>
        </div>

        
      </div>

      {/* Our Mission Section */}
      <section className="py-8 lg:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 lg:mb-16"
          >
            <h2 className="text-xl lg:text-3xl font-bold text-secondary-700 dark:text-white mb-2 lg:mb-4">
              Our Mission
            </h2>
            <div className="w-24 h-0.5 lg:h-1 bg-secondary-600 mx-auto mb-3 lg:mb-6"></div>
            <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              At MWU Kenya, we're dedicated to improving the lives of matatu workers by providing 
              accessible healthcare solutions, financial stability, and a sense of community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-md border-b-4 border-primary-500"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2 lg:mb-6 mx-auto">
                <TbShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-base lg:text-xl font-bold text-gray-600 dark:text-white text-center mb-2 lg:mb-4">
                Healthcare Access
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 text-center">
                Providing affordable and comprehensive healthcare coverage through <span className="font-medium text-secondary-600">CrewAfya Health Insurance</span> - tailored to the unique needs 
                of matatu workers and their families.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-md border-b-4 border-primary-500"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2 lg:mb-6 mx-auto">
                <TbBuildingBank className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-base lg:text-xl font-bold text-gray-600 dark:text-white text-center mb-2 lg:mb-4">
                Financial Empowerment
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 text-center">
                Offering financial services including loans, and financial literacy 
                education to promote economic stability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-md border-b-4 border-primary-500"
            >
              <div className="w-14 lg:w-16 h-14 lg:h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2 lg:mb-6 mx-auto">
                <TbHeartHandshake className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-base lg:text-xl font-bold text-gray-600 dark:text-white text-center mb-2 lg:mb-4">
                Community Building
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 text-center">
                Creating a supportive community where matatu workers can connect, share experiences, 
                and advocate for better working conditions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <h2 className="text-xl lg:text-3xl font-bold text-secondary-700 dark:text-white mb-2 lg:mb-4">
                Our Story
              </h2>
              <div className="w-24 h-0.5 lg:h-1 bg-secondary-600 mb-2 lg:mb-6"></div>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-2 lg:mb-6">
                Matatu Workers Union was founded with a simple yet powerful vision: to address the healthcare 
                challenges faced by matatu workers across Kenya. We recognized that these essential workers, 
                who keep our busy cities moving, often lacked access to quality healthcare and financial security.
              </p>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-2 lg:mb-6">
                What began as a small initiative has grown into a comprehensive platform serving thousands 
                of matatu operators. We've expanded our services to include not just healthcare coverage, 
                but also financial services, community support, and advocacy for better working conditions.
              </p>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Today, Matatu Workers Union stands as a testament to what's possible when we prioritize the wellbeing 
                of those who serve our communities every day.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-500/20 rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-500/20 rounded-lg"></div>
                <img 
                  src="/dash1.png" 
                  alt="CrewAfya Dashboard" 
                  className="w-full h-auto rounded-xl shadow-xl relative z-10" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 lg:mb-16"
          >
            <h2 className="text-xl lg:text-3xl font-bold text-primary-600 dark:text-white mb-2 lg:mb-4">
              How CrewAfya Works
            </h2>
            <div className="w-24 h-0.5 lg:h-1 bg-primary-500 mx-auto mb-2 lg:mb-6"></div>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is designed to be simple, accessible, and effective in meeting the needs 
              of matatu workers.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-md"
            >
              <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 lg:mb-4">
                <PiUsersDuotone className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-1 lg:mb-2">
                1. Join the Union
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Register as a member of the Matatu Workers Union to access all our services and benefits.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2 lg:mb-4">
                <TbShieldHalfFilled className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-1 lg:mb-2">
                2. Select Coverage
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Choose from our range of healthcare plans designed specifically for matatu workers.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2 lg:mb-4">
                <TbCreditCardPay className="w-6 sm:w-7 h-6 sm:h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-1 lg:mb-2">
                3. Make Payments
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Pay for your coverage through our secure and flexible payment options.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2 lg:mb-4">
                <TbShieldHeart className="w-6 sm:w-7 h-6 sm:h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-1 lg:mb-2">
                4. Access Benefits
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Enjoy comprehensive healthcare coverage, financial services, and community support.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 lg:mb-16"
          >
            <h2 className="text-xl lg:text-3xl font-bold text-secondary-700 dark:text-white mb-2 lg:mb-4">
              Our Core Values
            </h2>
            <div className="w-24 h-0.5 lg:h-1 bg-secondary-600 mx-auto mb-2 lg:mb-6"></div>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do at CrewAfya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 lg:w-12 h-9 lg:h-12 rounded-full bg-secondary-200 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-2">
                  Accessibility
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                  We believe that quality healthcare and financial services should be accessible to all 
                  matatu workers, regardless of their income level or location.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 lg:w-12 h-9 lg:h-12 rounded-full bg-secondary-200 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-2">
                  Transparency
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                  We operate with complete transparency in all our dealings, ensuring that our members 
                  understand exactly what they're getting and how our services work.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 lg:w-12 h-9 lg:h-12 rounded-full bg-secondary-200 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-2">
                  Community
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                  We foster a sense of community among matatu workers, creating spaces for connection, 
                  support, and collective action.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 lg:w-12 h-9 lg:h-12 rounded-full bg-secondary-200 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-bold text-primary-600 dark:text-white mb-2">
                  Innovation
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                  We continuously innovate to improve our services and address the evolving needs of 
                  matatu workers in a changing world.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700 dark:bg-gradient-r dark:from-primary-700/50 dark:to-secondary-700/50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-6">
              Join the CrewAfya Community Today
            </h2>
            <p className="text-sm lg:text-base text-white/90 max-w-3xl mx-auto mb-4 lg:mb-8">
              Take the first step towards better healthcare and financial security for you and your family.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 lg:gap-4 text-sm lg:text-base">
              <Link
                to="/register"
                className="btn bg-white text-secondary-700 hover:bg-gray-100 hover:text-secondary-800 px-8 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Join the Union
              </Link>
              <Link
                to="/support"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 font-medium rounded-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
