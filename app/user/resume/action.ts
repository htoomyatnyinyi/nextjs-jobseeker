"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function deleteResumeAction(resumeId: string) {
  const session = await verifySession();
  if (!session) return { success: false, message: "Unauthorized" };
  // console.log(resumeId, "resumeId at delete action");
  try {
    // 1. Get the resume details from DB
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { jobSeekerProfile: true },
    });

    if (!resume) return { success: false, message: "Resume not found" };

    // 2. Security Check: Ensure this resume belongs to the logged-in user
    if (resume.jobSeekerProfile.userId !== session.userId) {
      return { success: false, message: "Permission denied" };
    }

    // 3. Delete from Cloudinary
    // If you didn't save publicId, you can try to extract it from the URL:
    const publicId = resume.filePath
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    // console.log(
    //   resume.filePath,
    //   "resume file path at delete action",
    //   publicId,
    //   " extracted publicId at delete action"
    // );

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw", // or "image" depending on how it was uploaded
        // resource_type: "pdf", // or "image" depending on how it was uploaded
      });
    }

    // Alternative using extracted publicId
    // if (resume.publicId) {
    //   await cloudinary.uploader.destroy(resume.publicId, {
    //     resource_type: "raw", // or "image" depending on how it was uploaded
    //   });
    // }

    // 4. Delete from Database
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    revalidatePath("/user/resume");
    return { success: true, message: "Resume deleted successfully" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete resume" };
  }
}

export async function uploadFileAction(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session) return { success: false, message: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { success: false, message: "No file provided" };
  }

  // 1. Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // 2. Upload to Cloudinary using a Promise wrapper
    const result = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto", // Allows PDFs and other docs
            folder: "resumes", // Organizes files in Cloudinary
            access_mode: "public", // update test if not necessary can remove
            type: "upload", // update test if not necessary can remove

            public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    })) as any;

    // 3. Find the User's Profile
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) return { success: false, message: "Profile not found" };

    // 4. Save to Database
    await prisma.resume.create({
      data: {
        fileName: file.name,
        filePath: result.secure_url, // This is the Cloudinary HTTPS link
        fileType: file.type,
        jobSeekerId: profile.id,
      },
    });

    revalidatePath("/user/resume"); // Refresh the UI
    return { success: true, message: "Resume uploaded successfully!" };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return { success: false, message: "Upload failed. Please try again." };
  }
}

// // current working code but no cloud storage implemented
// "use server";

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import { writeFile } from "fs/promises";
// import path from "path";
// import z from "zod";

// // Define the allowed MIME types for PDF and Word documents
// const ALLOWED_MIME_TYPES = [
//   "application/pdf",
//   "application/msword", // .doc
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
// ];

// // Update the Zod schema to enforce file type validation
// const UploadResumeSchema = z.object({
//   file: z
//     .instanceof(File)
//     .refine((file) => file.size > 0, {
//       message: "File cannot be empty.",
//     })
//     .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
//       message: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
//     }),
// });

// export async function uploadFileAction(prevState: any, formData: FormData) {
//   const session = await verifySession();

//   try {
//     const parsedData = UploadResumeSchema.safeParse({
//       file: formData.get("file"),
//     });

//     if (!parsedData.success) {
//       // Return the specific error message from the Zod validation
//       const errorMessage =
//         parsedData.error.message || "No file selected or file type is invalid.";
//       return { success: false, message: errorMessage };
//     }

//     const { file } = parsedData.data;

//     // // Simulate an API call for file upload
//     // // In a real app, you would send 'file' to your backend
//     // // using fetch or a library like Axios.
//     // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

//     if (!file) {
//       return { success: false, message: "No file uploaded." };
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filename = `${Date.now()}-${file.name}`;

//     // 1. Path to save the file on the server's file system
//     const serverFilePath = path.join(process.cwd(), "public/uploads", filename);

//     // 2. Path to store in the database for public URL access (relative to the 'public' folder)
//     const publicFilePath = path.join("/uploads", filename);

//     console.log(`Attempting to save: ${filename}`);

//     try {
//       // Find the user's corresponding JobSeekerProfile
//       const profile = await prisma.jobSeekerProfile.findUnique({
//         where: {
//           userId: session?.userId,
//         },
//         select: { id: true },
//       });

//       // Handle cases where the user has no profile yet
//       if (!profile) {
//         console.error("No JobSeekerProfile found for user:", session?.userId);
//         return { success: false, message: "User profile not found." };
//       }

//       // File saving logic (Use the serverFilePath for writing the file)
//       await writeFile(serverFilePath, buffer);
//       console.log(`File saved to ${serverFilePath}`);

//       // Create the resume record using the public file path
//       await prisma.resume.create({
//         data: {
//           filePath: publicFilePath, // Storing the public access path
//           fileName: filename,
//           fileType: file.type,
//           jobSeekerProfile: {
//             connect: { id: profile.id },
//           },
//         },
//       });

//       console.log("Resume created and linked to profile");
//       return {
//         success: true,
//         message: `File "${file.name}" uploaded successfully!`,
//         filePath: publicFilePath, // <-- ADDED: Return the public path for preview
//       };
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//       return {
//         success: false,
//         message:
//           "Failed to upload resume due to a database or file system error.",
//       };
//     }
//   } catch (error) {
//     console.error("Error processing file upload:", error);
//     // Return an error state if parsing or other initial steps fail
//     return {
//       success: false,
//       message: "An unexpected error occurred during upload processing.",
//     };
//   }
// }

// // "use server";

// // import prisma from "@/lib/prisma";
// // import { verifySession } from "@/lib/session";
// // import { writeFile } from "fs/promises";
// // import path from "path";
// // import z from "zod";

// // // This is your server-side or API action to handle the file upload
// // // In a real application, this would likely be a separate file or API route

// // // const UploadResumeSchema = z.object({
// // //   // file: z.instanceof(File),
// // //   file: z.file().refine((file) => file instanceof File, {
// // //     message: "Invalid file upload.",
// // //   }),
// // // });

// // // Define the allowed MIME types for PDF and Word documents
// // const ALLOWED_MIME_TYPES = [
// //   "application/pdf",
// //   "application/msword", // .doc
// //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
// // ];

// // // Update the Zod schema to enforce file type validation
// // const UploadResumeSchema = z.object({
// //   file: z
// //     .instanceof(File)
// //     .refine((file) => file.size > 0, {
// //       message: "File cannot be empty.",
// //     })
// //     .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
// //       message: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
// //     }),
// // });

// // export async function uploadFileAction(prevState: any, formData: FormData) {
// //   const session = await verifySession();

// //   try {
// //     // const file = formData.get("file");
// //     const parsedData = UploadResumeSchema.safeParse({
// //       file: formData.get("file"),
// //     });

// //     if (!parsedData.success) {
// //       return { success: false, message: "No file selected." };
// //     }

// //     const { file } = parsedData.data;

// //     // // Simulate an API call for file upload
// //     // // In a real app, you would send 'file' to your backend
// //     // // using fetch or a library like Axios.
// //     // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

// //     if (!file) {
// //       return { success: false, message: "No file uploaded." };
// //     }

// //     const buffer = Buffer.from(await file.arrayBuffer());
// //     const filename = `${Date.now()}-${file.name}`;
// //     const filePath = path.join("./public/uploads", filename);
// //     //   const filePath = path.join(process.cwd(), "public/uploads", filename);

// //     console.log(buffer, filename, filePath, " at file upload");

// //     try {
// //       // 1. Get the userId (you already have this from session or context)
// //       //   const userId = session.userId;

// //       // 2. Find the user's corresponding JobSeekerProfile
// //       const profile = await prisma.jobSeekerProfile.findUnique({
// //         where: {
// //           // This assumes your JobSeekerProfile has a unique relation to the User
// //           userId: session?.userId,
// //         },
// //         select: { id: true }, // We only need the profile's ID
// //       });

// //       // 3. Handle cases where the user has no profile yet
// //       if (!profile) {
// //         console.error("No JobSeekerProfile found for user:", session?.userId);
// //         return { success: false, message: "User profile not found." };
// //       }

// //       // File saving logic (this part is correct)
// //       await writeFile(filePath, buffer);
// //       console.log(`File saved to ${filePath}`);

// //       // 4. Now, create the resume and connect BOTH relations
// //       await prisma.resume.create({
// //         data: {
// //           filePath: filePath,
// //           fileName: filename,
// //           fileType: file.type,
// //           jobSeekerProfile: {
// //             connect: { id: profile.id }, // Connect to the JobSeekerProfile
// //           },
// //         },
// //       });

// //       console.log("Resume created and linked to profile");
// //       return {
// //         success: true,
// //         message: `File "${file.name}" uploaded successfully!`,
// //       };
// //     } catch (error) {
// //       console.error("Error uploading resume:", error);
// //       return { success: false, message: "Failed to upload resume." };
// //     }
// //   } catch (error) {
// //     console.error("Error uploading file:", error);
// //     // Return an error state
// //     return { success: false, message: "Error uploading file." };
// //   }
// // }

// // /*
// // // This is AI Generated Version

// // "use server";

// // import prisma from "@/lib/prisma";
// // import { verifySession } from "@/lib/session";
// // import { writeFile } from "fs/promises";
// // import path from "path";
// // import z from "zod";

// // // Define the allowed MIME types for PDF and Word documents
// // const ALLOWED_MIME_TYPES = [
// //   "application/pdf",
// //   "application/msword", // .doc
// //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
// // ];

// // // Update the Zod schema to enforce file type validation
// // const UploadResumeSchema = z.object({
// //   file: z.instanceof(File)
// //     .refine((file) => file.size > 0, {
// //       message: "File cannot be empty.",
// //     })
// //     .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
// //       message: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
// //     }),
// // });

// // export async function uploadFileAction(prevState: any, formData: FormData) {
// //   const session = await verifySession();

// //   try {
// //     const parsedData = UploadResumeSchema.safeParse({
// //       file: formData.get("file"),
// //     });

// //     if (!parsedData.success) {
// //       // Return the specific error message from the Zod validation
// //       const errorMessage = parsedData.error.errors[0]?.message || "No file selected or file type is invalid.";
// //       return { success: false, message: errorMessage };
// //     }

// //     const { file } = parsedData.data;

// //     if (!file) {
// //       return { success: false, message: "No file uploaded." };
// //     }

// //     const buffer = Buffer.from(await file.arrayBuffer());
// //     const filename = `${Date.now()}-${file.name}`;

// //     // 1. Path to save the file on the server's file system
// //     const serverFilePath = path.join(process.cwd(), "public/uploads", filename);

// //     // 2. Path to store in the database for public URL access (relative to the 'public' folder)
// //     const publicFilePath = path.join("/uploads", filename);

// //     console.log(`Attempting to save: ${filename}`);

// //     try {
// //       // Find the user's corresponding JobSeekerProfile
// //       const profile = await prisma.jobSeekerProfile.findUnique({
// //         where: {
// //           userId: session?.userId,
// //         },
// //         select: { id: true },
// //       });

// //       // Handle cases where the user has no profile yet
// //       if (!profile) {
// //         console.error("No JobSeekerProfile found for user:", session?.userId);
// //         return { success: false, message: "User profile not found." };
// //       }

// //       // File saving logic (Use the serverFilePath for writing the file)
// //       await writeFile(serverFilePath, buffer);
// //       console.log(`File saved to ${serverFilePath}`);

// //       // Create the resume record using the public file path
// //       await prisma.resume.create({
// //         data: {
// //           filePath: publicFilePath, // Storing the public access path
// //           fileName: filename,
// //           fileType: file.type,
// //           jobSeekerProfile: {
// //             connect: { id: profile.id },
// //           },
// //         },
// //       });

// //       console.log("Resume created and linked to profile");
// //       return {
// //         success: true,
// //         message: `File "${file.name}" uploaded successfully!`,
// //       };
// //     } catch (error) {
// //       console.error("Error uploading resume:", error);
// //       return { success: false, message: "Failed to upload resume due to a database or file system error." };
// //     }
// //   } catch (error) {
// //     console.error("Error processing file upload:", error);
// //     // Return an error state if parsing or other initial steps fail
// //     return { success: false, message: "An unexpected error occurred during upload processing." };
// //   }
// // }
// //  */
