
import { FaSave } from "react-icons/fa";
import { MdCardMembership } from "react-icons/md";
import { PiMapPinAreaDuotone, PiUserDuotone } from "react-icons/pi";
import { RiUserCommunityLine } from "react-icons/ri";
import { TbIdBadge, TbIdBadge2, TbMailFilled, TbPhone } from "react-icons/tb";

const PersonalInfoTab = ({
  formData,
  isEditing,
  setIsEditing,
  isSubmitting,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6 flex justify-between items-center">
        <h2 className="text-base sm:text-xl font-semibold text-secondary-700 dark:text-secondary-500">
          Personal Information
        </h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 sm:px-4 py-2 rounded-md text-[0.8rem] sm:text-sm font-medium ${
            isEditing
              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 border border-gray-300"
              : "bg-secondary-100 dark:bg-secondary-700/40 text-secondary-700 dark:text-secondary-400 hover:bg-secondary-100 border border-secondary-400"
          }`}
        >
          {isEditing ? "Cancel" : "Edit Information"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Name fields */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row space-x-3 w-full">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
                >
                  First Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiUserDuotone className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                        : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
                >
                  Last Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiUserDuotone className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                        : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Other names */}
            <div className="w-full">
              <label
                htmlFor="otherNames"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                Other Names
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiUserDuotone className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="otherNames"
                  name="otherNames"
                  value={formData.otherNames || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                    isEditing
                      ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                      : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbMailFilled className="h-5 w-5  text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                    isEditing
                      ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                      : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                Phone Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbPhone className="h-5 w-5  text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                    isEditing
                      ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                      : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          
          {/* County, Sacco and Route */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-row gap-3 w-full">
            <div className="w-full"> 
              <label
                htmlFor="county"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                County
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiMapPinAreaDuotone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                    isEditing
                      ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                      : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="sacco"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                SACCO
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiUserCommunityLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="sacco"
                  name="sacco"
                  value={formData.sacco || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                    isEditing
                      ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                      : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
            </div>
         

            <div className="w-full">
              <label
                htmlFor="route"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                Route
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiMapPinAreaDuotone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="route"
                  name="route"
                  value={formData.route || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 sm:text-sm font-medium focus:outline-none border rounded-md ${
                    isEditing
                      ? "border-gray-300 dark:border-gray-500 focus:ring-secondary-500 focus:border-secondary-500"
                      : " border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ID Number and Membership Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="idNumber"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                ID Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbIdBadge2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber || ""}
                  disabled={true}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed sm:text-sm font-medium focus:outline-none border rounded-md`}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                ID Number cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="membershipNumber"
                className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
              >
                Membership Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbIdBadge className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="membershipNumber"
                  name="membershipNumber"
                  value={formData.membershipNumber || ""}
                  disabled={true}
                  className={`block w-full pl-10 pr-3 py-2 text-[0.83rem] bg-gray-50 dark:bg-gray-700  border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed sm:text-sm font-medium focus:outline-none border rounded-md
                    `}
                />
              </div>
            </div>
          </div>

          {/* Membership Status */}
          <div>
            <label
              htmlFor="membershipStatus"
              className="block text-[0.8rem] sm:text-[0.85rem] font-medium text-gray-500 mb-1"
            >
              Membership Status
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdCardMembership className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="membershipStatus"
                name="membershipStatus"
                value={(formData.membershipStatus || "").toUpperCase()}
                disabled={true}
                className={`block w-full pl-10 pr-3 py-2 text-[0.8rem] sm:text-[0.85rem] font-medium border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed ${
                  formData.membershipStatus === "active"
                    ? "text-green-600 font-medium"
                    : ""
                }`}
              />
            </div>
            {formData.membershipStatus !== "active" && (
              <p className="mt-1 text-xs text-yellow-600">
                Please pay your membership fee to activate your account
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-[0.8rem] sm:text-sm font-medium text-white bg-secondary-700 hover:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoTab;
