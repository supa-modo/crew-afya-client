import React from "react";
import {
  TbHeadset,
  TbPhone,
  TbMail,
  TbMessageCircle,
  TbBrandWhatsapp,
} from "react-icons/tb";
import { Link } from "react-router-dom";

const SupportSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-teal-600 p-4">
        <h3 className="text-white font-semibold flex items-center">
          <TbHeadset className="mr-2 h-5 w-5" />
          Support Center
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-full mr-3">
              <TbPhone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Phone Support
              </p>
              <a
                href="tel:+254712345678"
                className="text-sm font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
              >
                +254 712 345 678
              </a>
            </div>
          </div>

          <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-full mr-3">
              <TbMail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Email Support
              </p>
              <a
                href="mailto:support@matatuunion.co.ke"
                className="text-sm font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
              >
                support@matatuunion.co.ke
              </a>
            </div>
          </div>

          <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-full mr-3">
              <TbBrandWhatsapp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                WhatsApp
              </p>
              <a
                href="https://wa.me/254712345678"
                className="text-sm font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
              >
                +254 712 345 678
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/help"
            className="block w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-center rounded-lg text-sm font-medium transition-colors"
          >
            <TbMessageCircle className="inline-block mr-2 h-4 w-4" />
            Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
