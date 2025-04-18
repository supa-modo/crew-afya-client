import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import dependantsService, {
  getAllDependants,
  createDependant,
  updateDependant,
  deleteDependant,
} from "../../services/dependantsService";
import ConfirmationModal from "../common/ConfirmationModal";
import DependantForm from "./DependantForm";

const DependantsTab = () => {
  const [dependants, setDependants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDependant, setCurrentDependant] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dependantToDelete, setDependantToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchDependants();
  }, []);

  const fetchDependants = async () => {
    try {
      setLoading(true);
      const data = await getAllDependants();
      setDependants(data);
    } catch (error) {
      toast.error(error.message || "Failed to load dependants");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependant = () => {
    setCurrentDependant(null);
    setIsFormOpen(true);
  };

  const handleEditDependant = (dependant) => {
    setCurrentDependant(dependant);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (dependant) => {
    setDependantToDelete(dependant);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dependantToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteDependant(dependantToDelete.id);
      setDependants(dependants.filter((d) => d.id !== dependantToDelete.id));
      toast.success("Dependant deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete dependant");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentDependant) {
        // Update existing dependant
        const updated = await updateDependant(currentDependant.id, formData);
        setDependants(
          dependants.map((d) => (d.id === currentDependant.id ? updated : d))
        );
        toast.success("Dependant updated successfully");
      } else {
        // Add new dependant
        const newDependant = await createDependant(formData);
        setDependants([...dependants, newDependant]);
        toast.success("Dependant added successfully");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save dependant");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dependants</h2>
        <button
          onClick={handleAddDependant}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          <FiPlus /> Add Dependant
        </button>
      </div>

      {dependants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't added any dependants yet.</p>
          <button
            onClick={handleAddDependant}
            className="mt-4 text-primary hover:underline"
          >
            Add your first dependant
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dependants.map((dependant) => (
                <tr key={dependant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dependant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dependant.relationship}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(dependant.dateOfBirth)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dependant.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dependant.idNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dependant.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditDependant(dependant)}
                      className="text-primary hover:text-primary-dark mx-2"
                    >
                      <FiEdit2 className="inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(dependant)}
                      className="text-red-600 hover:text-red-800 mx-2"
                    >
                      <FiTrash2 className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <DependantForm
          dependant={currentDependant}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Dependant"
        message={`Are you sure you want to delete ${dependantToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default DependantsTab;
