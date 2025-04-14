import React from "react";
import { TbShieldCheckFilled, TbCheckCircle } from "react-icons/tb";

/**
 * A modern health insurance card component that displays insurance information
 * in a visually appealing and premium design
 */
const InsuranceCardUI = ({ userData }) => {
  // Default values in case data is not provided
  const shaNumber = userData?.shaNumber || "CR5438977463515-2";
  const name = userData?.fullName || "John Doe";
  const phcStatus = userData?.phcStatus || "Valid";
  const shifStatus = userData?.shifStatus || "Inactive";
  const eccifStatus = userData?.eccifStatus || "Valid";

  // Function to render status indicator
  const renderStatus = (status) => {
    const isActive = status.toLowerCase() === "valid";
    return (
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            isActive ? "bg-green-500" : "bg-amber-500"
          }`}
        ></div>
        <span
          className={`text-xs ${
            isActive ? "text-green-600" : "text-amber-600"
          }`}
        >
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden">
      <div className="p-1 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-600 shadow-lg">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Card header with title */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm text-gray-600">
              Access and manage your health insurance cover(s).
            </h3>
          </div>

          {/* Main card content */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg mx-2 my-3 shadow-inner">
            {/* Insurance logo and branding */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary-600 rounded-md flex items-center justify-center">
                  <TbShieldCheckFilled className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-primary-600 font-bold text-xl">
                    SHA
                  </span>
                  <span className="text-xs text-gray-500">
                    Social Health Authority
                  </span>
                </div>
              </div>
              <div className="text-xs text-secondary-600 italic">
                Bima Bora, Afya Nyumbani
              </div>
            </div>

            {/* SHA Number */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">SHA Number</div>
              <div className="text-base font-mono font-medium">{shaNumber}</div>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  PHC
                </div>
                {renderStatus(phcStatus)}
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  SHIF
                </div>
                {renderStatus(shifStatus)}
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  ECCIF
                </div>
                {renderStatus(eccifStatus)}
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Valid through: 31/12/2025
            </div>
            <div className="flex items-center text-xs text-primary-600">
              <TbCheckCircle className="h-4 w-4 mr-1" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCardUI;
