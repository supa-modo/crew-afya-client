import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSave,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiAlertTriangle,
  FiCheckCircle,
  FiList,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import {
  TbHome2,
  TbShieldHalfFilled,
  TbShieldFilled,
  TbShieldCheck,
} from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";
import { createPlan } from "../../services/planService";
import { PlanType } from "../../constants/enums";

const NewMedicalCoverPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    forWho: "",
    status: "active",
    premiums: {
      daily: "",
      monthly: "",
      annual: "",
    },
    coverageDetails: {
      inpatient: "",
      outpatient: "",
      maternity: "",
      optical: "",
      dental: "",
    },
    benefits: [
      { name: "", limit: "" },
      { name: "", limit: "" },
    ],
  });

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

    if (!formData.forWho.trim()) {
      newErrors.forWho = "Target audience is required";
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

    // Validate coverage details
    Object.entries(formData.coverageDetails).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[`coverageDetails.${key}`] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } coverage is required`;
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform frontend form data to backend model format
      const planTypeValue = formData.forWho.toLowerCase().includes("depend")
        ? PlanType.FAMILY
        : PlanType.LITE;

      const planData = {
        name: formData.name,
        description: formData.description,
        type: planTypeValue,
        dailyPremium: parseFloat(formData.premiums.daily),
        monthlyPremium: parseFloat(formData.premiums.monthly),
        annualPremium: parseFloat(formData.premiums.annual),
        inpatientLimit: parseFloat(
          formData.coverageDetails.inpatient.replace(/,/g, "")
        ),
        outpatientLimit: parseFloat(
          formData.coverageDetails.outpatient.replace(/[^0-9]/g, "")
        ),
        maternityLimit: parseFloat(
          formData.coverageDetails.maternity.replace(/,/g, "")
        ),
        opticalLimit: parseFloat(
          formData.coverageDetails.optical.replace(/,/g, "")
        ),
        accidentLimit: 50000, // Default value
        disabilityCompensation: 50000, // Default value
        lastExpense: 50000, // Default value
        emergencyEvacuation: 10000, // Default value
        dailyCashCompensation: 800, // Default value
        wellnessSupport: formData.forWho.toLowerCase().includes("depend")
          ? "Group Sessions + Individual"
          : "Group Sessions",
        forDependents: formData.forWho.toLowerCase().includes("depend"),
        isActive: formData.status === "active",
      };

      // Call API to create plan
      const response = await createPlan(planData);

      // Navigate to plans page after successful creation
      navigate("/admin/plans", {
        state: {
          success: true,
          message: `Plan "${formData.name}" was created successfully.`,
        },
      });
    } catch (error) {
      console.error("Error creating plan:", error);

      // Display the specific error message from the backend
      setErrors({
        form: error.message || "Failed to create plan. Please try again.",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-admin-600 flex items-center"
                >
                  <TbHome2 className="h-5 w-5 mr-2" />
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <Link to="/admin/plans" className="ml-2 hover:text-admin-600">
                  Insurance Plans
                </Link>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  New Medical Cover
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin/plans")}
              className="p-2 mr-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-admin-700 dark:text-admin-500 flex items-center">
              <TbShieldFilled className="mr-2 h-7 w-7 text-admin-600" />
              Create New Medical Cover Plan
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Form Errors */}
              {errors.form && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4">
                  <div className="flex">
                    <FiAlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" />
                    <p className="ml-3 text-sm text-red-700 dark:text-red-400">
                      {errors.form}
                    </p>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                  <MdHealthAndSafety className="mr-2 h-6 w-6 text-admin-500" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors.name
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="e.g. Crew Afya Premium"
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
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors.forWho
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="e.g. For Driver/Conductor + Family"
                      />
                    </div>
                    {errors.forWho && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.forWho}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
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
                        rows={3}
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors.description
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="Provide a detailed description of the plan"
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
                        className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Options */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                  <TbShieldHalfFilled className="mr-2 h-6 w-6 text-admin-500" />
                  Premium Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors["premiums.daily"]
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="e.g. 24"
                        min="1"
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
                      placeholder="e.g. 713"
                      min="1"
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
                      placeholder="e.g. 8565"
                      min="1"
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
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                  <TbShieldHalfFilled className="mr-2 h-6 w-6 text-admin-500" />
                  Coverage Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(formData.coverageDetails).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label
                          htmlFor={`coverage-${key}`}
                          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1 capitalize"
                        >
                          {key} Coverage*
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
                              handleCoverageDetailChange(key, e.target.value)
                            }
                            className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
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
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <TbShieldHalfFilled className="mr-2 h-6 w-6 text-admin-500" />
                    Benefits
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="inline-flex items-center px-3 py-1.5 border border-admin-300 text-sm leading-4 font-medium rounded-md text-admin-700 bg-admin-50 hover:bg-admin-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-admin-900/20 dark:text-admin-400 dark:border-admin-800 dark:hover:bg-admin-900/40"
                  >
                    <FiPlus className="mr-1.5 h-4 w-4" /> Add Benefit
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-grow">
                        <label
                          htmlFor={`benefit-name-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Benefit Name*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiList className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id={`benefit-name-${index}`}
                            value={benefit.name}
                            onChange={(e) =>
                              handleBenefitChange(index, "name", e.target.value)
                            }
                            className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
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
                        <label
                          htmlFor={`benefit-limit-${index}`}
                          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                        >
                          Limit*
                        </label>
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
                            className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
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

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/plans")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:focus:ring-offset-gray-800"
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
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 h-4 w-4" /> Create Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMedicalCoverPage;
