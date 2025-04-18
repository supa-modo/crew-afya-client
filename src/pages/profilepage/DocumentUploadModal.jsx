import React from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { TbUpload, TbFileUpload, TbAlertCircle, TbX } from "react-icons/tb";
import { motion } from "framer-motion";

const DocumentUploadModal = ({
  showUploadModal,
  setShowUploadModal,
  documentData,
  setDocumentData,
  handleDocumentDataChange,
  handleDocumentFileChange,
  handleDocumentSubmit,
  isSubmitting,
  fileError,
}) => {
  if (!showUploadModal) return null;

  const handleRemoveFile = () => {
    setDocumentData((prev) => ({
      ...prev,
      file: null,
    }));
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto backdrop-blur-[1.5px]">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75 "
          aria-hidden="true"
          onClick={() => setShowUploadModal(false)}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle max-w-xl w-full border border-gray-200 dark:border-gray-700 relative z-[10000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center py-3 px-4">
              <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-400 ">
                <span>Upload a Document</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>

          <div className="px-2.5 sm:px-6 py-2 sm:py-4">
            {fileError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <TbAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {fileError}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            <form onSubmit={handleDocumentSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="docName"
                    className="block text-[0.83rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                  >
                    Document Name
                  </label>
                  <input
                    type="text"
                    id="docName"
                    name="docName"
                    value={documentData.name}
                    onChange={handleDocumentDataChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 dark:bg-gray-700 text-gray-600 dark:text-white text-[0.83rem] sm:text-sm font-medium"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="docType"
                    className="block text-[0.83rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                  >
                    Document Type
                  </label>
                  <select
                    id="docType"
                    name="docType"
                    value={documentData.type}
                    onChange={handleDocumentDataChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 dark:bg-gray-700 text-gray-600 dark:text-white text-[0.83rem] sm:text-sm font-medium"
                    required
                  >
                    <option value="">Select document type</option>
                    <option value="identity">Identity Document</option>
                    <option value="insurance">Insurance</option>
                    <option value="medical">Medical Record</option>
                    <option value="receipt">Receipt</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="docDescription"
                    className="block text-[0.83rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="docDescription"
                    name="docDescription"
                    value={documentData.description}
                    onChange={handleDocumentDataChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 dark:bg-gray-700 text-gray-600 dark:text-white text-[0.83rem] sm:text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[0.83rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    File to Upload
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      {documentData.file ? (
                        <div className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-center items-center mb-2">
                            <span className="font-medium text-secondary-600 dark:text-secondary-400">
                              {documentData.file.name}
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                            >
                              <TbX className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="mt-1">
                            {(documentData.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <>
                          <FiUploadCloud className="mx-auto h-10 sm:h-12 w-10 sm:w-12 mb-2 text-gray-400" />
                          <div className="flex text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleDocumentFileChange}
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, PDF, DOC up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-4 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !documentData.file}
                  className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="mr-2 -ml-1 h-5 w-5" />
                      Upload Document
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
