import React from "react";
import {
  PiFilesDuotone,
  PiFilePdfDuotone,
  PiImageDuotone,
} from "react-icons/pi";
import { TbDownload, TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const DocumentsSection = ({
  documents,
  isLoadingDocs,
  handleDeleteDocument,
  isSubmitting,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white pt-3  my-8 md:my-10 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-base md:text-lg font-semibold text-green-700 pl-4 flex items-center">
          <PiFilesDuotone className="mr-2 h-7 w-7 text-green-700" />
          Your Uploaded Documents
        </h3>
      </div>

      
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
        <div className="flex items-center justify-center m-6 px-2 sm:px-4 md:px-6 h-48 bg-gray-50 dark:bg-gray-900/50 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-center">
            <PiFilesDuotone className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Your insurance documents and receipts will appear here.
            </p>
            <button
              onClick={() => {
                navigate("/profile");
              }}
              className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Upload Your Documents from the profile page
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {doc.mimeType?.startsWith("image/") ? (
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
                    </div>
                    {doc.isVerified && (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4 items-center">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:hover:text-gray-300"
                  >
                    <TbDownload className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    disabled={isSubmitting}
                    className="text-red-600/70 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <TbTrash className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;
