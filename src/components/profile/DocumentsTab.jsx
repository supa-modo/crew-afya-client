import { useState } from "react";
import { FiFile, FiUpload, FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../common/ConfirmationModal";
import { TbCloudUpload, TbDownload, TbTrash } from "react-icons/tb";
import {
  PiFilePdfDuotone,
  PiFilesDuotone,
  PiImageDuotone,
} from "react-icons/pi";

const DocumentsTab = ({
  documents,
  isLoadingDocs,
  uploadProgress,
  hasIdDocument,
  handleFileUploadClick,
  handleDeleteDocument,
  setShowUploadModal,
  isSubmitting,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      handleDeleteDocument(documentToDelete.id);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <PiFilesDuotone className="h-6 w-6 mx-2 text-secondary-700" />
          <span className="text-secondary-800 pl-1 dark:text-secondary-600">
            My Documents
          </span>
        </h2>
        <button
          type="button"
          onClick={handleFileUploadClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
        >
          <TbCloudUpload className="mr-2 -ml-1 h-5 w-5" />
          Upload Document
        </button>
      </div>

      {/* ID Document Check Alert */}
      {!hasIdDocument && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
          <div className="flex">
            <svg
              className="h-6 w-6 text-amber-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Identification Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                <p>
                  Please upload your identification document to complete your
                  profile.
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="inline-flex items-center space-x-2 px-4 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-amber-200 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <TbCloudUpload className="h-4 w-4" />
                  <span>Upload ID Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="mb-6">
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
        <div className="py-8 text-center">
          <PiFilesDuotone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No documents
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by uploading a document.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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
                    ) : (
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
                      <span className="mx-1.5 text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {doc.isVerified && (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
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
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <TbDownload className="h-6 w-6" />
                  </a>
                  <button
                    onClick={() => handleDeleteClick(doc)}
                    disabled={isSubmitting}
                    className="text-red-600/60 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <TbTrash className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
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
  );
};

export default DocumentsTab;
