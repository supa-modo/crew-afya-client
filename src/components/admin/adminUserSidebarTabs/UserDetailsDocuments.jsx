import React, { useState } from "react";
import {
  FiDownload,
  FiEye,
  FiUpload,
  FiTrash2,
  FiCheck,
  FiX,
  FiCalendar,
  FiFile,
} from "react-icons/fi";
import {
  PiFilePdfDuotone,
  PiFilesDuotone,
  PiImageDuotone,
} from "react-icons/pi";
import {
  TbCalendarDot,
  TbCheck,
  TbDownload,
  TbFileText,
  TbTrash,
  TbUpload,
} from "react-icons/tb";

const UserDetailsDocuments = ({ user }) => {
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUploadClick = () => {
    setUploadingDocument(true);
  };

  const handleCancelUpload = () => {
    setUploadingDocument(false);
    setDocumentType("");
    setDocumentName("");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      if (!documentName) {
        setDocumentName(e.target.files[0].name.split(".")[0]);
      }
    }
  };

  const handleSubmitUpload = () => {
    // This would be implemented with an actual API call
    console.log("Uploading document:", {
      documentType,
      documentName,
      file: selectedFile,
    });

    // Mock success response
    handleCancelUpload();
  };

  const handleVerifyDocument = (documentId) => {
    // This would be implemented with an actual API call
    console.log("Verifying document:", documentId);
  };

  const handleDeleteDocument = (documentId) => {
    // This would be implemented with an actual API call
    console.log("Deleting document:", documentId);
  };

  const handleViewDocument = (fileUrl) => {
    // This would open a document preview or download it
    console.log("Viewing document:", fileUrl);
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-secondary-800/90 dark:text-secondary-600">
          <PiFilesDuotone className="h-6 w-6" />
          <span className="">Documents</span>
        </h2>
        <button
          type="button"
          onClick={handleUploadClick}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
        >
          <TbUpload className="mr-1.5 h-4 w-4" /> Upload Document
        </button>
      </div>

      {uploadingDocument && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-xl p-4 border border-admin-200 dark:border-admin-700">
          <h4 className="text-md font-semibold text-admin-700 dark:text-white mb-4">
            Upload New Document
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Document Type</option>
                <option value="identity">Identity Document</option>
                <option value="medical">Medical Report</option>
                <option value="insurance">Insurance Certificate</option>
                <option value="family">Family Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="shadow-sm py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter document name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-admin-600 hover:text-admin-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG up to 10MB
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-admin-600 dark:text-admin-400">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancelUpload}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitUpload}
              disabled={!documentType || !documentName || !selectedFile}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}

      {user.documents && user.documents.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow overflow-hidden rounded-xl">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {user.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <div className="flex items-start justify-between">
                  <div className="">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {doc?.mimeType?.startsWith("image/") ? (
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
                              <PiImageDuotone className="h-6 w-6 text-blue-500" />
                            </div>
                          ) : doc?.mimeType === "application/pdf" ? (
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
                          </div>
                          {doc.isVerified && (
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 pl-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <TbCalendarDot className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span>Uploaded on {formatDate(doc.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 items-center">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-600  hover:text-secondary-700 dark:hover:text-gray-300 "
                    >
                      <TbDownload className="h-5 w-5" />
                    </a>
                    <button
                      // onClick={() => handleDeleteDocument(doc.id)}
                      // disabled={isSubmitting}
                      className="text-red-600/70 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <TbTrash className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No documents found.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsDocuments;
