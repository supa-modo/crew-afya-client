import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEdit2,
  FiCheck,
  FiX,
} from "react-icons/fi";

const UserDetailsPlans = ({ user }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding/editing plans
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    startDate: "",
    endDate: "",
    status: "active",
    monthlyCost: "",
    coverageLimit: "",
    coverageType: "health",
    policyNumber: "",
    description: "",
  });

  useEffect(() => {
    // In a real implementation, this would fetch plans from an API
    const fetchPlans = async () => {
      setLoading(true);
      try {
        // Mock API response
        setTimeout(() => {
          const mockPlans = [
            {
              id: "plan1",
              name: "Basic Health Cover",
              provider: "Safaricom Health",
              startDate: "2023-01-15",
              endDate: "2024-01-14",
              status: "active",
              monthlyCost: 2500,
              coverageLimit: 500000,
              coverageType: "health",
              policyNumber: "SH-2023-12345",
              description:
                "Basic health insurance covering outpatient, inpatient, and emergency services.",
            },
            {
              id: "plan2",
              name: "Family Health Plan",
              provider: "Jubilee Insurance",
              startDate: "2023-03-01",
              endDate: "2024-02-29",
              status: "active",
              monthlyCost: 5000,
              coverageLimit: 1000000,
              coverageType: "family",
              policyNumber: "JI-2023-67890",
              description:
                "Comprehensive family health coverage for up to 5 family members.",
            },
            {
              id: "plan3",
              name: "Dental Coverage",
              provider: "AAR Insurance",
              startDate: "2022-11-01",
              endDate: "2023-10-31",
              status: "expiring",
              monthlyCost: 1200,
              coverageLimit: 200000,
              coverageType: "dental",
              policyNumber: "AAR-2022-54321",
              description:
                "Specialized dental coverage including regular checkups and major procedures.",
            },
          ];
          setPlans(mockPlans);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user.id]);

  const handleAddNewPlan = () => {
    setFormData({
      name: "",
      provider: "",
      startDate: "",
      endDate: "",
      status: "active",
      monthlyCost: "",
      coverageLimit: "",
      coverageType: "health",
      policyNumber: "",
      description: "",
    });
    setShowAddForm(true);
    setEditingPlanId(null);
  };

  const handleEditPlan = (plan) => {
    setFormData({
      name: plan.name,
      provider: plan.provider,
      startDate: plan.startDate,
      endDate: plan.endDate,
      status: plan.status,
      monthlyCost: plan.monthlyCost,
      coverageLimit: plan.coverageLimit,
      coverageType: plan.coverageType,
      policyNumber: plan.policyNumber,
      description: plan.description,
    });
    setEditingPlanId(plan.id);
    setShowAddForm(true);
  };

  const handleDeletePlan = (planId) => {
    // In a real app, this would call an API to delete the plan
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter((plan) => plan.id !== planId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.provider || !formData.startDate) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real app, this would call an API to save the plan
    if (editingPlanId) {
      // Update existing plan
      setPlans(
        plans.map((plan) =>
          plan.id === editingPlanId ? { ...plan, ...formData } : plan
        )
      );
    } else {
      // Add new plan
      const newPlan = {
        id: `plan${Date.now()}`,
        ...formData,
        monthlyCost: Number(formData.monthlyCost),
        coverageLimit: Number(formData.coverageLimit),
      };
      setPlans([...plans, newPlan]);
    }

    // Reset form
    setShowAddForm(false);
    setEditingPlanId(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPlanId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "expiring":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Insurance Plans
        </h3>
        <button
          type="button"
          onClick={handleAddNewPlan}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
        >
          <FiPlus className="mr-1.5 h-4 w-4" /> Add Plan
        </button>
      </div>

      {/* Add/Edit Plan Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4 border border-admin-200 dark:border-admin-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            {editingPlanId ? "Edit Insurance Plan" : "Add New Insurance Plan"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider/Insurance Company*
                </label>
                <input
                  type="text"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coverage Type
                </label>
                <select
                  name="coverageType"
                  value={formData.coverageType}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="health">Health</option>
                  <option value="dental">Dental</option>
                  <option value="vision">Vision</option>
                  <option value="family">Family</option>
                  <option value="life">Life</option>
                  <option value="disability">Disability</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date*
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Cost (KES)
                </label>
                <input
                  type="number"
                  name="monthlyCost"
                  value={formData.monthlyCost}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coverage Limit (KES)
                </label>
                <input
                  type="number"
                  name="coverageLimit"
                  value={formData.coverageLimit}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter plan description and coverage details"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <FiX className="mr-1.5 h-4 w-4" /> Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
              >
                <FiCheck className="mr-1.5 h-4 w-4" />{" "}
                {editingPlanId ? "Update Plan" : "Add Plan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medical Cover Plans List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-600"></div>
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            Loading plans...
          </span>
        </div>
      ) : plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-4 sm:px-6 flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    {plan.name}
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanStatusClass(
                        plan.status
                      )}`}
                    >
                      {plan.status.charAt(0).toUpperCase() +
                        plan.status.slice(1)}
                    </span>
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {plan.provider} • Policy #{plan.policyNumber}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditPlan(plan)}
                    className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    title="Edit Plan"
                  >
                    <FiEdit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="inline-flex items-center p-1.5 border border-red-300 shadow-sm text-xs rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                    title="Delete Plan"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FiCalendar className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Coverage Period
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Monthly Cost
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(plan.monthlyCost)}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Coverage Limit
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(plan.coverageLimit)}
                    </dd>
                  </div>
                  {plan.description && (
                    <div className="sm:col-span-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {plan.description}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No insurance plans found. Click "Add Plan" to create a new insurance
            plan.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPlans;
