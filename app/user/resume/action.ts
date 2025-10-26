"use server";

import { writeFile } from "fs/promises";
import path from "path";
import z from "zod";

// This is your server-side or API action to handle the file upload
// In a real application, this would likely be a separate file or API route

const UploadResumeSchema = z.object({
  // file: z.instanceof(File),
  file: z.file().refine((file) => file instanceof File, {
    message: "Invalid file upload.",
  }),
});
export async function uploadFileAction(prevState: any, formData: FormData) {
  try {
    // const file = formData.get("file");

    const parsedData = UploadResumeSchema.safeParse({
      file: formData.get("file"),
    });

    if (!parsedData.success) {
      return { success: false, message: "No file selected." };
    }

    const { file } = parsedData.data;
    console.log(file, " at file upload action");

    // // Simulate an API call for file upload
    // // In a real app, you would send 'file' to your backend
    // // using fetch or a library like Axios.
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    if (!file) {
      return { success: false, message: "No file uploaded." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", filename);
    //   const filePath = path.join(process.cwd(), "public/uploads", filename); // i think need to create folder first or not it show errror.
    // console.log("File uploaded:", file.name, file.size);

    console.log(buffer, filename, filePath, " at file upload");
    try {
      await writeFile(filePath, buffer);
      console.log(`File saved to ${filePath}`);
      return {
        success: true,
        message: `File "${file.name}" uploaded successfully.`,
      };
    } catch (error) {
      console.error("Error saving file:", error);
      return { success: false, message: "Failed to upload file." };
    }

    // // Return a success state
    // return {
    //   success: true,
    //   message: `File uploaded successfully!`,
    //   //   message: `File "${file.name}" uploaded successfully!`,
    // };
  } catch (error) {
    console.error("Error uploading file:", error);
    // Return an error state
    return { success: false, message: "Error uploading file." };
  }
}
