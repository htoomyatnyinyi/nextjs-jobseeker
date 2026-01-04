"use client";

import { useActionState, useRef } from "react";
import { uploadFileAction } from "./action";

const FileUploadForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, formAction, isUploading] = useActionState(
    uploadFileAction,
    {
      success: false,
      message: "",
    }
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={formAction} className="space-y-4">
        {/* Modern File Drop Zone Styling */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative group cursor-pointer
            flex flex-col items-center justify-center 
            p-8 border-2 border-dashed rounded-2xl transition-all
            ${
              isUploading
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50/30 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            required
            className="hidden" // Hide the ugly default input
            accept=".pdf"
            disabled={isUploading}
          />

          {/* Icon and Text */}
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            {isUploading ? "⏳" : "📤"}
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-gray-700">
              {isUploading ? "Uploading Resume..." : "Click to upload resume"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports PDF (Max 5MB)</p>
          </div>

          {/* Progress Overlay if uploading */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Action Button (Optional if you want it to submit automatically on select) */}
        {!isUploading && (
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
          >
            Confirm Upload
          </button>
        )}

        {/* Feedback Messages */}
        {uploadStatus?.message && (
          <div
            className={`
            p-3 rounded-lg text-sm font-medium text-center animate-in fade-in slide-in-from-top-2
            ${
              uploadStatus.success
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }
          `}
          >
            {uploadStatus.success ? "✅ " : "❌ "}
            {uploadStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUploadForm;
// "use client";

// import { useActionState } from "react";
// import { uploadFileAction } from "./action";

// const FileUploadForm = () => {
//   const [uploadStatus, formAction, isUploading] = useActionState(
//     uploadFileAction,
//     {
//       success: false,
//       message: "",
//     }
//   );

//   // console.log(uploadStatus, "check");
//   // The comment seciont is very important to upload file to cloudinary

//   return (
//     <form action={formAction}>
//       <input
//         type="file"
//         name="file"
//         required
//         placeholder="Resume File Upload Here!"
//         // className="p-2 m-1 border border-sky-500 "
//       />
//       <button
//         type="submit"
//         disabled={isUploading}
//         className="p-2 m-1 border border-sky-500 "
//       >
//         {isUploading ? "Uploading..." : "Upload File"}
//       </button>

//       {uploadStatus && (
//         <p className={uploadStatus.success ? "text-green-500" : "text-red-500"}>
//           {uploadStatus.message}
//         </p>
//       )}
//     </form>
//   );
// };

// export default FileUploadForm;

// // // This is your server-side or API action to handle the file upload
// // // In a real application, this would likely be a separate file or API route
// // async function uploadFileAction(prevState, formData) {
// //   try {
// //     const file = formData.get("file");

// //     if (!file) {
// //       return { success: false, message: "No file selected." };
// //     }

// //     // Simulate an API call for file upload
// //     // In a real app, you would send 'file' to your backend
// //     // using fetch or a library like Axios.
// //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

// //     console.log("File uploaded:", file.name, file.size);

// //     // Return a success state
// //     return {
// //       success: true,
// //       message: `File "${file.name}" uploaded successfully!`,
// //     };
// //   } catch (error) {
// //     console.error("Error uploading file:", error);
// //     // Return an error state
// //     return { success: false, message: "Error uploading file." };
// //   }
// // }
