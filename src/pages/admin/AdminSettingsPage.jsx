import { useState } from "react";
import { FiSave, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminSettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "CrewAfya Health Services",
    contactEmail: "support@crewafya.com",
    contactPhone: "+254 700 123456",
    currency: "KES",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mpesaEnabled: true,
    bankTransferEnabled: true,
    creditCardEnabled: false,
    mpesaBusinessCode: "174379",
    mpesaCallbackUrl: "https://api.crewafya.com/payments/callback",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    reminderDays: 3,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handlePaymentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNotificationSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value, 10)
          : value,
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // In a real app, you would send this data to your API
      // For now, we'll simulate a successful save after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful save
      setIsSaving(false);
      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      setIsSaving(false);
      setSaveError("Failed to save settings. Please try again.");
    }
  };

  const handleResetSettings = () => {
    // In a real app, you would fetch the current settings from your API
    // For now, we'll just reset to our initial state
    setGeneralSettings({
      siteName: "CrewAfya Health Services",
      contactEmail: "support@crewafya.com",
      contactPhone: "+254 700 123456",
      currency: "KES",
    });

    setPaymentSettings({
      mpesaEnabled: true,
      bankTransferEnabled: true,
      creditCardEnabled: false,
      mpesaBusinessCode: "174379",
      mpesaCallbackUrl: "https://api.crewafya.com/payments/callback",
    });

    setNotificationSettings({
      emailNotifications: true,
      smsNotifications: true,
      paymentReminders: true,
      reminderDays: 3,
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="System Settings" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              System Settings
            </h1>

            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                Settings saved successfully!
              </div>
            )}

            {saveError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <FiAlertTriangle className="mr-2" />
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              {/* General Settings */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="siteName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Site Name
                      </label>
                      <input
                        type="text"
                        name="siteName"
                        id="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        value={generalSettings.contactEmail}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contactPhone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        name="contactPhone"
                        id="contactPhone"
                        value={generalSettings.contactPhone}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="currency"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={generalSettings.currency}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      >
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    Payment Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="mpesaEnabled"
                          name="mpesaEnabled"
                          type="checkbox"
                          checked={paymentSettings.mpesaEnabled}
                          onChange={handlePaymentSettingsChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="mpesaEnabled"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Enable M-Pesa Payments
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Allow users to pay via M-Pesa mobile money.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="bankTransferEnabled"
                          name="bankTransferEnabled"
                          type="checkbox"
                          checked={paymentSettings.bankTransferEnabled}
                          onChange={handlePaymentSettingsChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="bankTransferEnabled"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Enable Bank Transfer Payments
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Allow users to pay via bank transfer.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="creditCardEnabled"
                          name="creditCardEnabled"
                          type="checkbox"
                          checked={paymentSettings.creditCardEnabled}
                          onChange={handlePaymentSettingsChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="creditCardEnabled"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Enable Credit Card Payments
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Allow users to pay via credit card.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                      <div>
                        <label
                          htmlFor="mpesaBusinessCode"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          M-Pesa Business Code
                        </label>
                        <input
                          type="text"
                          name="mpesaBusinessCode"
                          id="mpesaBusinessCode"
                          value={paymentSettings.mpesaBusinessCode}
                          onChange={handlePaymentSettingsChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="mpesaCallbackUrl"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          M-Pesa Callback URL
                        </label>
                        <input
                          type="text"
                          name="mpesaCallbackUrl"
                          id="mpesaCallbackUrl"
                          value={paymentSettings.mpesaCallbackUrl}
                          onChange={handlePaymentSettingsChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    Notification Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationSettingsChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="emailNotifications"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Send notifications via email.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="smsNotifications"
                          name="smsNotifications"
                          type="checkbox"
                          checked={notificationSettings.smsNotifications}
                          onChange={handleNotificationSettingsChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="smsNotifications"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          SMS Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Send notifications via SMS.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="paymentReminders"
                          name="paymentReminders"
                          type="checkbox"
                          checked={notificationSettings.paymentReminders}
                          onChange={handleNotificationSettingsChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="paymentReminders"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Payment Reminders
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Send payment reminders to users.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                      <div>
                        <label
                          htmlFor="reminderDays"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Days Before Payment to Send Reminder
                        </label>
                        <input
                          type="number"
                          name="reminderDays"
                          id="reminderDays"
                          min="1"
                          max="30"
                          value={notificationSettings.reminderDays}
                          onChange={handleNotificationSettingsChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiRefreshCw className="mr-2 -ml-1 h-5 w-5" />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      <FiSave className="mr-2 -ml-1 h-5 w-5" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
