"use client"; // This directive is necessary for client-side components in Next.js

import React, { useActionState } from "react";
import { uploadFileAction } from "./action";

// // This is your server-side or API action to handle the file upload
// // In a real application, this would likely be a separate file or API route
// async function uploadFileAction(prevState, formData) {
//   try {
//     const file = formData.get("file");

//     if (!file) {
//       return { success: false, message: "No file selected." };
//     }

//     // Simulate an API call for file upload
//     // In a real app, you would send 'file' to your backend
//     // using fetch or a library like Axios.
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

//     console.log("File uploaded:", file.name, file.size);

//     // Return a success state
//     return {
//       success: true,
//       message: `File "${file.name}" uploaded successfully!`,
//     };
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     // Return an error state
//     return { success: false, message: "Error uploading file." };
//   }
// }

const FileUploadForm = () => {
  // useActionState takes your action function and an initial state
  const [uploadStatus, formAction, isUploading] = useActionState(
    uploadFileAction,
    null
  );

  return (
    <form action={formAction}>
      <input type="file" name="file" required />
      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </button>

      {uploadStatus && (
        <p className={uploadStatus.success ? "text-green-500" : "text-red-500"}>
          {uploadStatus.message}
        </p>
      )}
    </form>
  );
};

export default FileUploadForm;
