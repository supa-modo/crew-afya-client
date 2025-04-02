import React from "react";
import { TbPhone, TbAmbulance, TbHelpOctagon } from "react-icons/tb";

/**
 * Component for displaying emergency contacts and resources
 */
const EmergencyContactsCard = () => {
  const emergencyContacts = [
    {
      name: "24/7 Customer Support",
      phone: "+254 700 123 456",
      icon: <TbPhone className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Emergency Ambulance",
      phone: "+254 700 789 012",
      icon: <TbAmbulance className="h-5 w-5 text-red-500" />,
    },
    {
      name: "Claims Assistance",
      phone: "+254 700 345 678",
      icon: <TbHelpOctagon className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
        <h3 className="text-white font-semibold flex items-center">
          <TbPhone className="mr-2 h-5 w-5" />
          Emergency Contacts
        </h3>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                {contact.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                  {contact.name}
                </h4>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Important Information
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc pl-4">
            <li>Always keep your membership ID ready when calling</li>
            <li>For emergencies, seek medical attention immediately</li>
            <li>Contact claims assistance within 48 hours of hospital admission</li>
            <li>Download the CrewAfya app for quick access to your digital ID card</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsCard;
