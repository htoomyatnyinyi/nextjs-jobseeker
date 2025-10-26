// app/actions.ts
"use server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the Zod schema for validation
const JobPostSchema = z.object({
  title: z.string().min(1, "Job Title is required"),
  description: z.string().min(1, "Job Description is required"),
  salaryMin: z.number().min(0, "Minimum Salary must be positive"),
  salaryMax: z.number().min(0, "Maximum Salary must be positive").optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
    .default("FULL_TIME"),
  category: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  applicationDeadLine: z.coerce.date().optional(),
  //   employerId: z.string().min(1, "Employer ID is required"),
  //   responsibilities: z
  //     .array(
  //       z.object({
  //         responsibility: z.string().min(1, "Responsibility is required"),
  //         displayOrder: z.number().int().min(1, "Display order must be positive"),
  //       })
  //     )
  //     .min(1, "At least one responsibility is required"),
  //   requirements: z
  //     .array(
  //       z.object({
  //         requirement: z.string().min(1, "Requirement is required"),
  //         displayOrder: z.number().int().min(1, "Display order must be positive"),
  //       })
  //     )
  //     .min(1, "At least one requirement is required"),
});

export async function jobPost(_prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    console.log(rawData, "check rawData");
    // // Convert FormData to object
    // const data = {
    //   title: formData.get("title"),
    //   description: formData.get("description"),
    //   salaryMin: Number(formData.get("salaryMin")),
    //   salaryMax: formData.get("salaryMax")
    //     ? Number(formData.get("salaryMax"))
    //     : undefined,
    //   location: formData.get("location"),
    //   address: formData.get("address"),
    //   employmentType: formData.get("employmentType"),
    //   category: formData.get("category"),
    //   imageUrl: formData.get("imageUrl"),
    //   applicationDeadLine: formData.get("applicationDeadLine"),
    //   //   employerId: formData.get("employerId"),
    //   //   responsibilities: JSON.parse(formData.get("responsibilities") as string),
    //   //   requirements: JSON.parse(formData.get("requirements") as string),
    // };

    // Validate the data
    const validatedData = JobPostSchema.parse(rawData);
    console.log(validatedData, "validatedData", rawData, "rawData");

    // Check if employerId exists
    const employer = await prisma.employerProfile.findUnique({
      where: { id: validatedData.employerId },
    });
    if (!employer) {
      return {
        success: false,
        message: "Invalid Employer ID",
        errors: { employerId: "Employer ID does not exist" },
      };
    }

    // // Create the job post with nested responsibilities and requirements
    // const jobPost = await prisma.jobPost.create({
    //   data: {
    //     title: validatedData.title,
    //     description: validatedData.description,
    //     salaryMin: validatedData.salaryMin,
    //     salaryMax: validatedData.salaryMax,
    //     location: validatedData.location,
    //     address: validatedData.address,
    //     employmentType: validatedData.employmentType,
    //     category: validatedData.category,
    //     imageUrl: validatedData.imageUrl,
    //     applicationDeadLine: validatedData.applicationDeadLine,
    //     employerId: validatedData.employerId,
    //     responsibilities: {
    //       create: validatedData.responsibilities.map((resp) => ({
    //         responsibility: resp.responsibility,
    //         displayOrder: resp.displayOrder,
    //       })),
    //     },
    //     requirements: {
    //       create: validatedData.requirements.map((req) => ({
    //         requirement: req.requirement,
    //         displayOrder: req.displayOrder,
    //       })),
    //     },
    //   },
    // });

    // return {
    //   success: true,
    //   message: "Job post created successfully",
    //   errors: {},
    //   data: jobPost,
    // };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Error creating job post:", error);
    return {
      success: false,
      message: "Failed to create job post",
      errors: {},
    };
  } finally {
    await prisma.$disconnect();
  }
}

// "use server";

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";

// // --- Zod Schema Definitions ---

// // Define the EmploymentType enum equivalent for Zod validation
// const EmploymentTypeEnum = z.enum([
//   "FULL_TIME",
//   "PART_TIME",
//   "CONTRACT",
//   "TEMPORARY",
//   "INTERNSHIP",
// ]);

// // Schema for Job Post form validation (mapping to your JobPost model)
// const JobPostSchema = z.object({
//   jobPostId: z.string().optional(), // Used for updating existing posts
//   title: z.string().min(3, "Job title is required"),
//   description: z
//     .string()
//     .min(20, "Job description must be at least 20 characters"),
//   salaryMin: z.coerce.number().min(0, "Minimum salary cannot be negative"),
//   salaryMax: z.coerce
//     .number()
//     .min(0, "Maximum salary cannot be negative")
//     .nullable()
//     .optional(),
//   location: z.string().min(1, "Location is required"),
//   address: z.string().nullable().optional(),
//   employmentType: EmploymentTypeEnum.default("FULL_TIME"),
//   category: z.string().min(1, "Category is required"),
//   imageUrl: z.string("Invalid URL format").nullable().optional(),
//   applicationDeadLine: z.coerce
//     .date()
//     .min(new Date(), "Deadline must be a future date"),
//   // Note: isActive is typically set internally, not by the form
// });

// // Schema for job post deletion
// const DeletePostSchema = z.object({
//   jobPostId: z.string().min(1, "Job Post ID is required for deletion"),
// });

// // Infer type from schema for type safety
// type ValidatedJobPostData = z.infer<typeof JobPostSchema>;

// // --- Server Action to Create/Edit a Job Post ---

// export const jobPost = async (state: any, formData: FormData) => {
//   // 1. Session and User Verification
//   const session = await verifySession();

//   if (!session?.userId) {
//     return {
//       success: false,
//       message: "Authentication failed. Please log in again.",
//     };
//   }
//   //   const userId = session.userId; // This is the User ID

//   // Check if the User exists and is an EMPLOYER
//   let employerProfileId: string;
//   try {
//     const employer = await prisma.employerProfile.findUnique({
//       where: { userId: session.userId },
//       select: { id: true, user: { select: { role: true } } },
//     });

//     if (!employer || employer.user.role !== "EMPLOYER") {
//       return {
//         success: false,
//         message: "User not authorized to post jobs (Must be an EMPLOYER).",
//       };
//     }
//     employerProfileId = employer.id; // This is the EmployerProfile ID needed for the JobPost relation
//   } catch (error) {
//     console.error("Database error during employer check:", error);
//     return {
//       success: false,
//       message: "A server error occurred during employer verification.",
//     };
//   }

//   // 2. Data Validation
//   let validatedData: ValidatedJobPostData;
//   const jobPostId = formData.get("jobPostId")?.toString(); // Get ID if it's an update

//   try {
//     const rawData = Object.fromEntries(formData.entries());

//     // Prepare data for validation, converting string fields to their correct types
//     const dataToValidate = {
//       jobPostId: jobPostId,
//       title: rawData.title,
//       description: rawData.description,
//       salaryMin: rawData.salaryMin, // z.coerce.number handles string to number conversion
//       salaryMax: rawData.salaryMax || null,
//       location: rawData.location,
//       address: rawData.address || null,
//       employmentType: rawData.employmentType,
//       category: rawData.category,
//       imageUrl: rawData.imageUrl || null,
//       applicationDeadLine: rawData.applicationDeadLine, // z.coerce.date handles string to Date conversion
//     };

//     // Validate form data using Zod
//     validatedData = JobPostSchema.parse(dataToValidate);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       const errorMap = error.flatten().fieldErrors;
//       const firstErrorMessage = Object.values(errorMap).flat()[0];

//       return {
//         success: false,
//         message:
//           firstErrorMessage || "Validation failed for one or more fields.",
//         errors: errorMap,
//       };
//     }
//     console.error("Error during data validation:", error);
//     return {
//       success: false,
//       message: "Failed to process form data.",
//     };
//   }

//   // 3. Database Operation (Create or Update)
//   const isUpdate = !!jobPostId;
//   const successMessage = isUpdate
//     ? "Job Post updated successfully! ✍️"
//     : "Job Post created successfully! 🎉";
//   const postData = {
//     title: validatedData.title,
//     description: validatedData.description,
//     salaryMin: validatedData.salaryMin,
//     salaryMax: validatedData.salaryMax,
//     location: validatedData.location,
//     address: validatedData.address,
//     employmentType: validatedData.employmentType,
//     category: validatedData.category,
//     imageUrl: validatedData.imageUrl,
//     applicationDeadLine: validatedData.applicationDeadLine,
//     // isActive can be managed here if you want new posts to be pending
//   };

//   console.log(successMessage, postData, "check at action");

//   try {
//     if (isUpdate) {
//       // Update existing post
//       await prisma.jobPost.update({
//         where: { id: jobPostId },
//         data: postData,
//       });
//     } else {
//       // Create new post
//       await prisma.jobPost.create({
//         data: {
//           ...postData,
//           // Connect the new job post to the employer profile
//           employer: {
//             connect: { id: employerProfileId },
//           },
//         },
//       });
//     }

//     // 4. Revalidation and Success
//     revalidatePath("/employer/dashboard"); // Revalidate the list of job posts
//     revalidatePath(`/jobs/${jobPostId}`); // Revalidate the job detail page if updating

//     return {
//       success: true,
//       message: successMessage,
//     };
//   } catch (error) {
//     console.error("Database error during job post upsert:", error);
//     return {
//       success: false,
//       message: `Failed to ${
//         isUpdate ? "update" : "create"
//       } job post due to a database error.`,
//     };
//   }
// };

// // --- Server Action to Delete a Job Post ---

// export const deleteJobPost = async (state: any, formData: FormData) => {
//   // 1. Session and User Verification (Simplified check for this example)
//   const session = await verifySession();
//   if (!session?.userId) {
//     return { success: false, message: "Authentication required." };
//   }

//   // 2. Data Validation
//   const rawData = Object.fromEntries(formData.entries());
//   let validatedData;
//   try {
//     validatedData = DeletePostSchema.parse(rawData);
//   } catch (error) {
//     return { success: false, message: "Invalid post ID for deletion." };
//   }

//   // 3. Authorization and Database Operation
//   try {
//     // 3a. Verify that the user owns this job post (Crucial security step)
//     const jobPost = await prisma.jobPost.findUnique({
//       where: { id: validatedData.jobPostId },
//       select: { employer: { select: { userId: true } } },
//     });

//     if (!jobPost || jobPost.employer.userId !== session.userId) {
//       return {
//         success: false,
//         message: "You are not authorized to delete this post.",
//       };
//     }

//     // 3b. Perform deletion
//     await prisma.jobPost.delete({
//       where: { id: validatedData.jobPostId },
//     });

//     // 4. UI Refresh: Revalidate the job list route
//     revalidatePath("/employer/dashboard");

//     return { success: true, message: "Job post deleted successfully. 👋" };
//   } catch (error) {
//     console.error("Error deleting job post:", error);
//     return {
//       success: false,
//       message: "Failed to delete job post. It may no longer exist.",
//     };
//   }
// };
