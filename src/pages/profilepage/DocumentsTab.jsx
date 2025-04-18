import { useState } from "react";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
  FiUploadCloud,
  FiDownload,
  FiTrash2,
  FiCheck,
  FiUpload,
  FiAlertTriangle,
  FiFile,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DocumentsTab = ({
  documents,
  isLoadingDocs,
  uploadProgress,
  hasIdDocument,
  handleFileUploadClick,
  handleDeleteDocument,
  isSubmitting,
  setIsSubmitting,
  setMessage,
  fetchDocuments,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [error, setError] = useState(null);

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        await handleDeleteDocument(documentToDelete.id);
      } catch (error) {
        setError(error.message || "Failed to delete document");
      } finally {
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) {
      return <FiImage className="h-6 w-6 text-blue-500" />;
    } else if (mimeType === "application/pdf") {
      return <FiFileText className="h-6 w-6 text-red-500" />;
    } else {
      return <FiFile className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-6">
        <h2 className="text-base sm:text-xl font-semibold text-secondary-700 dark:text-secondary-500">
          Uploaded Documents
        </h2>
        <button
          type="button"
          onClick={handleFileUploadClick}
          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-[0.8rem] sm:text-sm text-white bg-secondary-700 hover:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-500"
        >
          <div className="flex items-center justify-center gap-2">
            <FiUploadCloud className="mr-2 -ml-1 h-5 w-5" />
            <span>Upload Document</span>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {/* ID Document Check Alert */}
        {!hasIdDocument && (
          <motion.div
            key="id-document-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-2 sm:mb-4 p-2 sm:p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-[0.83rem] sm:text-sm font-medium text-amber-700 dark:text-amber-500">
                  Identification Required
                </h3>
                <div className="mt-2 text-[0.8rem] sm:text-sm text-amber-700 dark:text-amber-500">
                  <p>
                    Please upload your identification document to complete your
                    profile.
                  </p>
                </div>
                <div className="mt-3 sm:mt-4">
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-[0.7rem] sm:text-[0.8rem] font-medium rounded-md text-amber-700 dark:text-amber-400 bg-amber-200/80 dark:bg-amber-800/20 hover:bg-amber-200 dark:hover:bg-amber-900/20 focus:outline-none dark:border dark:border-amber-800"
                  >
                    <FiUpload className="mr-1.5 h-4 w-4" />
                    Upload ID Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {uploadProgress > 0 && (
          <motion.div
            key="upload-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <div className="flex justify-between text-[0.8rem] sm:text-sm text-gray-700 mb-2">
              <span>Uploading document...</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
                className="bg-secondary-700 h-2 sm:h-2.5 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3 sm:mb-6 p-2 sm:p-4 rounded-md bg-red-50 border border-red-200"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-[0.83rem] sm:text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoadingDocs ? (
        <div className="py-12 flex justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 sm:py-12 text-center"
        >
          <div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center rounded-full bg-gray-100">
            <FiFileText className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-[0.83rem] sm:text-sm font-semibold text-gray-700">
            No documents!
          </h3>
          <p className="mt-2 text-[0.8rem] sm:text-sm text-gray-500">
            Upload a document to view them here.
          </p>
        </motion.div>
      ) : (
        <div className="mt-6 space-y-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-2 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 flex items-center justify-center">
                      {getFileIcon(doc.mimeType)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[0.83rem] sm:text-sm font-medium text-gray-600 dark:text-gray-200">
                      {doc.name}
                    </h4>
                    <div className="sm:mt-1 flex items-center text-[0.72rem] sm:text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{doc.type}</span>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>
                    {doc.isVerified && (
                      <span className="inline-flex items-center mt-1.5 px-2.5 py-px sm:py-0.5 rounded-full text-[0.65rem] sm:text-xs font-medium bg-secondary-100 dark:bg-secondary-900 border border-secondary-300 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200">
                        <FiCheck className="mr-1 h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-1 sm:space-x-3 items-center">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-600 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-100 "
                  >
                    <FiDownload className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => handleDeleteClick(doc)}
                    disabled={isSubmitting}
                    className="text-red-500/60 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-gray-100 "
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        confirmButtonClass={"bg-red-600 hover:bg-red-700 focus:ring-red-500 "}
      />
    </div>
  );
};

export default DocumentsTab;
