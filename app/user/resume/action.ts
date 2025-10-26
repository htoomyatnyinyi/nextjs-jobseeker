"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
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
  const session = await verifySession();

  try {
    // const file = formData.get("file");
    const parsedData = UploadResumeSchema.safeParse({
      file: formData.get("file"),
    });

    if (!parsedData.success) {
      return { success: false, message: "No file selected." };
    }

    const { file } = parsedData.data;
    // console.log(
    //   file,
    //   " at file upload action",
    //   prevState,
    //   " check previous state for user seeker id"
    // );

    // // Simulate an API call for file upload
    // // In a real app, you would send 'file' to your backend
    // // using fetch or a library like Axios.
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    if (!file) {
      return { success: false, message: "No file uploaded." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join("./public/uploads", filename);
    //   const filePath = path.join(process.cwd(), "public/uploads", filename);

    console.log(buffer, filename, filePath, " at file upload");

    try {
      // 1. Get the userId (you already have this from session or context)
      //   const userId = session.userId;

      // 2. Find the user's corresponding JobSeekerProfile
      const profile = await prisma.jobSeekerProfile.findUnique({
        where: {
          // This assumes your JobSeekerProfile has a unique relation to the User
          userId: session?.userId,
        },
        select: { id: true }, // We only need the profile's ID
      });

      // 3. Handle cases where the user has no profile yet
      if (!profile) {
        console.error("No JobSeekerProfile found for user:", session?.userId);
        return { success: false, message: "User profile not found." };
      }

      // File saving logic (this part is correct)
      await writeFile(filePath, buffer);
      console.log(`File saved to ${filePath}`);

      // 4. Now, create the resume and connect BOTH relations
      await prisma.resume.create({
        data: {
          filePath: filePath,
          fileName: filename,
          fileType: file.type,
          jobSeekerProfile: {
            connect: { id: profile.id }, // Connect to the JobSeekerProfile
          },
        },
      });

      console.log("Resume created and linked to profile");
      return {
        success: true,
        message: `File "${file.name}" uploaded successfully!`,
      };
    } catch (error) {
      console.error("Error uploading resume:", error);
      return { success: false, message: "Failed to upload resume." };
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    // Return an error state
    return { success: false, message: "Error uploading file." };
  }
}
