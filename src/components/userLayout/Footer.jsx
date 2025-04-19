import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { PiMapPinAreaDuotone, PiPhoneDuotone } from "react-icons/pi";
import { TbAddressBook, TbMailFilled } from "react-icons/tb";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gradient-to-br from-secondary-100/50 to-secondary-200/50 dark:bg-gradient-br dark:from-secondary-900/30 dark:to-secondary-700/30 border-t border-gray-200 dark:border-gray-700 relative"
      style={{ zIndex: "10" }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img
                className="h-12 w-auto mr-2"
                src="/mwulogo.png"
                alt="CrewAfya"
              />
              <span className="text-lg font-bold text-secondary-600">
                Matatu Workers Union
              </span>
            </Link>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Streamlining Union membership management, medical coverage, and
              loan applications all in one place.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-secondary-600"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-secondary-600"
              >
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
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-secondary-600"
              >
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

          {/* Services and Union sections - side by side on mobile */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Services
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/ussd"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    USSD Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin-login"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ussd"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/feedback"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Union
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faqs"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-gray-600 hover:text-secondary-600 hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-secondary-600">
                <Link
                  to="https://maps.app.goo.gl/1234567890"
                  className="flex items-center"
                >
                  <PiMapPinAreaDuotone className="mr-2 h-6 w-6 text-gray-400" />
                  <span>123 Insurance Street, Nairobi, Kenya</span>
                </Link>
              </li>
              <li className="text-sm flex items-center text-gray-600  dark:text-gray-400 ">
                <TbAddressBook className="mr-2 h-5 w-5 text-gray-400" />
                <span>P.O. Box 12345, Nairobi, Kenya</span>
              </li>
              <li className="text-sm text-gray-600 hover:text-secondary-600 hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-secondary-600">
                <Link to="tel:+254700000000" className="flex items-center">
                  <PiPhoneDuotone className="mr-2 h-5 w-5 text-gray-400" />
                  <span>+254 700 000 000</span>
                </Link>
              </li>
              <li className="text-sm text-gray-600 hover:text-secondary-600 hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-secondary-600">
                <Link
                  to="mailto:info@crewafya.com"
                  className="flex items-center"
                >
                  <TbMailFilled className="mr-2 h-5 w-5 text-gray-400" />
                  <span>info@crewafya.com</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img className="h-8 w-auto mr-2" src="/mwulogo.png" alt="CrewAfya" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} Matatu Wokers Union. All rights reserved.
            </span>
          </div>
          <div className="mt-3 md:mt-0 flex space-x-6">
            <Link
              to="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-600"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
