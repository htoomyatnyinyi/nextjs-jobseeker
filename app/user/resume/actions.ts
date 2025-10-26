// app/actions.ts
"use server";

import { writeFile } from "fs/promises";
import path from "path";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, message: "No file uploaded." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public", filename);
  //   const filePath = path.join(process.cwd(), "public/uploads", filename); // i think need to create folder first or not it show errror.

  console.log(buffer, filename, filePath, " at file upload");
  try {
    await writeFile(filePath, buffer);
    console.log(`File saved to ${filePath}`);
    return { success: true, message: "File uploaded successfully." };
  } catch (error) {
    console.error("Error saving file:", error);
    return { success: false, message: "Failed to upload file." };
  }
}
