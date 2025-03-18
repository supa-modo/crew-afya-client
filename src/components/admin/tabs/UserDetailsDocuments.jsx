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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Documents
        </h3>
        <button
          type="button"
          onClick={handleUploadClick}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
        >
          <FiUpload className="mr-1.5 h-4 w-4" /> Upload Document
        </button>
      </div>

      {uploadingDocument && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4 border border-admin-200 dark:border-admin-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Upload New Document
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Name
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {user.documents.map((doc) => (
              <li key={doc.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </h4>
                      {doc.verified ? (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <FiCheck className="mr-1 h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <FiX className="mr-1 h-3 w-3" /> Pending
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                      Type: {doc.type}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>Uploaded on {formatDate(doc.uploadDate)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleViewDocument(doc.fileUrl)}
                      className="p-1 text-admin-600 hover:bg-admin-100 rounded-full dark:text-admin-400 dark:hover:bg-admin-900"
                      title="View Document"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDocument(doc.fileUrl)}
                      className="p-1 text-admin-600 hover:bg-admin-100 rounded-full dark:text-admin-400 dark:hover:bg-admin-900"
                      title="Download Document"
                    >
                      <FiDownload className="h-5 w-5" />
                    </button>
                    {!doc.verified && (
                      <button
                        type="button"
                        onClick={() => handleVerifyDocument(doc.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded-full dark:text-green-400 dark:hover:bg-green-900"
                        title="Verify Document"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900"
                      title="Delete Document"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
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
