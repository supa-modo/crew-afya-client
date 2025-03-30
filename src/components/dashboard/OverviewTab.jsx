import React from "react";
import { MdPayments } from "react-icons/md";
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
}) => {
  return (
    <div className="max-w-screen-2xl mx-auto md:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 pb-6 md:pb-3 border-b border-gray-300">
        {/* Main content area - 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6 px-2">
          <div className="">
            {/* Coverage Utilization */}
            <CoverageUtilization />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2 sm:space-y-3 md:space-y-6 md:mt-6">
          {/* Payment Schedule */}
          <PaymentSchedule
            nextPaymentDate={nextPaymentDate}
            userSubscription={userSubscription}
            handleOpenFrequencyModal={handleOpenFrequencyModal}
          />
        </div>
      </div>

      <div className="mt-6  overflow-hidden">
        {/* Recent Payments Section */}
        <div className="mt-4 ">
          <h3 className="text-base md:text-lg font-semibold text-green-700 pl-4 mb-1.5 flex items-center">
            <MdPayments className="mr-2 h-6 w-6 text-green-700" />
            Recent Payments
          </h3>
          <PaymentHistory />
        </div>

        
          {/* Documents Section */}
          <DocumentsSection
            documents={documents}
            isLoadingDocs={isLoadingDocs}
            handleDeleteDocument={handleDeleteDocument}
            isSubmitting={isSubmitting}
          />
      </div>
    </div>
  );
};

export default OverviewTab;
