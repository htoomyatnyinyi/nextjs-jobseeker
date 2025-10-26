"use client";

import { uploadFile } from "./actions";

const ResumeUploadForm = () => {
  return (
    <div>
      <form action={uploadFile}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ResumeUploadForm;
