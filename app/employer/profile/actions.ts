"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for profile form validation
const EditFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  dateOfBirth: z.coerce.date(),
  address: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
});

// Schema for profile deletion
const DeleteFormSchema = z.object({
  profileId: z.string().min(1, "User ID is required"),
});

// Infer type from schema for type safety
type ValidatedData = z.infer<typeof EditFormSchema>;
// type DeleteValidatedData = z.infer<typeof DeleteFormSchema>;

export const editProfile = async (state: any, formData: FormData) => {
  try {
    // Log raw form data for debugging
    console.log(Object.fromEntries(formData), "raw formData");

    // Validate form data
    const validatedData = EditFormSchema.parse({
      userId: formData.get("id"),
      fullName: formData.get("fullName"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      dateOfBirth: formData.get("dateOfBirth"),
      address: formData.get("address"),
      bio: formData.get("bio"),
      education: formData.get("education"),
    }) as ValidatedData;

    // Check if the User exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return {
        success: false,
        message: `No User found with ID: ${validatedData.userId}`,
      };
    }

    // Common profile data for update or create
    const profileData = {
      fullName: validatedData.fullName,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
      gender: validatedData.gender,
      dateOfBirth: validatedData.dateOfBirth,
      address: validatedData.address,
      bio: validatedData.bio,
      education: validatedData.education,
    };

    // Use upsert to handle both create and update in one operation
    await prisma.jobSeekerProfile.upsert({
      where: { userId: validatedData.userId },
      update: profileData,
      create: {
        ...profileData,
        user: {
          connect: { id: validatedData.userId },
        },
      },
    });

    // Revalidate the profile page route
    revalidatePath("/profile");
    return { success: true, message: "Profile saved successfully" };
  } catch (error) {
    console.error("Error saving profile:", error);
    return {
      success: false,
      message: "Failed to save profile due to an unexpected error",
    };
  }
};

// Delete a profile (placeholder for future implementation)
export const deleteProfile = async (stae: any, formData: FormData) => {
  const validatedData = DeleteFormSchema.parse({
    // userId: formData.get("userId"),
    profileId: formData.get("profileId"),
  });

  //   console.log(validatedData);

  try {
    await prisma.jobSeekerProfile.delete({
      where: { id: validatedData?.profileId },
    });

    // 3. UI Refresh: Revalidate the profile page route
    // Replace '/profile' with the actual path where the profile data is displayed.
    revalidatePath("/profile");

    return { success: true, message: "Profile deleted successfully" };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { success: false, message: "Failed to delete profile" };
  }
};
