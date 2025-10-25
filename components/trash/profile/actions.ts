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
    // if (error instanceof z.ZodError) {
    //   return {
    //     success: false,
    //     errors: error.errors.map((e) => ({
    //       field: e.path.join("."),
    //       message: e.message,
    //     })),
    //   };
    // }
    // if (error instanceof Error && error.message.includes("P2025")) {
    //   return {
    //     success: false,
    //     message: `Failed to save profile: User with ID ${formData.get(
    //       "id"
    //     )} does not exist`,
    //   };
    // }
    console.error("Error saving profile:", error);
    return {
      success: false,
      message: "Failed to save profile due to an unexpected error",
    };
  }
};

// export const deleteProfile = async (formData: FormData) => {
//   try {
//     // Validate form data
//     const validatedData = DeleteFormSchema.parse({
//       userId: formData.get("userId"),
//     }) as DeleteValidatedData;

//     // Check if the User exists
//     const user = await prisma.user.findUnique({
//       where: { id: validatedData.userId },
//     });

//     if (!user) {
//       return {
//         success: false,
//         message: `No User found with ID: ${validatedData.userId}`,
//       };
//     }

//     // Delete the profile
//     await prisma.jobSeekerProfile.delete({
//       where: { userId: validatedData.userId },
//     });

//     // Revalidate the profile page route
//     revalidatePath("/profile");
//     return { success: true, message: "Profile deleted successfully" };
//   } catch (error) {
//     // if (error instanceof z.ZodError) {
//     //   return {
//     //     success: false,
//     //     errors: error.errors.map((e) => ({
//     //       field: e.path.join("."),
//     //       message: e.message,
//     //     })),
//     //   };
//     // }
//     // if (error instanceof Error && error.message.includes("P2025")) {
//     //   return {
//     //     success: false,
//     //     message: `No profile found for User with ID: ${formData.get("userId")}`,
//     //   };
//     // }
//     console.error("Error deleting profile:", error);
//     return {
//       success: false,
//       message: "Failed to delete profile due to an unexpected error",
//     };
//   }
// };

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

// "use server";

// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";
// import { ja } from "zod/v4/locales";

// // Schema for profile form validation
// const EditFormSchema = z.object({
//   userId: z.string().min(1, "User ID is required"),
//   //   profileId: z.string(),
//   fullName: z.string().min(1, "Full name is required"),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   phone: z.string().min(1, "Phone is required"),
//   gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
//   dateOfBirth: z.coerce.date(),
//   address: z.string().optional().nullable(),
//   bio: z.string().optional().nullable(),
//   education: z.string().optional().nullable(),
// });

// // Schema for profile form validation
// const DeleteFormSchema = z.object({
//   //   userId: z.string().min(1, "User ID is required"), // Renamed from 'id' for clarity
//   profileId: z.string().min(1, "Profile ID is required"), // Renamed from 'id' for clarity
// });

// // Infer type from schema for type safety
// type ValidatedData = z.infer<typeof EditFormSchema>;

// export const editProfile = async (state: any, formData: FormData) => {
//   //   console.log(formData, "formData");
//   try {
//     // Validate form data
//     const validatedData = EditFormSchema.parse({
//       userId: formData.get("id"), // userId
//       fullName: formData.get("fullName"),
//       firstName: formData.get("firstName"),
//       lastName: formData.get("lastName"),
//       phone: formData.get("phone"),
//       gender: formData.get("gender"),
//       dateOfBirth: formData.get("dateOfBirth"),
//       address: formData.get("address"),
//       bio: formData.get("bio"),
//       education: formData.get("education"),
//     }) as ValidatedData;

//     // Check if the User exists and return profileId
//     const user = await prisma.user.findUnique({
//       where: { id: validatedData.userId },

//       select: {
//         id: true,
//         jobSeekerProfile: { select: { id: true } },
//       },
//     });

//     if (!user) {
//       return {
//         success: false,
//         message: `No User found with ID: ${validatedData.userId}`,
//       };
//     }

//     if (!user?.jobSeekerProfile?.id) {
//       return {
//         message: "There is no profile",
//       };
//     }

//     // Common profile data for update or create
//     const profileData = {
//       fullName: validatedData.fullName,
//       firstName: validatedData.firstName,
//       lastName: validatedData.lastName,
//       phone: validatedData.phone,
//       gender: validatedData.gender,
//       dateOfBirth: validatedData.dateOfBirth,
//       address: validatedData.address,
//       bio: validatedData.bio,
//       education: validatedData.education,
//     };

//     // Use upsert to handle both create and update in one operation
//     await prisma.jobSeekerProfile.upsert({
//       where: { userId: validatedData.userId },
//       update: profileData,
//       create: {
//         ...profileData,
//         user: {
//           connect: { id: validatedData.userId },
//         },
//       },
//     });

//     // 3. UI Refresh: Revalidate the profile page route
//     // Replace '/profile' with the actual path where the profile data is displayed.
//     revalidatePath("/profile");

//     return { success: true, message: "Profile saved successfully" };
//   } catch (error) {
//     // if (error instanceof z.ZodError) {
//     //   return {
//     //     success: false,
//     //     // errors: error.errors.map((e): any => ({
//     //     //   field: e.path.join("."),
//     //     //   message: e.message,
//     //     // })),
//     //   };
//     // }
//     // if (error instanceof Error && error.message.includes("P2025")) {
//     //   return {
//     //     success: false,
//     //     message: `Failed to save profile: User with ID ${formData.get(
//     //       "id"
//     //     )} does not exist`,
//     //   };
//     // }
//     console.error("Error saving profile:", error);
//     return {
//       success: false,
//       message: "Failed to save profile due to an unexpected error",
//     };
//   }
// };

// // "use server";

// // import prisma from "@/lib/prisma";
// // import { revalidatePath } from "next/cache";
// // import { z } from "zod";

// // // Schema for profile form validation
// // const EditFormSchema = z.object({
// //   userId: z.string().min(1, "User ID is required"), // Renamed from 'id' for clarity
// //   //   profileId: z.string().min(1, "Profile ID is required"), // Renamed from 'id' for clarity
// //   profileId: z.string(), // Renamed from 'id' for clarity
// //   fullName: z.string().min(1, "Full name is required"),
// //   firstName: z.string().min(1, "First name is required"),
// //   lastName: z.string().min(1, "Last name is required"),
// //   phone: z.string().min(1, "Phone is required"),
// //   gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
// //   dateOfBirth: z.coerce.date(),
// //   address: z.string().optional().nullable(),
// //   bio: z.string().optional().nullable(),
// //   education: z.string().optional().nullable(),
// // });

// // // Schema for profile form validation
// // const DeleteFormSchema = z.object({
// //   userId: z.string().min(1, "User ID is required"), // Renamed from 'id' for clarity
// //   profileId: z.string().min(1, "Profile ID is required"), // Renamed from 'id' for clarity
// // });

// // // Infer type from schema for type safety
// // type ValidatedData = z.infer<typeof EditFormSchema>;

// // // Create a new profile (placeholder for future implementation)
// // export const newProfile = async () => {
// //   // Add logic for creating a new profile if needed
// //   return { message: "New profile creation not implemented" };
// // };

// // // Edit or create a profile
// // export const editProfile = async (state: any, formData: FormData) => {
// //   try {
// //     // Validate form data
// //     const validatedData = EditFormSchema.parse({
// //       //   userId: formData.get("userId"), // Form input 'id' maps to userId
// //       profileId: formData.get("id"), // Form input 'id' maps to userId
// //       fullName: formData.get("fullName"),
// //       firstName: formData.get("firstName"),
// //       lastName: formData.get("lastName"),
// //       phone: formData.get("phone"),
// //       gender: formData.get("gender"),
// //       dateOfBirth: formData.get("dateOfBirth"),
// //       address: formData.get("address"),
// //       bio: formData.get("bio"),
// //       education: formData.get("education"),
// //     }) as ValidatedData;

// //     // Common profile data for update or create
// //     const profileData = {
// //       fullName: validatedData.fullName,
// //       firstName: validatedData.firstName,
// //       lastName: validatedData.lastName,
// //       phone: validatedData.phone,
// //       gender: validatedData.gender,
// //       dateOfBirth: validatedData.dateOfBirth,
// //       address: validatedData.address,
// //       bio: validatedData.bio,
// //       education: validatedData.education,
// //     };
// //     console.log(profileData, "profileData ready to insert or update");

// //     await prisma.jobSeekerProfile.upsert({
// //       where: { userId: validatedData.userId }, // Use unique userId for 1:1 relationship
// //       update: profileData,
// //       create: {
// //         ...profileData,
// //         user: {
// //           connect: { id: validatedData.userId }, // Connect to existing User
// //         },
// //       },
// //     });

// //     // 3. UI Refresh: Revalidate the profile page route
// //     // Replace '/profile' with the actual path where the profile data is displayed.
// //     revalidatePath("/profile");

// //     return { success: true, message: "Profile saved successfully" };
// //   } catch (error) {
// //     if (error instanceof z.ZodError) {
// //       return {
// //         success: false,
// //         errors: error,
// //         // errors: error.errors.map((e: any) => ({
// //         //   field: e.path.join("."),
// //         //   message: e.message,
// //         // })),
// //       };
// //     }
// //     console.error("Error saving profile:", error);
// //     return { success: false, message: "Failed to save profile" };
// //   }
// // };

// // Delete a profile (placeholder for future implementation)
// export const deleteProfile = async (stae: any, formData: FormData) => {
//   const validatedData = DeleteFormSchema.parse({
//     // userId: formData.get("userId"),
//     profileId: formData.get("profileId"),
//   });

//   //   console.log(validatedData);

//   try {
//     await prisma.jobSeekerProfile.delete({
//       where: { id: validatedData?.profileId },
//     });

//     // 3. UI Refresh: Revalidate the profile page route
//     // Replace '/profile' with the actual path where the profile data is displayed.
//     revalidatePath("/profile");

//     return { success: true, message: "Profile deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting profile:", error);
//     return { success: false, message: "Failed to delete profile" };
//   }
// };
