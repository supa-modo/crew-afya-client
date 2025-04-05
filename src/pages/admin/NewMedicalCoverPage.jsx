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
  TbChevronRight,
  TbListDetails,
} from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";
import insuranceService from "../../services/insuranceService";
import { createPlan } from "../../services/planService";
import { PlanType } from "../../constants/enums";
import { PiUserDuotone, PiUsersDuotone } from "react-icons/pi";

const NewMedicalCoverPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    forWho: "",
    status: "active",
    type: "CrewAfya Lite (M)",
    category: "individual",
    premiums: {
      daily: "",
      weekly: "",
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
      { name: "Inpatient", limit: "" },
      { name: "Outpatient", limit: "" },
      { name: "Maternity", limit: "" },
      { name: "Optical", limit: "" },
      { name: "Dental", limit: "" },
    ],
    maxDependents: 0,
    waitingPeriod: 30,
    minAge: 18,
    maxAge: 65,
    preExistingConditions: false,
    preExistingConditionsWaitingPeriod: 180,
    coveragePeriod: 365,
    gracePeriod: 15,
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

    // Clear error for the field
    if (errors[`coverageDetails.${key}`]) {
      setErrors((prev) => ({ ...prev, [`coverageDetails.${key}`]: "" }));
    }
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

    // Clear error for the field
    if (errors[`benefits[${index}].${field}`]) {
      setErrors((prev) => ({ ...prev, [`benefits[${index}].${field}`]: "" }));
    }
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
    ["daily", "weekly", "monthly", "annual"].forEach((frequency) => {
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

    // Validate numeric fields
    if (formData.maxDependents < 0) {
      newErrors.maxDependents = "Maximum dependents must be 0 or greater";
    }

    if (formData.waitingPeriod < 0) {
      newErrors.waitingPeriod = "Waiting period must be 0 or greater";
    }

    if (formData.minAge < 0 || formData.maxAge < formData.minAge) {
      newErrors.ageRange = "Invalid age range";
    }

    if (formData.preExistingConditionsWaitingPeriod < 0) {
      newErrors.preExistingConditionsWaitingPeriod = "Invalid waiting period";
    }

    if (formData.coveragePeriod < 1) {
      newErrors.coveragePeriod = "Coverage period must be at least 1 day";
    }

    if (formData.gracePeriod < 0) {
      newErrors.gracePeriod = "Grace period must be 0 or greater";
    }

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
      // Transform form data to match backend model
      const planData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        dailyPremium: parseFloat(formData.premiums.daily),
        weeklyPremium: parseFloat(formData.premiums.weekly),
        monthlyPremium: parseFloat(formData.premiums.monthly),
        annualPremium: parseFloat(formData.premiums.annual),
        inpatientLimit: parseFloat(
          formData.coverageDetails.inpatient.replace(/,/g, "")
        ),
        outpatientLimit: parseFloat(
          formData.coverageDetails.outpatient.replace(/,/g, "")
        ),
        maternityLimit: parseFloat(
          formData.coverageDetails.maternity.replace(/,/g, "")
        ),
        opticalLimit: parseFloat(
          formData.coverageDetails.optical.replace(/,/g, "")
        ),
        maxDependents: parseInt(formData.maxDependents),
        waitingPeriod: parseInt(formData.waitingPeriod),
        minAge: parseInt(formData.minAge),
        maxAge: parseInt(formData.maxAge),
        preExistingConditions: formData.preExistingConditions,
        preExistingConditionsWaitingPeriod: parseInt(
          formData.preExistingConditionsWaitingPeriod
        ),
        coveragePeriod: parseInt(formData.coveragePeriod),
        gracePeriod: parseInt(formData.gracePeriod),
        forDependents: formData.forWho.toLowerCase().includes("depend"),
        isActive: formData.status === "active",
        benefits: formData.benefits.map((benefit) => ({
          name: benefit.name,
          limit: parseFloat(benefit.limit.replace(/,/g, "")),
        })),
      };

      // Create plan
      await insuranceService.createPlan(planData);

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
      <div className=" mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
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
                <TbChevronRight className="w-4 h-4" />
                <Link to="/admin/plans" className="ml-2 hover:text-admin-600">
                  Insurance Plans
                </Link>
              </li>
              <li className="flex items-center">
                <TbChevronRight className="w-4 h-4" />
                <span className="ml-2 text-admin-700 dark:text-admin-600 font-medium">
                  New Medical Cover
                </span>
              </li>
            </ol>
          </nav>
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
                      htmlFor="type"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Plan Type*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <TbShieldCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200"
                      >
                        <option value="CrewAfya Lite (M)">
                          Crew Afya Lite
                        </option>
                        <option value="CrewAfya M+1">Crew Afya M+1</option>
                        <option value="CrewAfya M+2">Crew Afya M+2</option>
                        <option value="CrewAfya M+3">Crew Afya M+3</option>
                        <option value="CrewAfya M+4">Crew Afya M+4</option>
                        <option value="CrewAfya M+5">Crew Afya M+5</option>
                        <option value="CrewAfya M+6">Crew Afya M+6</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Category*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PiUserDuotone className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200"
                      >
                        <option value="individual">Individual</option>
                        <option value="family">Family</option>
                      </select>
                    </div>
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
                        <PiUsersDuotone className="h-5 w-5 text-gray-400" />
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
                        <TbListDetails className="h-5 w-5 text-gray-400" />
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
                </div>
              </div>

              {/* Premium Options */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                  <TbShieldHalfFilled className="mr-2 h-6 w-6 text-admin-500" />
                  Premium Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      htmlFor="weeklyPremium"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Weekly Premium (KES)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="weeklyPremium"
                        value={formData.premiums.weekly}
                        onChange={(e) =>
                          handlePremiumChange("weekly", e.target.value)
                        }
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors["premiums.weekly"]
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="e.g. 168"
                        min="1"
                      />
                    </div>
                    {errors["premiums.weekly"] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors["premiums.weekly"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="monthlyPremium"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Monthly Premium (KES)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="monthlyPremium"
                        value={formData.premiums.monthly}
                        onChange={(e) =>
                          handlePremiumChange("monthly", e.target.value)
                        }
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors["premiums.monthly"]
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="e.g. 713"
                        min="1"
                      />
                    </div>
                    {errors["premiums.monthly"] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors["premiums.monthly"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="annualPremium"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Annual Premium (KES)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="annualPremium"
                        value={formData.premiums.annual}
                        onChange={(e) =>
                          handlePremiumChange("annual", e.target.value)
                        }
                        className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                          errors["premiums.annual"]
                            ? "border-red-300 dark:border-red-500"
                            : ""
                        }`}
                        placeholder="e.g. 8565"
                        min="1"
                      />
                    </div>
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
                          {key} Coverage (KES)*
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

              {/* Additional Settings */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                  <TbShieldHalfFilled className="mr-2 h-6 w-6 text-admin-500" />
                  Additional Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="maxDependents"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Maximum Dependents
                    </label>
                    <input
                      type="number"
                      id="maxDependents"
                      name="maxDependents"
                      value={formData.maxDependents}
                      onChange={handleChange}
                      className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="waitingPeriod"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Waiting Period (Days)
                    </label>
                    <input
                      type="number"
                      id="waitingPeriod"
                      name="waitingPeriod"
                      value={formData.waitingPeriod}
                      onChange={handleChange}
                      className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gracePeriod"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Grace Period (Days)
                    </label>
                    <input
                      type="number"
                      id="gracePeriod"
                      name="gracePeriod"
                      value={formData.gracePeriod}
                      onChange={handleChange}
                      className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="minAge"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Minimum Age
                    </label>
                    <input
                      type="number"
                      id="minAge"
                      name="minAge"
                      value={formData.minAge}
                      onChange={handleChange}
                      className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="maxAge"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Maximum Age
                    </label>
                    <input
                      type="number"
                      id="maxAge"
                      name="maxAge"
                      value={formData.maxAge}
                      onChange={handleChange}
                      className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="coveragePeriod"
                      className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                    >
                      Coverage Period (Days)
                    </label>
                    <input
                      type="number"
                      id="coveragePeriod"
                      name="coveragePeriod"
                      value={formData.coveragePeriod}
                      onChange={handleChange}
                      className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                      min="1"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preExistingConditions"
                        name="preExistingConditions"
                        checked={formData.preExistingConditions}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "preExistingConditions",
                              value: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4 text-admin-600 focus:ring-admin-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="preExistingConditions"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Cover Pre-existing Conditions
                      </label>
                    </div>
                    {formData.preExistingConditions && (
                      <div className="mt-3">
                        <label
                          htmlFor="preExistingConditionsWaitingPeriod"
                          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                        >
                          Pre-existing Conditions Waiting Period (Days)
                        </label>
                        <input
                          type="number"
                          id="preExistingConditionsWaitingPeriod"
                          name="preExistingConditionsWaitingPeriod"
                          value={formData.preExistingConditionsWaitingPeriod}
                          onChange={handleChange}
                          className="text-sm text-gray-600/90 sm:text-base block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
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
                          Limit (KES)*
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
