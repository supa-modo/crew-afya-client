import React from "react";
import { FiX } from "react-icons/fi";
import { TbUpload } from "react-icons/tb";

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-secondary-700 dark:text-white">
                    Upload a Document
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  {fileError && (
                    <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700 dark:text-red-400">
                            {fileError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleDocumentSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="docName"
                          className="text-left block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                        >
                          Document Name
                        </label>
                        <input
                          type="text"
                          id="docName"
                          name="docName"
                          value={documentData.name}
                          onChange={handleDocumentDataChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="docType"
                          className="text-left block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                        >
                          Document Type
                        </label>
                        <select
                          id="docType"
                          name="docType"
                          value={documentData.type}
                          onChange={handleDocumentDataChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                          className="text-left block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
                        >
                          Description (Optional)
                        </label>
                        <textarea
                          id="docDescription"
                          name="docDescription"
                          value={documentData.description}
                          onChange={handleDocumentDataChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-left block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1">
                          File to Upload
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            {documentData.file ? (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-center items-center mb-2">
                                  <span className="font-medium text-primary-600 dark:text-primary-400">
                                    {documentData.file.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                                  >
                                    <FiX className="h-5 w-5" />
                                  </button>
                                </div>
                                <p className="mt-1">
                                  {(documentData.file.size / 1024).toFixed(1)}{" "}
                                  KB
                                </p>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
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
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG, PDF, DOC up to 5MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={isSubmitting || !documentData.file}
                        className="w-full text-sm md:text-base inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TbUpload className="mr-2 -ml-1 h-5 w-5" />
                        {isSubmitting ? "Uploading..." : "Upload"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
