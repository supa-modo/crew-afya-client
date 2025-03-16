import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiUpload,
  FiSave,
  FiTrash2,
  FiFile,
  FiHome,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
} from "../services/documentService";
import {
  updateUserProfile,
  changeUserPassword,
  requestPhoneVerification,
  verifyPhoneNumber,
} from "../services/userService";
import { Link } from "react-router-dom";
import SecurityTab from "../components/profile/SecurityTab";
import DocumentsTab from "../components/profile/DocumentsTab";
import PersonalInfoTab from "../components/profile/PersonalInfoTab";
import DocumentUploadModal from "../components/profile/DocumentUploadModal";
import PhoneVerificationModal from "../components/profile/PhoneVerificationModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import {
  PiFilesDuotone,
  PiLockKeyDuotone,
  PiUserDuotone,
  PiUserGearDuotone,
} from "react-icons/pi";
import { TbHome2, TbLockFilled } from "react-icons/tb";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    otherNames: user?.otherNames || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Add new state for documents
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentData, setDocumentData] = useState({
    name: "",
    type: "",
    description: "",
    file: null,
  });
  const [hasIdDocument, setHasIdDocument] = useState(false);
  const [fileError, setFileError] = useState("");

  // Phone verification states
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] =
    useState(false);
  const [verificationStep, setVerificationStep] = useState("request");
  const [verificationCode, setVerificationCode] = useState("");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");

  // Add new state for document deletion confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      const response = await getUserDocuments();
      setDocuments(response.data);

      // Check if user has uploaded an ID document
      const hasId = response.data.some((doc) => doc.type === "identity");
      setHasIdDocument(hasId);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to fetch documents",
      });
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();

    // Check if phone number has changed
    if (formData.phoneNumber !== user.phoneNumber) {
      setOriginalPhoneNumber(user.phoneNumber);
      setShowPhoneVerificationModal(true);
      return;
    }

    await updateProfile();
  };

  const updateProfile = async () => {
    try {
      setIsSubmitting(true);
      const response = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        otherNames: formData.otherNames,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      // Fix: Check if updateUser exists in the auth context before calling it
      if (typeof updateUser === "function") {
        updateUser(response.data);
      } else {
        // If updateUser is not available, at least update the local state
        setFormData((prev) => ({
          ...prev,
          firstName: response.data.firstName || prev.firstName,
          lastName: response.data.lastName || prev.lastName,
          otherNames: response.data.otherNames || prev.otherNames,
          email: response.data.email || prev.email,
          phoneNumber: response.data.phoneNumber || prev.phoneNumber,
        }));
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });

      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await changeUserPassword(formData.currentPassword, formData.newPassword);

      setMessage({
        type: "success",
        text: "Password changed successfully",
      });

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUploadClick = () => {
    // Open the upload modal instead of directly opening the file dialog
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

      // Upload the document - make sure we're passing the correct parameters
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

      setMessage({
        type: "success",
        text: "Document uploaded successfully",
      });

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
        setMessage({
          type: "error",
          text: error.message || "Failed to upload document",
        });
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

        setMessage({
          type: "success",
          text: "Document deleted successfully",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to delete document",
        });
      } finally {
        setIsSubmitting(false);
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleDeleteDocument = (documentId) => {
    const document = documents.find((doc) => doc.id === documentId);
    if (document) {
      handleDeleteClick(document);
    }
  };

  const handleRequestVerificationCode = async () => {
    try {
      setIsSubmitting(true);
      await requestPhoneVerification(formData.phoneNumber);
      setVerificationStep("verify");

      setMessage({
        type: "success",
        text: "Verification code sent to your phone",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send verification code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneNumber = async () => {
    try {
      setIsSubmitting(true);
      await verifyPhoneNumber(formData.phoneNumber, verificationCode);

      // Close modal and update profile
      setShowPhoneVerificationModal(false);
      await updateProfile();

      setMessage({
        type: "success",
        text: "Phone number verified and profile updated successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to verify phone number",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-16 px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link
            to="/"
            className="hover:text-primary-600 dark:hover:text-primary-400 items-center"
          >
            <TbHome2 className="inline mr-2 h-5 w-5" />
            <span>Home</span>
          </Link>
          <FiChevronRight className="mx-2 h-4 w-4" />
          <span className="text-gray-700 dark:text-gray-300">
            Profile Management
          </span>
        </div>
      </div>

      <div className="mb-6 pl-4">
        <h1 className="text-lg md:text-xl font-bold text-green-700 ">
          Your Account Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information, documents and your passwords.
        </p>
      </div>

      {message.text && (
        <div className="mb-4">
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            } flex items-center`}
          >
            {message.type === "success" ? (
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 sm:px-6 py-6">
              <div className="flex flex-col items-center">
                <div className="flex sm:flex-col flex-row sm:space-x-0 space-x-4 items-center ">
                  <div className="h-24 w-24 rounded-full bg-primary-200 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 text-3xl font-bold mb-4">
                    {/* {user?.firstName?.charAt(0) user?.lastName?.charAt(0) || ( */}
                    <PiUserDuotone className="h-12 w-12" />
                    {/* )} */}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-center font-semibold text-zinc-600 dark:text-white">
                      {user?.firstName || "John"} {user?.otherNames || "Smith"}{" "}
                      {user?.lastName || "Doe"}
                    </h2>
                    <p className="text-sm sm:text-center text-gray-500 dark:text-gray-400 mb-2">
                      {user?.email || "john.doe@example.com"}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-primary-600 h-1.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Profile completion: 75%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "personal"
                      ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <PiUserGearDuotone
                    className={`h-6 w-6 mr-3 ${
                      activeTab === "personal"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span>Personal Information</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "security"
                      ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <TbLockFilled
                    className={`h-6 w-6 mr-3 ${
                      activeTab === "security"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "documents"
                      ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <PiFilesDuotone
                    className={`h-6 w-6 mr-3 ${
                      activeTab === "documents"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span>Documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {activeTab === "personal" && (
              <PersonalInfoTab
                formData={formData}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handleSubmit={handlePersonalInfoSubmit}
                setIsEditing={setIsEditing}
              />
            )}

            {activeTab === "security" && (
              <SecurityTab
                formData={formData}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handlePasswordSubmit={handlePasswordSubmit}
                userData={user}
                refreshUserData={() => {
                  // Refresh user data after phone verification
                  if (typeof updateUser === "function") {
                    updateUser({ ...user, phoneVerified: true });
                  }
                  setMessage({
                    type: "success",
                    text: "Phone number verified successfully",
                  });
                }}
              />
            )}

            {activeTab === "documents" && (
              <DocumentsTab
                documents={documents}
                isLoadingDocs={isLoadingDocs}
                uploadProgress={uploadProgress}
                hasIdDocument={hasIdDocument}
                handleFileUploadClick={handleFileUploadClick}
                handleDeleteDocument={handleDeleteDocument}
                setShowUploadModal={setShowUploadModal}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>

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

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        show={showPhoneVerificationModal}
        handleClose={() => setShowPhoneVerificationModal(false)}
        phone={formData.phoneNumber}
        onVerificationComplete={handleVerifyPhoneNumber}
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

export default ProfilePage;
