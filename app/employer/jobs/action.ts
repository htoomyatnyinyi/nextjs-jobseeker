"use server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { verifySession } from "@/lib/session";

const prisma = new PrismaClient();

// Zod schema for validation
const JobPostSchema = z.object({
  //   employerId: z.string().min(1, "Employer ID is required"),
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

export async function jobPostArr(_prevState: any, formData: FormData) {
  const session = await verifySession();

  try {
    // no necessary
    // // get employerId from database with userId
    // const employerId = await prisma.employerProfile.findFirst({
    //   where: { userId: session?.userId },
    //   select: { id: true },
    // });

    // Parse FormData
    const data = {
      //   employerId: formData.get("employerId") as string,
      responsibilities: JSON.parse(formData.get("responsibilities") as string),
      requirements: JSON.parse(formData.get("requirements") as string),
    };

    // Validate data
    const validatedData = JobPostSchema.parse(data);

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
        title: "Default Title", // Minimal required field
        description: "Default Description", // Minimal required field
        salaryMin: 560, // Minimal required field
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
