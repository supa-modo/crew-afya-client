import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import DependantForm from "./DependantForm";
import ConfirmationModal from "../common/ConfirmationModal";
import { formatDate } from "../../utils/dateUtils";
import { errorToast, successToast } from "../../utils/toastUtils";
import {
  getDependants,
  deleteDependant,
} from "../../services/dependantService";

const DependantsList = () => {
  const [dependants, setDependants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDependant, setCurrentDependant] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dependantToDelete, setDependantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDependants = async () => {
    setIsLoading(true);
    try {
      const data = await getDependants();
      setDependants(data);
      setError(null);
    } catch (err) {
      setError("Failed to load dependants. Please try again later.");
      errorToast("Failed to load dependants");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDependants();
  }, []);

  const handleAddDependant = () => {
    setCurrentDependant(null);
    setShowForm(true);
  };

  const handleEditDependant = (dependant) => {
    setCurrentDependant(dependant);
    setShowForm(true);
  };

  const handleDeleteClick = (dependant) => {
    setDependantToDelete(dependant);
    setShowConfirmation(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentDependant(null);
  };

  const handleFormSubmit = (dependant) => {
    // Update local state after successful API call
    if (currentDependant) {
      // Edit case
      setDependants(
        dependants.map((d) => (d.id === dependant.id ? dependant : d))
      );
    } else {
      // Add case
      setDependants([...dependants, dependant]);
    }
    setShowForm(false);
    setCurrentDependant(null);
  };

  const handleDeleteConfirm = async () => {
    if (!dependantToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDependant(dependantToDelete.id);
      setDependants(dependants.filter((d) => d.id !== dependantToDelete.id));
      successToast("Dependant removed successfully");
    } catch (err) {
      errorToast("Failed to remove dependant");
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
      setDependantToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmation(false);
    setDependantToDelete(null);
  };

  if (isLoading && dependants.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  if (error && dependants.length === 0) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
        {error}
        <button
          onClick={fetchDependants}
          className="ml-2 text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dependants</h2>
        <button
          onClick={handleAddDependant}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          <FiUserPlus className="mr-2" /> Add Dependant
        </button>
      </div>

      {dependants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You have not added any dependants yet.</p>
          <button
            onClick={handleAddDependant}
            className="mt-2 text-primary hover:underline"
          >
            Add your first dependant
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dependants.map((dependant) => (
                <tr key={dependant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    {dependant.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {dependant.relationship}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatDate(dependant.dateOfBirth)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {dependant.gender}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDependant(dependant)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dependant)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <DependantForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          dependant={currentDependant}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmation}
        title="Remove Dependant"
        message={`Are you sure you want to remove ${dependantToDelete?.name} from your dependants?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DependantsList;
