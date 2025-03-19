import { useState, useEffect } from "react";
import {
  FiFileText,
  FiActivity,
  FiUpload,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import PaymentHistory from "../components/payment/PaymentHistory";
import ChangeFrequencyModal from "../components/payment/ChangeFrequencyModal";
import DocumentUploadModal from "../components/profile/DocumentUploadModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  TbActivity,
  TbCreditCardPay,
  TbDownload,
  TbHomeDot,
  TbShieldCheckFilled,
  TbTrash,
} from "react-icons/tb";
import {
  PiClockCountdownDuotone,
  PiFilePdfDuotone,
  PiFilesDuotone,
  PiImageDuotone,
  PiMoneyWavy,
  PiUserCircle,
  PiUserDuotone,
} from "react-icons/pi";
import { MdPayments } from "react-icons/md";
import {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
} from "../services/documentService";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const [userSubscription, setUserSubscription] = useState(null);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState("April 15, 2025");

  // Document states
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentData, setDocumentData] = useState({
    name: "",
    type: "",
    description: "",
    file: null,
  });
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Load user subscription data
  useEffect(() => {
    const subscription = localStorage.getItem("userSubscription");
    if (subscription) {
      setUserSubscription(JSON.parse(subscription));
    }

    // Fetch documents
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      const response = await getUserDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleOpenFrequencyModal = () => {
    setIsFrequencyModalOpen(true);
  };

  const handleCloseFrequencyModal = () => {
    setIsFrequencyModalOpen(false);
  };

  const handleFrequencyChanged = (newFrequency) => {
    if (userSubscription) {
      const updatedSubscription = {
        ...userSubscription,
        frequency: newFrequency,
      };

      // Update local state
      setUserSubscription(updatedSubscription);

      // Save to localStorage
      localStorage.setItem(
        "userSubscription",
        JSON.stringify(updatedSubscription)
      );

      // Update next payment date based on frequency
      const today = new Date();
      let nextDate;

      if (newFrequency === "daily") {
        nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1);
      } else if (newFrequency === "monthly") {
        nextDate = new Date(today);
        nextDate.setMonth(today.getMonth() + 1);
      } else if (newFrequency === "annual") {
        nextDate = new Date(today);
        nextDate.setFullYear(today.getFullYear() + 1);
      }

      if (nextDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        setNextPaymentDate(nextDate.toLocaleDateString("en-US", options));
      }
    }
  };

  const handleFileUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleDocumentDataChange = (e) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({
      ...prev,
      [name === "docName"
        ? "name"
        : name === "docType"
        ? "type"
        : name === "docDescription"
        ? "description"
        : name]: value,
    }));
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setFileError("");

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError(
        "Only images (JPG, PNG), PDFs, and document files (DOC, DOCX) are allowed"
      );
      return;
    }

    setDocumentData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    if (!documentData.file) {
      setFileError("Please select a file to upload");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      // Upload the document
      const response = await uploadDocument(
        documentData.file,
        documentData.name,
        documentData.type,
        documentData.description
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Refresh the documents list
      await fetchDocuments();

      // Reset form and close modal
      setDocumentData({
        name: "",
        type: "",
        description: "",
        file: null,
      });
      setShowUploadModal(false);
    } catch (error) {
      // Clear the progress interval if it exists
      clearInterval(progressInterval);

      // Set specific error message based on the error
      if (error.message && error.message.includes("file")) {
        setFileError(error.message);
      } else {
        console.error("Failed to upload document:", error);
        // Close the modal to show the error message
        setShowUploadModal(false);
      }
    } finally {
      setIsSubmitting(false);
      // Don't reset upload progress immediately to show completion or failure
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        setIsSubmitting(true);
        await deleteDocument(documentToDelete.id);
        await fetchDocuments();
      } catch (error) {
        console.error("Failed to delete document:", error);
      } finally {
        setIsSubmitting(false);
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleDeleteDocument = async (documentId) => {
    const document = documents.find((doc) => doc.id === documentId);
    if (document) {
      handleDeleteClick(document);
    }
  };

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-16">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-600 flex items-center">
                <TbHomeDot className="h-5 w-5 mr-2" />
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
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Dashboard
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Welcome section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 font-lexend">
              <PiUserDuotone className="mr-2 h-8 sm:h-10 w-8 sm:w-10 text-primary-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white flex items-center">
                  Welcome, {user?.firstName || "User"}
                </h1>
                <p className=" text-sm  text-gray-600 dark:text-gray-400">
                  Here's an overview of your health insurance account
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                to="/payments"
                className="inline-flex items-center px-3 sm:px-5 py-2 bg-secondary-100 border border-green-600 rounded-lg shadow-sm text-sm font-medium text-green-700  dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <TbCreditCardPay className="mr-2 h-5 sm:h-6 w-5 sm:w-6" />
                Make a Payment
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center px-4 sm:px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                <PiUserCircle className="mr-2 h-5 sm:h-6 w-5 sm:w-6" />
                View Profile
              </Link>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-6 mb-3 sm:mb-4 md:mb-6">
            <DashboardSummary />
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 rounded-xl">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-7">
            <h2 className="text-base sm:text-lg font-bold text-primary-600 pl-1 sm:pl-2 mb-4 flex items-center">
              <TbShieldCheckFilled className="mr-2 h-6 w-6 text-primary-600" />
              Your Coverage Details Overview
            </h2>
            {/* Coverage and Payment Schedule Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Insurance Coverage Section */}
              <div className="md:w-[70%] bg-white dark:bg-gray-800 rounded-xl shadow-sm px-5 py-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-600 mb-0.5 dark:text-gray-300 flex items-center">
                  Coverage Utilization
                </h3>
                <p className="text-[0.8rem] text-gray-600 dark:text-gray-400 mb-4">
                  Monitor your medical cover usage across different benefits
                </p>
                <div className="space-y-4 sm:space-y-5">
                  {[
                    {
                      name: "Inpatient",
                      used: 250000,
                      total: 1000000,
                      percentage: (250000 / 1000000) * 100,
                    },
                    {
                      name: "Outpatient",
                      used: 85000,
                      total: 150000,
                      percentage: (85000 / 150000) * 100,
                    },
                    {
                      name: "Dental",
                      used: 12000,
                      total: 30000,
                      percentage: (12000 / 30000) * 100,
                    },
                    {
                      name: "Optical",
                      used: 5000,
                      total: 25000,
                      percentage: (5000 / 25000) * 100,
                    },
                  ].map((benefit) => (
                    <div key={benefit.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[0.83rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                          {benefit.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          Ksh. {benefit.used.toLocaleString()} / Ksh{" "}
                          {benefit.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${benefit.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Schedule Section */}
              <div className="md:w-[30%] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-600 mb-0.5 dark:text-gray-300 flex items-center">
                  Payment Schedule
                </h3>
                <p className="text-[0.8rem] text-gray-600 dark:text-gray-400 mb-2">
                  Your preferred coverage payment plan
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <PiClockCountdownDuotone className="h-6 w-6 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Next Payment:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {nextPaymentDate}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <PiMoneyWavy className="h-6 w-6 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Amount:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {userSubscription
                        ? `KES ${userSubscription.plan.premiums[
                            userSubscription.frequency
                          ].toLocaleString()}`
                        : "KES 500.00"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <TbActivity className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Frequency:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {userSubscription ? userSubscription.frequency : "Weekly"}
                    </span>
                  </div>
                  <button
                    className="w-full justify-center text-sm text-secondary-600 hover:text-green-700 "
                    onClick={handleOpenFrequencyModal}
                    disabled={!userSubscription}
                  >
                    Change Details
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Payments Section */}
            <div className="mt-8">
              <h3 className="text-base md:text-lg font-semibold text-green-700 pl-4 mb-1.5  flex items-center">
                <MdPayments className="mr-2 h-6 w-6 text-green-700" />
                Recent Payments
              </h3>
              <PaymentHistory />
            </div>

            {/* Documents Section */}
            <div className="bg-white mt-10 dark:bg-gray-800 rounded-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h3 className="text-base md:text-lg font-semibold text-green-700 pl-4 flex items-center">
                  <PiFilesDuotone className="mr-2 h-7 w-7 text-green-700" />
                  Uploaded Documents
                </h3>
                <button
                  onClick={handleFileUploadClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                >
                  <FiUpload className="mr-2 -ml-1 h-4 w-4" />
                  Upload New Document
                </button>
              </div>

              {uploadProgress > 0 && (
                <div className="mb-6 px-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Uploading document...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {isLoadingDocs ? (
                <div className="py-8 flex justify-center">
                  <svg
                    className="animate-spin h-8 w-8 text-primary-600"
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
                </div>
              ) : documents.length === 0 ? (
                <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-900/50 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-center">
                    <PiFilesDuotone className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      Your insurance documents and receipts will appear here.
                    </p>
                    <button
                      onClick={handleFileUploadClick}
                      className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                          {doc.mimeType.startsWith("image/") ? (
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
                        <PiImageDuotone className="h-6 w-6 text-blue-500" />
                      </div>
                    ) : doc.mimeType === "application/pdf" ? (
                      <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <PiFilePdfDuotone className="h-6 w-6 text-red-500" />
                      </div>
                    )  : (
                              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <svg
                                  className="h-6 w-6 text-blue-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {doc.name}
                            </h4>
                            <div className="mt-1 flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {doc.type}
                              </span>
                              <span className="mx-1.5 text-gray-300 dark:text-gray-600">
                                •
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {(doc.fileSize / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            {doc.isVerified && (
                              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-4 items-center">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600  hover:text-primary-700 dark:hover:text-gray-300 "
                          >
                            <TbDownload className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            disabled={isSubmitting}
                            className="text-red-600/70 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <TbTrash className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Frequency Modal */}
      {userSubscription && (
        <ChangeFrequencyModal
          isOpen={isFrequencyModalOpen}
          onClose={handleCloseFrequencyModal}
          currentPlan={userSubscription.plan}
          currentFrequency={userSubscription.frequency}
          onFrequencyChanged={handleFrequencyChanged}
        />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        documentData={documentData}
        setDocumentData={setDocumentData}
        handleDocumentDataChange={handleDocumentDataChange}
        handleDocumentFileChange={handleDocumentFileChange}
        handleDocumentSubmit={handleDocumentSubmit}
        isSubmitting={isSubmitting}
        fileError={fileError}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DashboardPage;
