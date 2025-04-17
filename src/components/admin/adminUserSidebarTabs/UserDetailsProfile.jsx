import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, formatDateForInput } from "../../../utils/formatDate";
import {
  TbCalendarDot,
  TbCash,
  TbClockCheck,
  TbEdit,
  TbTrash,
} from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";
import { PiUserDuotone } from "react-icons/pi";
import {
  updateUser,
  addUserInsurance,
  updateUserInsurance,
  getUserById,
} from "../../../services/userService";
import { FaSave } from "react-icons/fa";

const UserDetailsProfile = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Set up form data with all User model fields
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    otherNames: user?.otherNames || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || user?.phone || "",
    idNumber: user?.idNumber || "",
    gender: user?.gender || "",
    county: user?.county || "",
    sacco: user?.sacco || "",
    route: user?.route || "",
    membershipStatus: user?.membershipStatus || "pending",
  });

  // Get the user's full name
  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}${
          user.otherNames ? ` ${user.otherNames}` : ""
        }`
      : user?.name || "Unknown User";

  // Get insurance coverage data
  const insuranceCoverage = user?.insuranceCoverage || null;
  const plan = insuranceCoverage?.plan || user?.plan || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    // Initialize form data with current user data
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      otherNames: user?.otherNames || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || user?.phone || "",
      idNumber: user?.idNumber || "",
      gender: user?.gender || "",
      county: user?.county || "",
      sacco: user?.sacco || "",
      route: user?.route || "",
      membershipStatus: user?.membershipStatus || "pending",
    });

    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call API to update user
      const response = await updateUser(user.id, formData);

      if (response.success) {
        setSuccess("User details updated successfully");
        setIsEditing(false);

        // Refetch user details after successful update
        const updatedUserResponse = await getUserById(user.id);
        if (updatedUserResponse.success && updatedUserResponse.data) {
          // If onUserUpdate function is provided, call it with updated user data
          if (typeof onUserUpdate === "function") {
            onUserUpdate(updatedUserResponse.data);
          }
        }
      }
    } catch (error) {
      setError(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const getPlanStatusClass = (status) => {
    if (!status)
      return "bg-gray-100 border border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 border border-green-300 dark:bg-green-900/30 dark:border-green-800 text-green-600 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 border border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400";
      case "pending":
        return "bg-amber-100 border border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-200";
      case "expired":
        return "bg-red-100 border border-red-300 dark:bg-red-900/30 dark:border-red-800 text-red-600 dark:text-red-300";
      default:
        return "bg-gray-100 border border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400";
    }
  };

  const formatPaymentFrequency = (frequency) => {
    if (!frequency) return "N/A";

    switch (frequency.toLowerCase()) {
      case "daily":
        return "Daily";
      case "monthly":
        return "Monthly";
      case "annual":
        return "Annual";
      default:
        return frequency;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-400 p-4 dark:bg-red-900/20 dark:border-red-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-400 p-4 dark:bg-green-900/20 dark:border-green-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-amber-800 dark:text-white flex items-center">
          <PiUserDuotone className="mr-2 h-5 w-5 text-amber-700" />
          Personal Information
        </h2>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="flex items-center pr-6 text-sm text-admin-600 hover:text-admin-700 dark:text-admin-400 dark:hover:text-admin-300"
          >
            <TbEdit className="mr-1 h-5 w-5" />
            Edit
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Full Name
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {fullName}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  ID Number
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.idNumber || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.email || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Phone Number
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.phoneNumber || user?.phone || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Gender
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100 capitalize">
                  {user?.gender || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Membership Status
                </dt>
                <dd className="mt-1">
                  <span
                    className={`px-5 py-1 text-xs font-medium rounded-full ${getPlanStatusClass(
                      user?.membershipStatus
                    )}`}
                  >
                    {user?.membershipStatus || "pending"}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Membership Number
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.membershipNumber || "Not assigned"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Membership Date
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.membershipDate
                    ? formatDate(user.membershipDate)
                    : "Not assigned"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  County
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.county || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  SACCO
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.sacco || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm  text-gray-400 dark:text-gray-500">
                  Route
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-100">
                  {user?.route || "N/A"}
                </dd>
              </div>
              
            </dl>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="otherNames"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Other Names
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="otherNames"
                    id="otherNames"
                    value={formData.otherNames}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  ID Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="idNumber"
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="county"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  County
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="county"
                    id="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="sacco"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  SACCO
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sacco"
                    id="sacco"
                    value={formData.sacco}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="route"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Route
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="route"
                    id="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="membershipStatus"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Membership Status
                </label>
                <div className="mt-1">
                  <select
                    id="membershipStatus"
                    name="membershipStatus"
                    value={formData.membershipStatus}
                    onChange={handleInputChange}
                    className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50"
            >
              {loading ? (
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
                  <FaSave className="mr-1.5 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Insurance Plans Section */}
      <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-secondary-800/90 ">
            <MdHealthAndSafety className="h-6 w-6" />
            <span className="">Medical Cover Plan</span>
          </h2>

          {!plan && (
            <button
              // onClick={handleAddPlan}
              className="inline-flex items-center px-3 py-1.5 border border-green-500 text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20 rounded-lg text-sm font-medium shadow-sm"
            >
              <FiPlus className="mr-1.5 -ml-1 h-4 w-4" />
              Add Plan
            </button>
          )}
        </div>

        {/* Medical Cover Plan */}
        {insuranceCoverage || plan ? (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="px-2 py-4 sm:px-6 flex justify-between items-start bg-admin-100 dark:bg-admin-800/10">
              <div>
                <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex items-center">
                  {plan.name}
                  <span
                    className={`ml-2 px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanStatusClass(
                      insuranceCoverage?.status
                    )}`}
                  >
                    {insuranceCoverage?.status?.charAt(0).toUpperCase() +
                      insuranceCoverage?.status?.slice(1)}
                  </span>
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {/* //TODO: streamline provider details and policy number */}
                  {insuranceCoverage?.provider || "Crew Afya"}
                  {(insuranceCoverage?.policyNumber &&
                    ` • Policy #${insuranceCoverage?.policyNumber}`) ||
                    " • Policy #CWA-243567"}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">
                    {plan.forWho || "Matatu Drivers"}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  // onClick={() => handleEditPlan(plan)}
                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded-md text-gray-700 bg-white hover:bg-admin-100 focus:outline-none focus:ring-1 focus:ring-admin-500 focus:border-admin-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-admin-600"
                  title="Edit Plan"
                >
                  <TbEdit className="h-[1.1rem] w-[1.1rem]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePlan(plan.id)}
                  className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-xs rounded-md text-red-700 bg-white hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-800/30"
                  title="Delete Plan"
                >
                  <TbTrash className="h-[1.1rem] w-[1.1rem]" />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <TbCalendarDot className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    Coverage Period
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(insuranceCoverage?.startDate)} -{" "}
                    {formatDate(insuranceCoverage?.endDate)}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <TbClockCheck className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    Payment Frequency
                  </dt>
                  <dd className="mt-1 pl-4 text-sm text-gray-900 dark:text-white capitalize">
                    {formatPaymentFrequency(
                      insuranceCoverage?.paymentFrequency
                    )}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <TbCash className="mr-1 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    Cost (
                    {formatPaymentFrequency(
                      insuranceCoverage?.paymentFrequency
                    )}
                    )
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(insuranceCoverage?.cost || 8500)}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Other Payment Options
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    <div className="space-y-1">
                      {insuranceCoverage?.paymentFrequency !== "daily" &&
                        insuranceCoverage?.premiums?.daily && (
                          <div>
                            Daily:{" "}
                            {formatCurrency(
                              insuranceCoverage?.premiums.daily || 55
                            )}
                          </div>
                        )}
                      {insuranceCoverage?.paymentFrequency !== "monthly" &&
                        insuranceCoverage?.premiums?.monthly && (
                          <div>
                            Monthly:{" "}
                            {formatCurrency(
                              insuranceCoverage?.premiums.monthly || 1000
                            )}
                          </div>
                        )}
                      {insuranceCoverage?.paymentFrequency !== "annual" &&
                        insuranceCoverage?.premiums?.annual && (
                          <div>
                            Annual:{" "}
                            {formatCurrency(
                              insuranceCoverage?.premiums.annual || 100000
                            )}
                          </div>
                        )}
                    </div>
                  </dd>
                </div>

                {/* {plan.coverage && ( */}
                {plan.coverage || (
                  <div className="sm:col-span-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Coverage
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {plan.coverage || "N/A"}
                    </dd>
                  </div>
                )}

                {plan.benefits && plan.benefits.length > 0 && (
                  <div className="sm:col-span-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Benefits
                    </dt>
                    <dd className="mt-1">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {plan.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {benefit.name}:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                              {benefit.limit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700 mt-3 p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No insurance coverage found for this user.
            </p>
            <button
              onClick={() => {
                // Handle adding insurance here
                console.log("Add insurance for user:", user.id);
              }}
              className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
            >
              <FiPlus className="mr-1.5 -ml-1 h-4 w-4" />
              Add Insurance Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsProfile;
