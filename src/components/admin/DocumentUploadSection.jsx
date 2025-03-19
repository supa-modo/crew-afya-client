import React, { useRef } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { TbCloudUpload, TbFileUpload } from "react-icons/tb";
import { PiFilesDuotone } from "react-icons/pi";

const DocumentUploadSection = ({ documents, setDocuments }) => {
  const fileInputRef = useRef(null);
  const [uploadingDocument, setUploadingDocument] = React.useState(false);
  const [documentType, setDocumentType] = React.useState("");
  const [documentName, setDocumentName] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const documentTypes = [
    { value: "identity", label: "Identity Document" },
    { value: "medical", label: "Medical Report" },
    { value: "insurance", label: "Insurance Certificate" },
    { value: "family", label: "Family Certificate" },
    { value: "other", label: "Other" },
  ];

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      if (!documentName) {
        setDocumentName(e.target.files[0].name.split(".")[0]);
      }
    }
  };

  const handleAddDocument = () => {
    setUploadingDocument(true);
  };

  const handleCancelUpload = () => {
    setUploadingDocument(false);
    setDocumentType("");
    setDocumentName("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitUpload = () => {
    if (!documentType || !documentName || !selectedFile) return;

    // Create a new document
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: documentName,
      type: documentType,
      uploadDate: new Date().toISOString(),
      verified: false,
      fileUrl: URL.createObjectURL(selectedFile),
      file: selectedFile,
      size: selectedFile.size,
    };

    setDocuments([...documents, newDocument]);
    handleCancelUpload();
  };

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };

  return (
    <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-600/90 dark:text-white flex items-center">
          <PiFilesDuotone className="mr-2 h-6 w-6 text-admin-500" />
          Upload Documents
        </h2>
        <button
          type="button"
          onClick={handleAddDocument}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
        >
          <TbCloudUpload className="mr-1.5 h-4 w-4" /> Upload Document
        </button>
      </div>

      {/* Document upload form */}
      {uploadingDocument && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-xl p-4 border border-admin-300 dark:border-admin-700 mb-6">
          <h4 className="text-md font-semibold text-secondary-800 dark:text-white mb-4">
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
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
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
                        ref={fileInputRef}
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitUpload}
              disabled={!documentType || !documentName || !selectedFile}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}

      {/* Document list */}
      {documents.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow-md border border-admin-300 dark:border-admin-700 overflow-hidden rounded-xl">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
              <li key={doc.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <TbFileUpload className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </h4>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                      Type: {doc.type}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiUpload className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>
                        {doc.size
                          ? `${(doc.size / 1024).toFixed(1)} KB`
                          : "Unknown size"}
                      </span>
                    </div>
                  </div>
                  <div>
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
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6 text-center">
          <PiFilesDuotone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No documents uploaded
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by uploading identity documents for the user.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadSection;
