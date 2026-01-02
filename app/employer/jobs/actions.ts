"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

// Zod schema for validation
const JobPostSchema = z.object({
  //   employerId: z.string().min(1, "Employer ID is required"),
  title: z.string().min(1, "Job Title is required"),
  description: z.string().min(1, "Job Description is required"),
  salaryMin: z.number().min(0, "Minimum Salary must be positive"),
  salaryMax: z.number().min(0, "Maximum Salary must be positive").optional(),
  // // Convert string from FormData to number
  //   salaryMin: z.coerce
  //     .number()
  //     .int()
  //     .positive("Minimum salary must be positive."),

  //   // Use z.coerce.number() and set it as optional/nullable
  //   salaryMax: z
  //     .preprocess(
  //       // Preprocess empty string "" to undefined so optional works correctly
  //       (val) => (val === "" ? undefined : val),
  //       z.coerce
  //         .number()
  //         .int()
  //         .positive("Maximum salary must be positive.")
  //         .optional()
  //     )
  //     .nullable(),
  location: z.string().optional(),
  address: z.string().optional(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
    .default("FULL_TIME"),
  category: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  applicationDeadLine: z.coerce.date().optional(),
  responsibilities: z
    .array(
      z.object({
        responsibility: z.string().min(1, "Responsibility is required"),
        displayOrder: z.number().int().min(1, "Display order must be positive"),
      })
    )
    .min(1, "At least one responsibility is required"),
  requirements: z
    .array(
      z.object({
        requirement: z.string().min(1, "Requirement is required"),
        displayOrder: z.number().int().min(1, "Display order must be positive"),
      })
    )
    .min(1, "At least one requirement is required"),
});

export async function jobPost(_prevState: any, formData: FormData) {
  const session = await verifySession();

  try {
    // // Parse FormData
    // const data = {
    //   //   employerId: formData.get("employerId") as string,
    //   responsibilities: JSON.parse(formData.get("responsibilities") as string),
    //   requirements: JSON.parse(formData.get("requirements") as string),
    // };

    // // This one is provide string value
    // const rawData = Object.fromEntries(formData.entries());
    // console.log(rawData, "check rawData");

    // Convert FormData to object
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      salaryMin: Number(formData.get("salaryMin")),
      salaryMax: formData.get("salaryMax")
        ? Number(formData.get("salaryMax"))
        : undefined,
      location: formData.get("location"),
      address: formData.get("address"),
      employmentType: formData.get("employmentType"),
      category: formData.get("category"),
      imageUrl: formData.get("imageUrl"),
      applicationDeadLine: formData.get("applicationDeadLine"),
      //   employerId: formData.get("employerId"),
      responsibilities: JSON.parse(formData.get("responsibilities") as string),
      requirements: JSON.parse(formData.get("requirements") as string),
    };
    console.log(data, "data");

    // Validate data
    const validatedData = JobPostSchema.parse(data);
    console.log(validatedData, "validated");

    // Check if employerId exists
    const employer = await prisma.employerProfile.findUnique({
      //   where: { id: validatedData.employerId },
      where: { userId: session?.userId },
    });

    if (!employer) {
      return {
        success: false,
        message: "Invalid Employer ID",
        errors: { employerId: "Employer ID does not exist" },
      };
    }

    console.log(employer.id, "check employerId");

    // Create job post with minimal fields (for simplicity) and nested relations
    const jobPost = await prisma.jobPost.create({
      data: {
        title: validatedData.title, // Minimal required field
        description: validatedData.description, // Minimal required field
        salaryMin: validatedData.salaryMin, // Minimal required field
        salaryMax: validatedData.salaryMax,
        location: validatedData.location,
        address: validatedData.location,
        employmentType: validatedData.employmentType,
        category: validatedData.category,
        imageUrl: validatedData.imageUrl,
        applicationDeadLine: validatedData.applicationDeadLine,
        employerId: employer.id,
        // employerId: validatedData.employerId,
        responsibilities: {
          create: validatedData.responsibilities.map((resp) => ({
            responsibility: resp.responsibility,
            displayOrder: resp.displayOrder,
          })),
        },
        requirements: {
          create: validatedData.requirements.map((req) => ({
            requirement: req.requirement,
            displayOrder: req.displayOrder,
          })),
        },
      },
    });

    // const jobPost = await prisma.jobPost.create({
    //   data: {
    //     title: "Default Title", // Minimal required field
    //     description: "Default Description", // Minimal required field
    //     salaryMin: 560, // Minimal required field
    //     employerId: employer.id,
    //     // employerId: validatedData.employerId,
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
    console.log(jobPost, "after inserted");

    return {
      success: true,
      message: "Job post created successfully",
      errors: {},
      data: jobPost,
    };
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
