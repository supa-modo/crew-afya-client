import React, { useState } from "react";
import {
  FiSave,
  FiPlus,
} from "react-icons/fi";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, formatDateForInput } from "../../../utils/formatDate";
import { TbCalendarDot, TbCash, TbClockCheck, TbEdit, TbShieldHalfFilled, TbTrash, TbUserEdit, TbUserX } from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";
import { PiUserDuotone } from "react-icons/pi";
const UserDetailsProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Get the user's plan with more detailed logging
  // Check for firstName to determine if we're using mockUsers format
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : user?.name;


  // Try to access user plan data directly
  let plan = user?.plan || null;

  // If plan is still null but we have user ID, try to get from mockUsers directly
  if (!plan && user?.id) {
    console.log(
      "Plan not found in user object, attempting to fetch from mockUsers"
    );
    try {
      // Dynamically import mockUsers to get the data directly
      import("../../../data/mockUsers")
        .then((module) => {
          const mockUsers = module.mockUsers;
          const userFromMock = mockUsers.find((u) => u.id === user.id);
          if (userFromMock?.plan) {
            console.log("Found plan in mockUsers:", userFromMock.plan);
            plan = userFromMock.plan;
            // Force component update
            setLoading(true);
            setTimeout(() => setLoading(false), 100);
          }
        })
        .catch((err) => console.error("Error importing mockUsers:", err));
    } catch (error) {
      console.error("Error accessing mockUsers:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating user profile with:", formData);

    // Simulating API call
    setTimeout(() => {
      setIsEditing(false);
      // In a real app, we would update the user state here
    }, 500);
  };

  // Helper function to get CSS class for plan status
  const getPlanStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "expired":
        return "bg-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "suspended":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  // Helper function to format payment frequency
  const formatPaymentFrequency = (frequency) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "monthly":
        return "Monthly";
      case "annual":
        return "Annual";
      default:
        return "Monthly";
    }
  };

  // Plan management handlers
  const handleAddPlan = () => {
    console.log("Add new plan");
    // Would open a modal or navigate to plan creation form
  };

  const handleEditPlan = (plan) => {
    console.log("Edit plan:", plan);
    // Would open a modal with plan details for editing
  };

  const handleDeletePlan = (planId) => {
    console.log("Delete plan with ID:", planId);
    // Would show confirmation dialog before deletion
  };

  return (
    <div className="py-6 px-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-secondary-800/90">
          <PiUserDuotone className="h-6 w-6" />
          <span className="">Profile Information</span>
        </h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center px-4 py-1.5 border ${
            isEditing
              ? "border-red-300 text-red-700 dark:border-red-600 dark:text-red-400 bg-white dark:bg-gray-800"
              : "border-secondary-700 text-secondary-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          } rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700`}
        >
          {isEditing ? (
            <>
              <TbUserX className="mr-1.5 -ml-1 h-5 w-5" />
              Cancel
            </>
          ) : (
            <>
              <TbUserEdit className="mr-1.5 -ml-1 h-5 w-5" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Display (Read-only view) */}
      {!isEditing && (
        <div className="mt-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Full Name
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {fullName || user?.name || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email Address
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {user?.email || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone Number
              </h3>
              <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-white">
                {user?.phone || user?.phoneNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Account Status
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                  {user?.status ||
                    (user?.isActive ? "active" : "inactive") ||
                    "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  User Role
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                  {user?.role || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Account Created
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Last Login
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(user?.lastLogin)}
                </p>
              </div>
            </div>
          </div>

          {/* Insurance Plans Section */}
          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-secondary-800/90 ">
                <MdHealthAndSafety className="h-6 w-6" />
                <span className="">Medical Cover Plan</span>
              </h2>

              {!plan && (
                <button
                  onClick={handleAddPlan}
                  className="inline-flex items-center px-3 py-1.5 border border-green-500 text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20 rounded-lg text-sm font-medium shadow-sm"
                >
                  <FiPlus className="mr-1.5 -ml-1 h-4 w-4" />
                  Add Plan
                </button>
              )}
            </div>

            {/* Medical Cover Plan */}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-600"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading plan...
                </span>
              </div>
            ) : plan ? (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-2 py-4 sm:px-6 flex justify-between items-start bg-admin-100 dark:bg-admin-800/10">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex items-center">
                      {plan.name}
                      <span
                        className={`ml-2 px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanStatusClass(
                          plan.status
                        )}`}
                      >
                        {plan.status?.charAt(0).toUpperCase() +
                          plan.status?.slice(1)}
                      </span>
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {plan.provider || "Crew Afya"}
                      {plan.policyNumber && ` • Policy #${plan.policyNumber}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{plan.forWho}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditPlan(plan)}
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
                        {formatDate(plan.startDate)} -{" "}
                        {formatDate(plan.endDate)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <TbClockCheck className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        Payment Frequency
                      </dt>
                      <dd className="mt-1 pl-4 text-sm text-gray-900 dark:text-white capitalize">
                        {formatPaymentFrequency(plan.paymentFrequency)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <TbCash className="mr-1 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        Cost ({formatPaymentFrequency(plan.paymentFrequency)})
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
                        {formatCurrency(plan.cost)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Other Payment Options
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          {plan.paymentFrequency !== "daily" &&
                            plan.premiums?.daily && (
                              <div>
                                Daily: {formatCurrency(plan.premiums.daily)}
                              </div>
                            )}
                          {plan.paymentFrequency !== "monthly" &&
                            plan.premiums?.monthly && (
                              <div>
                                Monthly: {formatCurrency(plan.premiums.monthly)}
                              </div>
                            )}
                          {plan.paymentFrequency !== "annual" &&
                            plan.premiums?.annual && (
                              <div>
                                Annual: {formatCurrency(plan.premiums.annual)}
                              </div>
                            )}
                        </div>
                      </dd>
                    </div>

                    {plan.coverage && (
                      <div className="sm:col-span-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Coverage
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {plan.coverage}
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
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No insurance plan found. Click "Add Plan" to add a new medical
                  cover for the user.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              >
                <FiSave className="mr-2 -ml-1 h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserDetailsProfile;
