import { useEffect, useState } from "react";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
  TbCloudUpload,
  TbDownload,
  TbTrash,
  TbCheck,
  TbFileUpload,
  TbAlertTriangle,
} from "react-icons/tb";
import {
  PiFilePdfDuotone,
  PiFilesDuotone,
  PiImageDuotone,
  PiWarningDuotone,
} from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { deleteUserDocument } from "../../services/documentService";

const DocumentsTab = ({
  documents,
  isLoadingDocs,
  uploadProgress,
  hasIdDocument,
  handleFileUploadClick,
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
        setIsSubmitting(true);
        const response = await deleteUserDocument(documentToDelete.id);

        if (response?.success) {
          await fetchDocuments();
          setMessage({
            type: "success",
            text: response.message || "Document deleted successfully",
          });
        } else {
          throw new Error(response?.message || "Failed to delete document");
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        setMessage({
          type: "error",
          text: error.message || "Failed to delete document. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="bg-gradient-to-r from-primary-600/10 to-primary-600/5 dark:from-primary-900/20 dark:to-primary-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-primary-800 dark:text-primary-500 flex items-center">
            <PiFilesDuotone className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            <span>My Documents</span>
          </h2>
          <button
            type="button"
            onClick={handleFileUploadClick}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer flex items-center justify-center"
          >
            <TbCloudUpload className="mr-2 -ml-1 h-5 w-5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <AnimatePresence>
          {/* ID Document Check Alert */}
          {!hasIdDocument && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <TbAlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Identification Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                    <p>
                      Please upload your identification document to complete
                      your profile.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleFileUploadClick}
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-yellow-700 bg-amber-200 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                    >
                      <TbFileUpload className="h-4 w-4" />
                      <span>Upload ID Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {uploadProgress > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span>Uploading document...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full"
                ></motion.div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <PiWarningDuotone className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-400">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <PiFilesDuotone className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              No documents
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by uploading a document.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleFileUploadClick}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <TbCloudUpload className="mr-2 -ml-1 h-5 w-5" />
                <span>Upload Document</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {doc.mimeType?.startsWith("image/") ? (
                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <PiImageDuotone className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                        </div>
                      ) : doc.mimeType === "application/pdf" ? (
                        <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <PiFilePdfDuotone className="h-7 w-7 text-red-500 dark:text-red-400" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <PiFilesDuotone className="h-7 w-7 text-blue-500 dark:text-blue-400" />
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
                        <span className="mx-1.5 text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(doc.createdAt)}
                        </span>
                      </div>
                      {doc.isVerified && (
                        <span className="inline-flex items-center mt-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <TbCheck className="mr-1 h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3 items-center">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <TbDownload className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleDeleteClick(doc)}
                      disabled={isSubmitting}
                      className="text-red-500/60 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <TbTrash className="h-5 w-5" />
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
        />
      </div>
    </div>
  );
};

export default DocumentsTab;
