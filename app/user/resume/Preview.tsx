"use client";
import React, { useState, useRef } from "react";
// NOTE: In a real Next.js app, you would import your server action like this:
// import { uploadFileAction } from './src/actions/uploadFileAction';

// -------------------------------------------------------------------------
// MOCK/EXAMPLE SERVER ACTION
// This stands in for your actual 'uploadFileAction.ts' for demonstration.
// It mimics the successful return structure.
// -------------------------------------------------------------------------
const mockUploadFileAction = async (prevState, formData) => {
  // Simulate server-side processing delay and file saving
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const file = formData.get("file");
  if (
    file &&
    file.size > 0 &&
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type)
  ) {
    // Mock a successful response with a public path
    const mockFilePath = `/uploads/${Date.now()}-${file.name.replace(
      / /g,
      "_"
    )}`;
    const isPdf = file.type === "application/pdf";

    console.log(`Mock upload successful. Public path: ${mockFilePath}`);

    return {
      success: true,
      message: `File "${file.name}" uploaded successfully!`,
      filePath: mockFilePath,
      isPdf: isPdf, // Mocking a check to know if we can embed it
    };
  } else if (file && file.size > 0) {
    return {
      success: false,
      message: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
    };
  }
  return { success: false, message: "Please select a file." };
};
// -------------------------------------------------------------------------

const Preview = () => {
  // State to manage the form submission status and result
  const [state, formAction] = React.useReducer(
    (currentState, action) => {
      return action;
    },
    { success: null, message: "", filePath: null }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // FIX: Changed this function to accept the event and use standard React form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Stop the default browser form submission
    const formData = new FormData(e.target); // Get FormData from the form element

    setIsSubmitting(true);
    const result = await mockUploadFileAction(state, formData); // Call the server action
    setIsSubmitting(false);

    // Use the reducer to update the state with the result
    formAction(result);
  };

  const isPdf = state.filePath && state.filePath.endsWith(".pdf");

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Resume Uploader & Viewer
        </h1>

        {/* File Upload Form */}
        <form
          onSubmit={handleFormSubmit} // FIX: Use onSubmit instead of action
          className="space-y-4 border p-6 rounded-lg bg-indigo-50/50"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 w-full"
            >
              Select Resume (PDF, DOC, DOCX)
            </label>
            <input
              id="file-input"
              ref={fileInputRef}
              name="file"
              type="file"
              accept=".pdf, .doc, .docx"
              required
              disabled={isSubmitting}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out font-semibold disabled:bg-indigo-400 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Uploading...
              </>
            ) : (
              "Upload Resume"
            )}
          </button>
        </form>

        {/* Status Message */}
        {state.message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              state.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* File Preview Area */}
        {state.success && state.filePath && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              File Ready for Viewing
            </h2>

            {/* Always provide a download link for all supported file types */}
            <a
              href={state.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download/Open File ({state.filePath.split("/").pop()})
            </a>

            {/* Embed Preview for PDF files */}
            {isPdf ? (
              <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden shadow-md">
                <p className="p-2 bg-gray-50 text-xs font-mono text-gray-600">
                  -- Live PDF Preview --
                </p>
                <embed
                  src={state.filePath}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                  className="block"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                * Word documents (.doc/.docx) cannot be embedded directly and
                must be downloaded/opened in a separate application.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
