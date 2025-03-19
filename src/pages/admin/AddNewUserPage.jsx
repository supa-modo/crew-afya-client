import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

// Import our components
import UserInfoForm from "../../components/admin/UserInfoForm";
import MedicalPlanSelector from "../../components/admin/MedicalPlanSelector";
import DocumentUploadSection from "../../components/admin/DocumentUploadSection";

const AddNewUserPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Form data state - updated to use fullName instead of firstName/lastName
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "user",
    password: "",
    nationalId: "",
  });

  // Plan selection state
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Documents state
  const [documents, setDocuments] = useState([]);

  // Form state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);

  // Available plans with payment frequencies
  const availablePlans = [
    {
      id: "plan1",
      name: "Crew Afya Lite",
      description: "Basic medical coverage with outpatient up to 20,000",
      forWho: "For Driver/Conductor",
      premiums: {
        daily: 24,
        monthly: 713,
        annual: 8565,
      },
      benefits: [
        { name: "Inpatient", limit: "200,000" },
        { name: "Maternity (Within Inpatient)", limit: "20,000" },
        { name: "Outpatient - Capitation", limit: "Up to 20,000" },
        { name: "Optical + Free Eye Test", limit: "5,000" },
      ],
    },
    {
      id: "plan2",
      name: "Crew Afya - (Up to M+3)",
      description: "Family coverage for up to 4 members with enhanced benefits",
      forWho: "For Driver/Conductor + Dependents",
      premiums: {
        daily: 55,
        monthly: 1661,
        annual: 19933,
      },
      benefits: [
        { name: "Inpatient", limit: "200,000" },
        { name: "Maternity (Within Inpatient)", limit: "20,000" },
        { name: "Outpatient - Capitation", limit: "Up to 20,000" },
        { name: "Wellness Support", limit: "Group Sessions + Individual" },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "role",
      "password",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Validate full name - must have at least first and last name
    if (formData.fullName) {
      const nameParts = formData.fullName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        newErrors.fullName = "Please enter full name (first and last name)";
      }
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (
      formData.phoneNumber &&
      !/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Plan validation
    if (!selectedPlan) {
      newErrors.plan = "Please select a medical cover plan";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse the full name into first name and last name for API
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" "); // Combine rest as last name

      // Prepare data for submission - format for API
      const userData = {
        firstName,
        lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        password: formData.password,
        nationalId: formData.nationalId,
        plan: selectedPlan,
        documents: documents,
      };

      // Mock API call - would be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Creating user with data:", userData);

      // Show success
      setFormCompleted(true);

      // In a real app, you would navigate after a successful creation
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ form: "Failed to create user. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (errors.plan) {
      setErrors((prev) => ({ ...prev, plan: "" }));
    }
  };

  return (
    <div className="pb-6">
      <div className="max-w-screen-2xl mx-auto ">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin/users")}
              className="mr-4 flex items-center justify-center rounded-md p-2 text-admin-600 hover:bg-admin-100 hover:text-admin-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-admin-500 dark:hover:bg-admin-900 dark:text-admin-400"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-admin-700 dark:text-admin-500">
              Add New User
            </h1>
          </div>
        </div>

        {formCompleted ? (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
              User Created Successfully!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The new user has been added to the system.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate("/admin/users")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              >
                Go to Users
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-2xl mb-6">
              <div className="px-4 py-5 sm:p-6">
                {errors.form && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20 dark:border-red-600">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {errors.form}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1: User Information */}
                <UserInfoForm
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />

                {/* Section 2: Medical Cover Plan */}
                <MedicalPlanSelector
                  availablePlans={availablePlans}
                  selectedPlan={selectedPlan}
                  handlePlanSelect={handlePlanSelect}
                  error={errors.plan}
                />

                {/* Section 3: Documents */}
                <DocumentUploadSection
                  documents={documents}
                  setDocuments={setDocuments}
                />

                <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/users")}
                      className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          Creating User...
                        </>
                      ) : (
                        "Create User"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddNewUserPage;
