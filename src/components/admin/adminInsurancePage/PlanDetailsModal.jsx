import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiMinus,
  FiX,
  FiCheck,
  FiList,
  FiUser,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";
import { MdHealthAndSafety } from "react-icons/md";
import { TbShieldCheck } from "react-icons/tb";

const PlanDetailsModal = ({ plan, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...plan });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when plan changes
  useEffect(() => {
    if (plan) {
      setFormData({ ...plan });
    }
  }, [plan]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle premium change
  const handlePremiumChange = (frequency, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      premiums: {
        ...prev.premiums,
        [frequency]: numericValue,
      },
    }));

    // Clear error for the field
    if (errors[`premiums.${frequency}`]) {
      setErrors((prev) => ({ ...prev, [`premiums.${frequency}`]: "" }));
    }
  };

  // Handle coverage detail change
  const handleCoverageDetailChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      coverageDetails: {
        ...prev.coverageDetails,
        [key]: value,
      },
    }));
  };

  // Handle benefit change
  const handleBenefitChange = (index, field, value) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index] = {
      ...updatedBenefits[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      benefits: updatedBenefits,
    }));
  };

  // Add new benefit
  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { name: "", limit: "" }],
    }));
  };

  // Remove benefit
  const handleRemoveBenefit = (index) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      benefits: updatedBenefits,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Plan name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate premiums
    ["daily", "monthly", "annual"].forEach((frequency) => {
      const premium = formData.premiums[frequency];
      if (premium === "" || isNaN(premium) || premium <= 0) {
        newErrors[
          `premiums.${frequency}`
        ] = `Valid ${frequency} premium is required`;
      }
    });

    // Validate benefits
    formData.benefits.forEach((benefit, index) => {
      if (!benefit.name.trim()) {
        newErrors[`benefits[${index}].name`] = "Benefit name is required";
      }
      if (!benefit.limit.trim()) {
        newErrors[`benefits[${index}].limit`] = "Benefit limit is required";
      }
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the plan
      onSave(formData);
    } catch (error) {
      console.error("Error updating plan:", error);
      setErrors({ form: "Failed to update plan. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-4xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center"
                    id="modal-title"
                  >
                    <MdHealthAndSafety className="mr-2 h-6 w-6 text-admin-600" />
                    Edit Insurance Plan
                  </h3>
                  <button
                    onClick={onClose}
                    className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-admin-500"
                  >
                    <span className="sr-only">Close</span>
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Basic Information
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                          >
                            Plan Name*
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MdHealthAndSafety className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={`text-sm text-gray-600/90  block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                errors.name
                                  ? "border-red-300 dark:border-red-500"
                                  : ""
                              }`}
                              placeholder="e.g. Crew Afya Premium"
                              required
                            />
                          </div>
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                          >
                            Description*
                          </label>
                          <div className="relative">
                            <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                              <FiList className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={2}
                              className={`text-sm text-gray-600/90  block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                errors.description
                                  ? "border-red-300 dark:border-red-500"
                                  : ""
                              }`}
                              placeholder="Provide a detailed description of the plan"
                              required
                            />
                          </div>
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="forWho"
                            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                          >
                            Target Audience*
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="forWho"
                              name="forWho"
                              value={formData.forWho}
                              onChange={handleChange}
                              className={`text-sm text-gray-600/90 block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                errors.forWho
                                  ? "border-red-300 dark:border-red-500"
                                  : ""
                              }`}
                              placeholder="e.g. For Driver/Conductor"
                              required
                            />
                          </div>
                          {errors.forWho && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors.forWho}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="status"
                            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                          >
                            Status
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiCheckCircle className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              id="status"
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="text-sm text-gray-600/90 block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premiums */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                        Premium Options
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="dailyPremium"
                            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                          >
                            Daily Premium (KES)*
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiDollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="dailyPremium"
                              value={formData.premiums.daily}
                              onChange={(e) =>
                                handlePremiumChange("daily", e.target.value)
                              }
                              className={`text-sm text-gray-600/90 block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                errors["premiums.daily"]
                                  ? "border-red-300 dark:border-red-500"
                                  : ""
                              }`}
                              min="1"
                              step="1"
                              placeholder="e.g. 24"
                              required
                            />
                          </div>
                          {errors["premiums.daily"] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors["premiums.daily"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="monthlyPremium"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Monthly Premium (KES)*
                          </label>
                          <input
                            type="number"
                            id="monthlyPremium"
                            value={formData.premiums.monthly}
                            onChange={(e) =>
                              handlePremiumChange("monthly", e.target.value)
                            }
                            className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            min="1"
                            step="1"
                            required
                          />
                          {errors["premiums.monthly"] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors["premiums.monthly"]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="annualPremium"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Annual Premium (KES)*
                          </label>
                          <input
                            type="number"
                            id="annualPremium"
                            value={formData.premiums.annual}
                            onChange={(e) =>
                              handlePremiumChange("annual", e.target.value)
                            }
                            className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            min="1"
                            step="1"
                            required
                          />
                          {errors["premiums.annual"] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors["premiums.annual"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coverage Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Coverage Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(formData.coverageDetails).map(
                          ([key, value]) => (
                            <div key={key}>
                              <label
                                htmlFor={`coverage-${key}`}
                                className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1 capitalize"
                              >
                                {key}
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <TbShieldCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id={`coverage-${key}`}
                                  value={value}
                                  onChange={(e) =>
                                    handleCoverageDetailChange(
                                      key,
                                      e.target.value
                                    )
                                  }
                                  className={`text-sm text-gray-600/90 block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                    errors[`coverageDetails.${key}`]
                                      ? "border-red-300 dark:border-red-500"
                                      : ""
                                  }`}
                                  placeholder={`e.g. ${
                                    key === "inpatient" ? "200,000" : "20,000"
                                  }`}
                                />
                              </div>
                              {errors[`coverageDetails.${key}`] && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                  {errors[`coverageDetails.${key}`]}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Benefits
                        </h4>
                        <button
                          type="button"
                          onClick={handleAddBenefit}
                          className="inline-flex items-center text-sm text-admin-600 hover:text-admin-500 dark:text-admin-400 dark:hover:text-admin-300"
                        >
                          <FiPlus className="mr-1 h-4 w-4" />
                          Add Benefit
                        </button>
                      </div>

                      <div className="space-y-3">
                        {formData.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row md:items-end space-y-3 md:space-y-0 md:space-x-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex-grow">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <FiList className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id={`benefit-name-${index}`}
                                  value={benefit.name}
                                  onChange={(e) =>
                                    handleBenefitChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className={`text-sm text-gray-600/90 block w-full pl-12 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                    errors[`benefits[${index}].name`]
                                      ? "border-red-300 dark:border-red-500"
                                      : ""
                                  }`}
                                  placeholder="e.g. Inpatient"
                                />
                              </div>
                              {errors[`benefits[${index}].name`] && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                  {errors[`benefits[${index}].name`]}
                                </p>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id={`benefit-limit-${index}`}
                                  value={benefit.limit}
                                  onChange={(e) =>
                                    handleBenefitChange(
                                      index,
                                      "limit",
                                      e.target.value
                                    )
                                  }
                                  className={`text-sm text-gray-600/90 block w-full pl-12 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                                    errors[`benefits[${index}].limit`]
                                      ? "border-red-300 dark:border-red-500"
                                      : ""
                                  }`}
                                  placeholder="e.g. 200,000"
                                />
                              </div>
                              {errors[`benefits[${index}].limit`] && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                  {errors[`benefits[${index}].limit`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => handleRemoveBenefit(index)}
                                className="inline-flex items-center p-2 border border-red-300 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm"
                                disabled={formData.benefits.length <= 1}
                                title="Remove benefit"
                              >
                                <FiMinus className="h-5 w-5" />
                                <span className="sr-only">Remove</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {errors.form && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4">
                      <div className="flex">
                        <FiX className="h-5 w-5 text-red-400 dark:text-red-500" />
                        <p className="ml-3 text-sm text-red-700 dark:text-red-400">
                          {errors.form}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:focus:ring-offset-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <FiCheck className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
