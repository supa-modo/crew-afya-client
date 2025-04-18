import { useState, useEffect } from "react";
import {
  FiLoader,
  FiPlus,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiUser,
  FiCalendar,
  FiPhone,
} from "react-icons/fi";
import {
  PiGenderFemale,
  PiGenderMale,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";

// This would be a real service in the actual implementation
const mockDependantsService = {
  // Mock function to get dependants
  getDependants: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "dep1",
            firstName: "Jane",
            lastName: "Doe",
            relationship: "Spouse",
            gender: "Female",
            dateOfBirth: "1990-05-15",
            phoneNumber: "+254712345678",
            idNumber: "123456789",
            createdAt: "2023-01-05T12:00:00Z",
          },
          {
            id: "dep2",
            firstName: "John",
            lastName: "Doe Jr",
            relationship: "Child",
            gender: "Male",
            dateOfBirth: "2018-10-20",
            phoneNumber: "",
            idNumber: "",
            createdAt: "2023-01-05T12:00:00Z",
          },
        ]);
      }, 1000);
    });
  },
  // Mock function to add a dependant
  addDependant: (userId, dependantData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "dep" + Math.floor(Math.random() * 1000),
          ...dependantData,
          createdAt: new Date().toISOString(),
        });
      }, 1000);
    });
  },
  // Mock function to update a dependant
  updateDependant: (dependantId, dependantData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: dependantId,
          ...dependantData,
          updatedAt: new Date().toISOString(),
        });
      }, 1000);
    });
  },
  // Mock function to delete a dependant
  deleteDependant: (dependantId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },
};

const DependantsTab = ({ userId, isLoading: parentIsLoading }) => {
  // State for dependants data
  const [dependants, setDependants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingDependantId, setEditingDependantId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    idNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dependantToDelete, setDependantToDelete] = useState(null);

  // Load dependants on component mount
  useEffect(() => {
    fetchDependants();
  }, [userId]);

  const fetchDependants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mockDependantsService.getDependants(userId);
      setDependants(data);
    } catch (err) {
      console.error("Error fetching dependants:", err);
      setError("Failed to load dependants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDependantClick = () => {
    setFormData({
      firstName: "",
      lastName: "",
      relationship: "",
      gender: "",
      dateOfBirth: "",
      phoneNumber: "",
      idNumber: "",
    });
    setEditingDependantId(null);
    setValidationErrors({});
    setShowForm(true);
  };

  const handleEditDependantClick = (dependant) => {
    setFormData({
      firstName: dependant.firstName,
      lastName: dependant.lastName,
      relationship: dependant.relationship,
      gender: dependant.gender,
      dateOfBirth: dependant.dateOfBirth,
      phoneNumber: dependant.phoneNumber || "",
      idNumber: dependant.idNumber || "",
    });
    setEditingDependantId(dependant.id);
    setValidationErrors({});
    setShowForm(true);
  };

  const handleDeleteDependantClick = (dependant) => {
    setDependantToDelete(dependant);
    setShowDeleteModal(true);
  };

  const confirmDeleteDependant = async () => {
    if (!dependantToDelete) return;

    try {
      setIsSubmitting(true);
      await mockDependantsService.deleteDependant(dependantToDelete.id);
      setDependants((prevDependants) =>
        prevDependants.filter((dep) => dep.id !== dependantToDelete.id)
      );
      setShowDeleteModal(false);
      setDependantToDelete(null);
    } catch (err) {
      console.error("Error deleting dependant:", err);
      setError("Failed to delete dependant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.relationship)
      errors.relationship = "Relationship is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";

    // Validate phone number if provided
    if (
      formData.phoneNumber &&
      !/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)
    ) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    // Only validate ID number for adult dependants (spouse, parent, etc)
    if (
      ["Spouse", "Parent", "Guardian", "Other"].includes(
        formData.relationship
      ) &&
      !formData.idNumber
    ) {
      errors.idNumber = "ID number is required for adult dependants";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitDependant = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      if (editingDependantId) {
        // Update existing dependant
        const updatedDependant = await mockDependantsService.updateDependant(
          editingDependantId,
          formData
        );
        setDependants((prevDependants) =>
          prevDependants.map((dep) =>
            dep.id === editingDependantId ? updatedDependant : dep
          )
        );
      } else {
        // Add new dependant
        const newDependant = await mockDependantsService.addDependant(
          userId,
          formData
        );
        setDependants((prevDependants) => [...prevDependants, newDependant]);
      }

      // Reset form
      setShowForm(false);
      setEditingDependantId(null);
      setFormData({
        firstName: "",
        lastName: "",
        relationship: "",
        gender: "",
        dateOfBirth: "",
        phoneNumber: "",
        idNumber: "",
      });
    } catch (err) {
      console.error("Error saving dependant:", err);
      setError("Failed to save dependant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  // Loading state
  if (isLoading || parentIsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDependants}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <PiUsersThreeDuotone className="text-emerald-600 mr-2 h-6 w-6" />
            Dependants
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your dependants for healthcare coverage
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddDependantClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          <span>Add Dependant</span>
        </button>
      </div>

      <AnimatePresence>
        {/* Form for adding/editing dependants */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                {editingDependantId ? "Edit Dependant" : "Add New Dependant"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDependant} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm text-sm ${
                        validationErrors.firstName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      }`}
                      placeholder="First name"
                    />
                  </div>
                  {validationErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm text-sm ${
                        validationErrors.lastName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      }`}
                      placeholder="Last name"
                    />
                  </div>
                  {validationErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.lastName}
                    </p>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <label
                    htmlFor="relationship"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleFormChange}
                    className={`block w-full py-2 px-3 border rounded-md shadow-sm text-sm ${
                      validationErrors.relationship
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                  {validationErrors.relationship && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.relationship}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    className={`block w-full py-2 px-3 border rounded-md shadow-sm text-sm ${
                      validationErrors.gender
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {validationErrors.gender && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.gender}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleFormChange}
                      max={new Date().toISOString().split("T")[0]}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm text-sm ${
                        validationErrors.dateOfBirth
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      }`}
                    />
                  </div>
                  {validationErrors.dateOfBirth && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Phone Number (only required for adults) */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number{" "}
                    {["Spouse", "Parent", "Guardian", "Other"].includes(
                      formData.relationship
                    ) && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm text-sm ${
                        validationErrors.phoneNumber
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      }`}
                      placeholder="+254XXXXXXXXX"
                    />
                  </div>
                  {validationErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* ID Number (only required for adults) */}
                <div>
                  <label
                    htmlFor="idNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ID Number{" "}
                    {["Spouse", "Parent", "Guardian", "Other"].includes(
                      formData.relationship
                    ) && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleFormChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
                      validationErrors.idNumber
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                    placeholder="Enter ID number"
                  />
                  {validationErrors.idNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors.idNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="-ml-1 mr-2 h-4 w-4" />
                      {editingDependantId ? "Update" : "Save"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dependants list */}
      {dependants.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependants.map((dependant) => (
            <motion.div
              key={dependant.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span
                    className={`flex-shrink-0 h-10 w-10 rounded-full text-white flex items-center justify-center ${
                      dependant.gender === "Female"
                        ? "bg-pink-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {dependant.gender === "Female" ? (
                      <PiGenderFemale className="h-6 w-6" />
                    ) : (
                      <PiGenderMale className="h-6 w-6" />
                    )}
                  </span>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">
                      {dependant.firstName} {dependant.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {dependant.relationship} •{" "}
                      {calculateAge(dependant.dateOfBirth)} years
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => handleEditDependantClick(dependant)}
                    className="text-gray-600 hover:text-gray-900 p-1.5"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDependantClick(dependant)}
                    className="text-red-500 hover:text-red-700 p-1.5"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">
                      Date of Birth
                    </span>
                    <span className="font-medium text-gray-800">
                      {new Date(dependant.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Gender</span>
                    <span className="font-medium text-gray-800">
                      {dependant.gender}
                    </span>
                  </div>
                  {dependant.phoneNumber && (
                    <div>
                      <span className="text-gray-500 block text-xs">Phone</span>
                      <span className="font-medium text-gray-800">
                        {dependant.phoneNumber}
                      </span>
                    </div>
                  )}
                  {dependant.idNumber && (
                    <div>
                      <span className="text-gray-500 block text-xs">
                        ID Number
                      </span>
                      <span className="font-medium text-gray-800">
                        {dependant.idNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center rounded-full bg-gray-100">
            <PiUsersThreeDuotone className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            No dependants
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You can add your dependants for healthcare coverage
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddDependantClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <FiPlus className="mr-2 -ml-1 h-5 w-5" />
              <span>Add Dependant</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for deleting dependant */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteDependant}
        title="Delete Dependant"
        message={
          dependantToDelete
            ? `Are you sure you want to remove ${dependantToDelete.firstName} ${dependantToDelete.lastName} as a dependant? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DependantsTab;
