import React from "react";
import { MdPayments } from "react-icons/md";
import {
  TbFileReport,
  TbGraph,
  TbCalendarTime,
  TbFileUpload,
} from "react-icons/tb";
import CoverageUtilization from "./CoverageUtilization";
import PaymentSchedule from "./PaymentSchedule";
import PaymentHistory from "../payment/PaymentHistory";
import DocumentsSection from "./DocumentsSection";

const OverviewTab = ({
  nextPaymentDate,
  userSubscription,
  handleOpenFrequencyModal,
  documents,
  isLoadingDocs,
  handleDeleteDocument,
  isSubmitting,
  isLoadingCoverage,
  onViewReceipt,
  coverageUtilizationData,
}) => {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {/* Main content area - 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="px-1 sm:px-3 md:px-4">
            <div className="">
              <h3 className="text-[0.9rem] sm:text-base font-semibold text-gray-600 dark:text-primary-400 flex items-center">
                <TbGraph className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                <span className="">Medical Coverage Utilization</span>
              </h3>
            </div>
            <div className="py-4">
              {/* Coverage Utilization */}
              <CoverageUtilization
                loading={isLoadingCoverage}
                coverageData={coverageUtilizationData}
                skipFetch={true}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Payment Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-20 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-amber-800 dark:text-amber-400 flex items-center">
                <TbCalendarTime className="mr-2 h-5 w-5" />
                Payment Schedule
              </h3>
            </div>
            <div className="p-3 sm:p-4">
              <PaymentSchedule
                nextPaymentDate={nextPaymentDate}
                userSubscription={userSubscription}
                handleOpenFrequencyModal={handleOpenFrequencyModal}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8  overflow-hidden">
        {/* Recent Payments Section */}
        <div className=" ">
          <PaymentHistory
            title="Recent Payments"
            onViewReceipt={onViewReceipt}
          />
        </div>

        {/* Documents Section */}
        {/* <DocumentsSection
          documents={documents}
          isLoadingDocs={isLoadingDocs}
          handleDeleteDocument={handleDeleteDocument}
          isSubmitting={isSubmitting}
        /> */}
      </div>
    </div>
  );
};

export default OverviewTab;
