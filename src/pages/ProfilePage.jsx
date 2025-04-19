import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  uploadDocument,
  getUserDocuments,
  deleteUserDocument,
} from "../services/documentService";
import {
  updateUserProfile,
  changeUserPassword,
  requestPhoneVerification,
  verifyPhoneNumber,
} from "../services/userService";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toast";
import SecurityTab from "./profilepage/SecurityTab";
import DocumentsTab from "./profilepage/DocumentsTab";
import PersonalInfoTab from "./profilepage/PersonalInfoTab";
import DocumentUploadModal from "./profilepage/DocumentUploadModal";
import PhoneVerificationModal from "./profilepage/PhoneVerificationModal";
import DependantsTab from "./profilepage/DependantsTab";
import {
  PiUser,
  PiUserDuotone,
  PiFilesDuotone,
} from "react-icons/pi";
import {
  TbChevronRight,
  TbAlertTriangle,
  TbHome2,
  TbLockSquareRounded,
} from "react-icons/tb";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // State for user data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    otherNames: user?.otherNames || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    idNumber: user?.idNumber || "",
    gender: user?.gender || "",
    county: user?.county || "",
    sacco: user?.sacco || "",
    route: user?.route || "",
    membershipNumber: user?.membershipNumber || "",
    membershipStatus: user?.membershipStatus || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [activeTab, setActiveTab] = useState("personal-details");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(50);
  const [missingProfileItems, setMissingProfileItems] = useState([]);

  // Document states
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
  const [passwordError, setPasswordError] = useState("");

  // Phone verification states
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] =
    useState(false);
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");

  // Fetch user data and documents on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Calculate profile completion percentage
  useEffect(() => {
    calculateProfileCompletion();
  }, [user, documents, hasIdDocument]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      await fetchDocuments();
    } catch (error) {
      console.error("Error fetching user data:", error);
      showErrorToast("Failed to fetch user data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    let percentage = 50; // Base percentage after registration
    let missingItems = [];

    // Add 25% if user has ID document
    if (hasIdDocument) {
      percentage += 25;
    } else {
      missingItems.push("Upload your ID document");
    }

    // Add 25% if membership status is active
    if (user?.membershipStatus === "active") {
      percentage += 25;
    } else {
      missingItems.push("Activate membership");
    }

    setProfileCompletionPercentage(percentage);
    setMissingProfileItems(missingItems);
  };

  const fetchDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      const response = await getUserDocuments();

      // Process document data
      if (response && response.data) {
        setDocuments(response.data || []);
        const docs = Array.isArray(response.data) ? response.data : [];
        const hasId = docs.some((doc) => doc.type === "identity");
        setHasIdDocument(!!hasId);
      } else {
        setDocuments(response || []);
        const docs = Array.isArray(response) ? response : [];
        const hasId = docs.some((doc) => doc.type === "identity");
        setHasIdDocument(!!hasId);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      showErrorToast("Failed to fetch documents. Please try again.");
      setHasIdDocument(false);
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
        gender: formData.gender,
        county: formData.county,
        sacco: formData.sacco,
        route: formData.route,
      });

      if (typeof updateUser === "function") {
        updateUser(response.data);
      } else {
        setFormData((prev) => ({
          ...prev,
          firstName: response.data.firstName || prev.firstName,
          lastName: response.data.lastName || prev.lastName,
          otherNames: response.data.otherNames || prev.otherNames,
          email: response.data.email || prev.email,
          phoneNumber: response.data.phoneNumber || prev.phoneNumber,
          gender: response.data.gender || prev.gender,
          county: response.data.county || prev.county,
          sacco: response.data.sacco || prev.sacco,
          route: response.data.route || prev.route,
        }));
      }

      showSuccessToast("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      showErrorToast(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      showErrorToast("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      setPasswordError("");
      await changeUserPassword(formData.currentPassword, formData.newPassword);

      showSuccessToast("Password changed successfully");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      // Set specific error message from the API response
      const errorMessage = error.message || "Failed to change password";
      setPasswordError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
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

    // Validation
    if (!documentData.name.trim()) {
      setFileError("Document name is required");
      return;
    }

    if (!documentData.type) {
      setFileError("Document type is required");
      return;
    }

    if (!documentData.file) {
      setFileError("Please select a file to upload");
      return;
    }

    setFileError("");
    setIsSubmitting(true);
    setUploadProgress(0);

    // Setup a progress interval to show simulated progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 90) {
        progress = 90;
        clearInterval(progressInterval);
      }
      setUploadProgress(Math.min(progress, 90));
    }, 300);

    try {
      // Upload the document
      const formData = new FormData();
      formData.append("file", documentData.file);
      formData.append("name", documentData.name);
      formData.append("type", documentData.type);
      formData.append("description", documentData.description || "");

      const response = await uploadDocument(formData);

      // Clear the progress interval
      clearInterval(progressInterval);

      // Set progress to 100% to indicate completion
      setUploadProgress(100);

      // Clear the form and close the modal
      setDocumentData({
        name: "",
        type: "",
        description: "",
        file: null,
      });
      setShowUploadModal(false);

      // Refresh the documents list
      await fetchDocuments();

      showSuccessToast("Document uploaded successfully");
    } catch (error) {
      // Clear the progress interval if it exists
      if (progressInterval) clearInterval(progressInterval);

      console.error("Document upload error:", error);

      // Set specific error message based on the error
      if (error.message && error.message.includes("file")) {
        setFileError(error.message);
      } else {
        showErrorToast("Failed to upload document. Please try again.");
        // Close the modal to show the error message
        setShowUploadModal(false);
      }
    } finally {
      setIsSubmitting(false);
      // Don't reset upload progress immediately to show completion or failure
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      setIsSubmitting(true);
      await deleteUserDocument(documentId);
      await fetchDocuments();

      showSuccessToast("Document deleted successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to delete document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneNumber = async (phoneNumber, verificationCode) => {
    try {
      setIsSubmitting(true);
      await verifyPhoneNumber(phoneNumber, verificationCode);

      // Close modal and update profile
      setShowPhoneVerificationModal(false);
      await updateProfile();

      showSuccessToast(
        "Phone number verified and profile updated successfully"
      );
    } catch (error) {
      showErrorToast(error.message || "Failed to verify phone number");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which content to show based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal-details":
        return (
          <PersonalInfoTab
            formData={formData}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleSubmit={handlePersonalInfoSubmit}
            setIsEditing={setIsEditing}
          />
        );

      // case "dependants":
      //   return <DependantsTab userId={user?.id} isLoading={isLoading} />;

      case "security":
        return (
          <SecurityTab
            formData={formData}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handlePasswordSubmit={handlePasswordSubmit}
            userData={user}
            errorMessage={passwordError}
            refreshUserData={() => {
              if (typeof updateUser === "function") {
                updateUser({ ...user, phoneVerified: true });
              }
            }}
          />
        );
      case "documents":
        return (
          <DocumentsTab
            documents={documents}
            isLoadingDocs={isLoadingDocs}
            uploadProgress={uploadProgress}
            hasIdDocument={hasIdDocument}
            handleFileUploadClick={handleFileUploadClick}
            handleDeleteDocument={handleDeleteDocument}
            setShowUploadModal={setShowUploadModal}
            setIsSubmitting={setIsSubmitting}
            fetchDocuments={fetchDocuments}
          />
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  // Render the tab navigation based on dashboard pattern
  const renderTabNavigation = () => {
    const tabs = [
      {
        id: "personal-details",
        label: "Personal Details",
        icon: <PiUser className="h-5 sm:h-6 w-5 sm:w-6" />,
        color: "from-primary-500/20 to-primary-600/10",
        iconColor: "text-primary-600",
        textColor: "text-primary-600 dark:text-primary-300",
      },
      // {
      //   id: "dependants",
      //   label: "Dependants",
      //   icon: <PiUsersThreeDuotone className="h-5 w-5" />,
      //   color: "from-emerald-500/10 to-emerald-600/10",
      //   activeColor: "bg-emerald-600 text-white",
      //   iconColor: "text-emerald-600",
      // },
      {
        id: "documents",
        label: "Documents",
        icon: <PiFilesDuotone className="h-5 sm:h-6 w-5 sm:w-6" />,
        color: "from-blue-500/20 to-blue-600/10",
        iconColor: "text-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        id: "security",
        label: "Security",
        icon: <TbLockSquareRounded className="h-5 sm:h-6 w-5 sm:w-6" />,
        color: "from-amber-500/20 to-amber-600/10",
        iconColor: "text-amber-600",
        textColor: "text-amber-600 ",
      },
    ];

    return (
      <div className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-gradient-to-br ${tab.color} ${tab.textColor}`
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div
              className={`mr-3 ${
                activeTab === tab.id ? tab.iconColor : "text-gray-500"
              }`}
            >
              {tab.icon}
            </div>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="ml-auto">
                <TbChevronRight className="h-4 w-4" />
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50/60 to-gray-100/60 dark:from-gray-900/60 dark:to-gray-800/60 min-h-screen pb-10">
      <div className="pt-20 sm:pt-24 max-w-screen-2xl mx-auto px-0 sm:px-2 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 px-2">
          <div className="flex items-center text-[0.8rem] sm:text-sm text-gray-500 dark:text-gray-400">
            <Link
              to="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 items-center"
            >
              <TbHome2 className="inline mr-2 h-5 w-5" />
              <span>Home</span>
            </Link>

            <TbChevronRight className="mx-2 h-4 w-4" />
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 items-center"
            >
              <span className="">Dashboard</span>
            </Link>

            <TbChevronRight className="mx-2 h-4 w-4" />
            <span className="text-secondary-700 dark:text-secondary-500 font-medium">
              Profile
            </span>
          </div>
        </div>

        <div className="px-2 mt-6">
          {/* Document upload modal */}
          {showUploadModal && (
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
          )}

          {/* Phone verification modal */}
          <PhoneVerificationModal
            show={showPhoneVerificationModal}
            handleClose={() => setShowPhoneVerificationModal(false)}
            phone={formData.phoneNumber}
            onVerificationComplete={handleVerifyPhoneNumber}
          />

          {/* Header */}
          <div className="mb-6">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-700 dark:text-secondary-500">
                Account Profile
              </h1>
              <p className="text-[0.83rem] sm:text-sm text-gray-500 mt-1">
                Manage your personal information, documents and your passwords.
              </p>
            </div>
          </div>

          {/* Profile Completion Warning - Only show if less than 100% */}
          {profileCompletionPercentage < 100 && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 shadow-sm">
              <div className="">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <TbAlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-[0.8rem] sm:text-sm font-medium text-amber-800 dark:text-amber-300">
                    Profile completion: {profileCompletionPercentage}%
                  </h3>
                </div>

                <div className="mt-1 sm:mt-2 pl-2 sm:pl-4 text-[0.8rem] sm:text-sm text-amber-700 dark:text-amber-300">
                  {missingProfileItems.length > 0 && (
                    <ul className="mt-1 pl-4 list-disc">
                      {missingProfileItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-4 md:gap-6">
            {/* Left Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden">
                {/* User Profile Overview */}
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center">
                    <div className="w-20 sm:w-28 h-20 sm:h-28 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <PiUserDuotone className="w-14 sm:w-20 h-14 sm:h-20 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-[0.83rem] sm:text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || user?.phoneNumber}
                    </p>
                    <p className="mt-1 sm:mt-2 text-[0.78rem] sm:text-[0.83rem] text-gray-500 dark:text-gray-400">
                      Member No:{" "}
                      <span className="font-medium text-[0.75rem] sm:text-[0.8rem] text-gray-600 dark:text-gray-300">
                        {user?.membershipNumber}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-4 px-2">
                  <h3 className="text-[0.7rem] sm:text-xs font-semibold text-secondary-700 dark:text-secondary-500 uppercase tracking-wider mb-3 px-2">
                    Account Settings
                  </h3>
                  {renderTabNavigation()}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white dark:bg-gray-900 shadow rounded-xl overflow-hidden">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
