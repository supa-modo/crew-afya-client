import { TbUser, TbAlertTriangle } from "react-icons/tb";

const MembershipRequiredModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full mx-4 p-6">
        <div className="text-center mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 inline-flex rounded-full mb-4">
            <TbAlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Union Membership Required
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You need to complete your union membership registration before
            subscribing to a medical plan.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <TbUser className="mr-2 h-5 w-5" />
            Complete Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipRequiredModal;
