import { PiUserDuotone } from "react-icons/pi";
import { TbUser, TbAlertTriangle } from "react-icons/tb";

const MembershipRequiredModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full mx-4 px-3 py-6 md:p-6">
        <div className="text-center mb-6">
          <div className="inline-flex mb-4">
            <TbAlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-500">
            Union Membership Required
          </h3>
          <p className="text-[0.83rem] sm:text-sm mt-2 text-gray-600 dark:text-gray-400">
            You need to complete your union membership registration before
            subscribing to a medical plan.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4 text-[0.83rem] sm:text-sm">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <PiUserDuotone className="mr-2 h-5 w-5" />
            Complete Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipRequiredModal;
