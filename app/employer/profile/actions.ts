"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for profile form validation
const EmployerCompanyProfileSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  govRegisteredNumber: z.string().nullable().optional(), // Can be null or optional in the form
  phone: z.string().min(1, "Phone is required"),
  establishedDate: z.coerce.date(),
  companyEmail: z.email("Invalid email format").nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  postalcode: z.string().min(4).max(8).nullable().optional(),
  country: z.string().nullable().optional(),
  webAddress: z.string("Invalid URL format").nullable().optional(), // Use z.url() for web addresses
  industrial: z.string().nullable().optional(),
  companyDescription: z.string().nullable().optional(),
  logoUrl: z.string("Invalid URL format").nullable().optional(), // Assuming logoUrl is a URL
  // These fields are typically managed internally/by an admin, not via this form,
  // but if included, they should be validated against their possible values (Enums).
  // stats: z.enum(["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"]).optional(),
  // subscriptionPlan: z.enum(["FREE", "BASIC", "PREMIUM"]).optional(),
});

// Infer type from schema for type safety
type ValidatedData = z.infer<typeof EmployerCompanyProfileSchema>;

export const editProfile = async (state: any, formData: FormData) => {
  // 1. Session and User Verification
  const session = await verifySession();

  if (!session?.userId) {
    return {
      success: false,
      message: "Authentication failed. Please log in again.",
    };
  }
  // const userId = session.userId;

  // Check if the User exists and potentially has the correct role (optional but good practice)
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true }, // Select role to enforce security if needed
    });

    if (!user /* || user.role !== "EMPLOYER" */) {
      return {
        success: false,
        message: `User not authorized or found.`,
      };
    }
  } catch (error) {
    console.error("Database error during user check:", error);
    return {
      success: false,
      message: "A server error occurred during user verification.",
    };
  }

  // 2. Data Validation
  let validatedData: ValidatedData;
  // let validatedData: any;
  try {
    // Collect all fields from the FormData
    const rawData = Object.fromEntries(formData.entries());

    // Validate form data using Zod
    validatedData = EmployerCompanyProfileSchema.parse({
      companyName: rawData.companyName,
      govRegisteredNumber: rawData.govRegisteredNumber || null,
      phone: rawData.phone,
      establishedDate: rawData.establishedDate,
      companyEmail: rawData.companyEmail || null,
      address: rawData.address || null,
      city: rawData.city || null,
      state: rawData.state || null,
      postalcode: rawData.postalcode || null,
      country: rawData.country || null,
      webAddress: rawData.webAddress || null,
      industrial: rawData.industrial || null,
      companyDescription: rawData.companyDescription || null,
      logoUrl: rawData.logoUrl || null,
    });
    console.log(validatedData, "validateDAta");
  } catch (error) {
    // if (error instanceof z.ZodError) {
    //   // Handle Zod validation errors and return specific messages
    //   const errorMap = error.flatten().fieldErrors;
    //   const firstErrorMessage = Object.values(errorMap).flat()[0];

    //   return {
    //     success: false,
    //     message:
    //       firstErrorMessage || "Validation failed for one or more fields.",
    //     errors: errorMap, // Return detailed errors for form field highlighting
    //   };
    // }
    console.error("Error during data validation:", error);
    return {
      success: false,
      message: "Failed to process form data.",
    };
  }
  console.log(session.userId, "check id to match with database");
  try {
    // 3. Database Operation (Upsert)
    // Use upsert to handle both create and update in one operation
    await prisma.employerProfile.upsert({
      where: { userId: session.userId },
      update: {
        companyName: validatedData.companyName,
        govRegisteredNumber: validatedData.govRegisteredNumber,
        phone: validatedData.phone,
        establishedDate: validatedData.establishedDate,
        companyEmail: validatedData.companyEmail,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        postalcode: validatedData.postalcode,
        country: validatedData.country,
        webAddress: validatedData.webAddress,
        industry: validatedData.industrial,
        companyDescription: validatedData.companyDescription,
        logoUrl: validatedData.logoUrl,
      },
      create: {
        companyName: validatedData.companyName,
        govRegisteredNumber: validatedData.govRegisteredNumber,
        phone: validatedData.phone,
        establishedDate: validatedData.establishedDate,
        companyEmail: validatedData.companyEmail,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        postalcode: validatedData.postalcode,
        country: validatedData.country,
        webAddress: validatedData.webAddress,
        industry: validatedData.industrial,
        companyDescription: validatedData.companyDescription,
        logoUrl: validatedData.logoUrl,
        // Connect the new profile to the existing user
        user: {
          connect: { id: session.userId },
        },
        // The registeredNumber might be generated here or in a separate hook/trigger
        // depending on your database setup. Assuming it's nullable or handled by DB.
      },
    });

    // 4. Revalidation and Success
    // Revalidate the page that displays the employer profile data
    revalidatePath("/employer/profile"); // Adjust path as necessary
    return {
      success: true,
      message: "Company Profile saved successfully! 🎉",
    };
  } catch (error) {
    console.error("Database error during profile upsert:", error);
    return {
      success: false,
      message: "Failed to save profile due to a database error.",
    };
  }

  // // 3. Database Operation (Upsert)
  // try {
  //   // Data structure for the profile update/create
  //   // const profileData = {
  //   //   companyName: validatedData.companyName,
  //   //   govRegisteredNumber: validatedData.govRegisteredNumber,
  //   //   phone: validatedData.phone,
  //   //   establishedDate: validatedData.establishedDate,
  //   //   companyEmail: validatedData.companyEmail,
  //   //   address: validatedData.address,
  //   //   city: validatedData.city,
  //   //   state: validatedData.state,
  //   //   postalcode: validatedData.postalcode,
  //   //   country: validatedData.country,
  //   //   webAddress: validatedData.webAddress,
  //   //   industry: validatedData.industrial,
  //   //   companyDescription: validatedData.companyDescription,
  //   //   logoUrl: validatedData.logoUrl,
  //   // };
  //   // // Use upsert to handle both create and update in one operation
  //   // // It checks if an EmployerCompanyProfile already exists for this userId.
  //   // await prisma.employerCompanyProfile.upsert({
  //   //   where: { userId: userId },
  //   //   update: profileData,
  //   //   create: {
  //   //     ...profileData,
  //   //     // Connect the new profile to the existing user
  //   //     user: {
  //   //       connect: { id: userId },
  //   //     },
  //   //     // The registeredNumber might be generated here or in a separate hook/trigger
  //   //     // depending on your database setup. Assuming it's nullable or handled by DB.
  //   //   },
  //   // });
  //   // // 4. Revalidation and Success
  //   // // Revalidate the page that displays the employer profile data
  //   // revalidatePath("/employer/profile"); // Adjust path as necessary
  //   // return {
  //   //   success: true,
  //   //   message: "Company Profile saved successfully! 🎉",
  //   // };
  // } catch (error) {
  //   console.error("Database error during profile upsert:", error);
  //   return {
  //     success: false,
  //     message: "Failed to save profile due to a database error.",
  //   };
  // }
};

// "use server";

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";

// // Schema for profile form validation
// const EmployerCompanyProfileSchema = z.object({
//   // userId: z.string().min(1, "User ID is required"),
//   companyName: z.string().min(1, "Full name is required"),
//   //   registeredNumber: z.string().min(1, "First name is required"), // GENERATEED IN DATABASE
//   govRegisteredNumber: z.string().nullable(),
//   phone: z.string().min(1, "Phone is required"),
//   establishedDate: z.coerce.date(),
//   companyEmail: z.string().optional().nullable(),
//   address: z.string().optional().nullable(),
//   city: z.string().optional().nullable(),
//   state: z.string().optional().nullable(),
//   postalcode: z.string().optional().nullable(),
//   country: z.string().optional().nullable(),
//   webAddress: z.string().optional().nullable(),
//   // webAddress: z.url().optional().nullable(),
//   industrial: z.string().optional().nullable(),
//   companyDescription: z.string().optional().nullable(),
//   logoUrl: z.string().optional().nullable(),
//   // stats: z.enum(["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"]),
//   // subscriptionPlan: z.enum(["FREE", "BASIC", "PREMIUM"]),
// });

// // Schema for profile deletion
// // const DeleteFormSchema = z.object({
// //   profileId: z.string().min(1, "User ID is required"),
// // });

// // Infer type from schema for type safety
// type ValidatedData = z.infer<typeof EmployerCompanyProfileSchema>;
// // type DeleteValidatedData = z.infer<typeof DeleteFormSchema>;

// export const editProfile = async (state: any, formData: FormData) => {
//   const session = await verifySession();
//   // console.log(session, "check session on server actions");

//   if (!session?.userId) {
//     return {
//       success: false,
//       message: "Authentication failed. Please log in again.",
//     };
//   }

//   // Check if the User exists and potentially has the correct role (optional but good practice)
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: session?.userId },
//       select: { role: true }, // Select role to enforce security if needed
//     });

//     if (!user /* || user.role !== "EMPLOYER" */) {
//       return {
//         success: false,
//         message: `User not authorized or found.`,
//       };
//     }
//   } catch (error) {
//     console.error("Database error during user check:", error);
//     return {
//       success: false,
//       message: "A server error occurred during user verification.",
//     };
//   }

//   try {
//     // Log raw form data for debugging
//     // console.log(Object.fromEntries(formData), "raw formData");

//     // Validate form data
//     const validatedData = EmployerCompanyProfileSchema.parse({
//       // userId: formData.get("id"),
//       companyName: formData.get("companyName"),
//       govRegisteredNumber: formData.get("govRegisteredNumber"),
//       phone: formData.get("phone"),
//       establishedDate: formData.get("establishedDate"),
//       companyEmail: formData.get("companyEmail"),
//       address: formData.get("address"),
//       city: formData.get("city"),
//       state: formData.get("state"),
//       postalcode: formData.get("postalcode"),
//       country: formData.get("country"),
//       webAddress: formData.get("webAddress"),
//       industrial: formData.get("industrial"),
//       companyDescription: formData.get("companyDescription"),
//       logoUrl: formData.get("logoUrl"),
//       stats: formData.get("stats"),
//       subscriptionPlan: formData.get("subscriptionPlan"),
//     }) as ValidatedData;

//     // console.log(validatedData, "validateData");

//     // // Check if the User exists
//     // const user = await prisma.user.findUnique({
//     //   where: { id: session?.userId }, // later also check with role too.
//     // });

//     // if (!user) {
//     //   return {
//     //     success: false,
//     //     message: `No User found with ID: ${session?.userId}`,
//     //   };
//     // }

//     // console.log(user, "checked");
//     // Common profile data for update or create
//     const profileData = {
//       companyName: validatedData.companyName,
//       firstName: validatedData.firstName,
//       lastName: validatedData.lastName,
//       phone: validatedData.phone,
//       gender: validatedData.gender,
//       dateOfBirth: validatedData.dateOfBirth,
//       address: validatedData.address,
//       bio: validatedData.bio,
//       education: validatedData.education,
//     };

//     // // Use upsert to handle both create and update in one operation
//     // await prisma.jobSeekerProfile.upsert({
//     //   where: { userId: validatedData.userId },
//     //   update: profileData,
//     //   create: {
//     //     ...profileData,
//     //     user: {
//     //       connect: { id: validatedData.userId },
//     //     },
//     //   },
//     // });

//     // // Revalidate the profile page route
//     // revalidatePath("/profile");
//     // return { success: true, message: "Profile saved successfully" };
//   } catch (error) {
//     console.error("Error saving profile:", error);
//     return {
//       success: false,
//       message: "Failed to save profile due to an unexpected error",
//     };
//   }
// };

// // // Delete a profile (placeholder for future implementation)
// // export const deleteProfile = async (stae: any, formData: FormData) => {
// //   const validatedData = DeleteFormSchema.parse({
// //     // userId: formData.get("userId"),
// //     profileId: formData.get("profileId"),
// //   });

// //   //   console.log(validatedData);

// //   try {
// //     await prisma.jobSeekerProfile.delete({
// //       where: { id: validatedData?.profileId },
// //     });

// //     // 3. UI Refresh: Revalidate the profile page route
// //     // Replace '/profile' with the actual path where the profile data is displayed.
// //     revalidatePath("/profile");

// //     return { success: true, message: "Profile deleted successfully" };
// //   } catch (error) {
// //     console.error("Error deleting profile:", error);
// //     return { success: false, message: "Failed to delete profile" };
// //   }
// // };
