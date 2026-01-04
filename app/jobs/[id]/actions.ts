"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import z from "zod";

const SavedJobSchema = z.object({
  jobPostId: z.string().min(1, "JobPostId is Required"),
});

const ApplicationFormSchema = z.object({
  resumeId: z.string(),
  jobPostId: z.string(),
  // jobPostId: z.string(),
  jobSeekerProfileId: z.string(),
});

export const applicationJob = async (state: any, formData: FormData) => {
  console.log(state, "state in action");

  const validatedData = ApplicationFormSchema.parse({
    resumeId: formData.get("resumeId"),
    jobPostId: formData.get("jobPostId"),
    jobSeekerProfileId: formData.get("jobSeekerId"),
  });

  // logic take from formData
  // const validatedData = ApplicationFormSchema.parse({
  //   resumeId: formData.get("resumeId"),
  //   jobPostId: formData.get("jobPostId"),
  //   jobSeekerProfileId: formData.get("jobSeekerId"),
  // });

  // console.log(validatedData, "validated applicationJob");

  try {
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        resumeId: validatedData.resumeId,
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: validatedData.jobSeekerProfileId,
      },
    });

    if (existingApplication) {
      console.log("Application already exists for this resume and job post");
      return;
    }

    await prisma.jobApplication.create({
      data: {
        resumeId: validatedData.resumeId,
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: validatedData.jobSeekerProfileId,
      },
    });

    return { success: true, message: "Application Submitted Successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Application Submission Failed" };
  }
};

export const savedJob = async (state: any, formData: FormData) => {
  const session = await verifySession();

  if (!session?.userId) {
    return { success: false, message: "Please login" };
  }

  const validatedData = SavedJobSchema.parse({
    jobPostId: formData.get("jobPostId"),
  });

  // console.log(validatedData, "validated");
  try {
    const JobSeekerProfile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: session?.userId },
      select: {
        id: true,
      }, //  to return the profile id only that why i return wit selected profile id  is true
    });
    console.log(JobSeekerProfile, "JobSeekerProfileId a");

    const existingSavedJob = await prisma.savedJob.findFirst({
      where: {
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: JobSeekerProfile?.id,
      },
      // where: {
      //   jobSeekerProfileId: JobSeekerProfile?.id || "",
      // },
    });

    if (existingSavedJob) {
      // original code
      // console.log("Job already saved");
      // return;

      // modify to allow unsave
      const jobPostId = await prisma.savedJob.delete({
        where: {
          id: existingSavedJob.id,
        },
      });
      revalidatePath(`/jobs/${jobPostId.id}`);
      revalidatePath("/dashboard/saved-jobs");
    } else {
      const jobPostId = await prisma.savedJob.create({
        data: {
          jobPostId: validatedData.jobPostId,
          jobSeekerProfileId: JobSeekerProfile?.id || "",
        },
      });
      revalidatePath(`/jobs/${jobPostId.id}`);
      revalidatePath("/dashboard/saved-jobs");
    }
    // revalidatePath(`/jobs/${jobPostId.id}`);
    // revalidatePath("/dashboard/saved-jobs");

    // console.log("SavedJob Created Successfully");
    // // const savedJob = await prisma.savedJob.create({
    // //   data: {
    // //     jobPostId: validatedData.jobPostId,
    // //     // jobSeekerProfileId: profileId,
    // //     jobSeekerProfileId: JobSeekerProfileId?.id || "",
    // //   },
    // // });
    // // console.log(savedJob, "SavedJob Created Successfully");
  } catch (error) {
    console.error(error, "Failed");
  }
};

/*
"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import z from "zod";

// --- Schemas for Validation ---
const SavedJobSchema = z.object({
  jobPostId: z.string().min(1, "JobPostId is Required"),
});

const ApplicationFormSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is Required"),
  jobPostId: z.string().min(1, "Job Post ID is Required"),
  jobSeekerId: z.string().min(1, "Job Seeker ID is Required"),
});

// --- Type for Server Action Return ---
type ActionState =
  | {
      success: boolean;
      message: string;
    }
  | undefined;

// --- Server Actions ---

export const applicationJob = async (
  state: ActionState,
  formData: FormData
): Promise<ActionState> => {
  // 1. Zod Safe Parse for better error handling (optional, but good practice)
  const validation = ApplicationFormSchema.safeParse({
    resumeId: formData.get("resumeId"),
    jobPostId: formData.get("jobPostId"),
    jobSeekerId: formData.get("jobSeekerId"),
  });

  if (!validation.success) {
    console.error("Validation failed:", validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid form data provided." };
  }

  const validatedData = validation.data;

  try {
    // 2. Check for existing application
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        resumeId: validatedData.resumeId,
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: validatedData.jobSeekerId, // Using jobSeekerId from validated data
      },
    });

    if (existingApplication) {
      return { success: false, message: "Application already submitted." };
    }

    // 3. Create new application
    await prisma.jobApplication.create({
      data: {
        resumeId: validatedData.resumeId,
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: validatedData.jobSeekerId,
      },
    });

    return { success: true, message: "Application Submitted Successfully" };
  } catch (error) {
    console.error("Application Submission Failed:", error);
    return {
      success: false,
      message: "Application Submission Failed due to server error.",
    };
  }
};

export const savedJob = async (state: any, formData: FormData) => {
  const session = await verifySession();
  if (!session?.userId) {
    console.error("Session verification failed or no userId.");
    // In a real app, you would likely return an error state object or throw an error
    return;
  }

  // 1. Zod Parse with try/catch for immediate validation error handling
  let validatedData;
  try {
    validatedData = SavedJobSchema.parse({
      jobPostId: formData.get("jobPostId"),
    });
  } catch (error) {
    console.error("Saved Job Validation failed:", error);
    return;
  }

  try {
    const jobSeekerProfile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });

    const jobSeekerProfileId = jobSeekerProfile?.id;

    // 2. CRITICAL FIX: Exit if profile not found for the user
    if (!jobSeekerProfileId) {
      console.error(`No JobSeekerProfile found for userId: ${session.userId}`);
      return;
    }

    // 3. Check for existing saved job
    const existingSavedJob = await prisma.savedJob.findFirst({
      where: {
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: jobSeekerProfileId,
      },
    });

    if (existingSavedJob) {
      console.log("Job already saved");
      return;
    }

    // 4. Create new saved job
    await prisma.savedJob.create({
      data: {
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: jobSeekerProfileId,
      },
    });

    // Consider returning a state object for client-side feedback
    // return { success: true, message: "Job Saved Successfully" };
  } catch (error) {
    console.error("Saved Job Failed:", error);
    // return { success: false, message: "Failed to save job" };
  }
}; */
// "use server";

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import z from "zod";

// const SavedJobSchema = z.object({
//   jobPostId: z.string().min(1, "JobPostId is Required"),
// });

// const ApplicationFormSchema = z.object({
//   resumeId: z.string(),
//   jobPostId: z.string(),
//   // jobPostId: z.string(),
//   jobSeekerProfileId: z.string(),
// });

// export const applicationJob = async (state: any, formData: FormData) => {
//   console.log(state, "state in action");

//   const validatedData = ApplicationFormSchema.parse({
//     resumeId: formData.get("resumeId"),
//     jobPostId: formData.get("jobPostId"),
//     jobSeekerProfileId: formData.get("jobSeekerId"),
//   });

//   // console.log(validatedData, "validated applicationJob");

//   try {
//     const existingApplication = await prisma.jobApplication.findFirst({
//       where: {
//         resumeId: validatedData.resumeId,
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: validatedData.jobSeekerProfileId,
//       },
//     });

//     if (existingApplication) {
//       console.log("Application already exists for this resume and job post");
//       return;
//     }

//     await prisma.jobApplication.create({
//       data: {
//         resumeId: validatedData.resumeId,
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: validatedData.jobSeekerProfileId,
//       },
//     });

//     return { success: true, message: "Application Submitted Successfully" };
//   } catch (error) {
//     console.error(error);
//     return { success: false, message: "Application Submission Failed" };
//   }
// };

// export const savedJob = async (state: any, formData: FormData) => {
//   const session = await verifySession();
//   //   console.log("Session", session, "formData", formData);

//   const validatedData = SavedJobSchema.parse({
//     jobPostId: formData.get("jobPostId"),
//   });

//   console.log(validatedData, "validated");
//   try {
//     const JobSeekerProfile = await prisma.jobSeekerProfile.findUnique({
//       where: { userId: session?.userId },
//       select: {
//         id: true,
//       }, //  to return the profile id only that why i return wit selected profile id  is true
//     });
//     console.log(JobSeekerProfile, "JobSeekerProfileId a");

//     const existingSavedJob = await prisma.savedJob.findFirst({
//       where: {
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: JobSeekerProfile?.id,
//       },
//       // where: {
//       //   jobSeekerProfileId: JobSeekerProfile?.id || "",
//       // },
//     });

//     if (existingSavedJob) {
//       console.log("Job already saved");
//       return;
//     }

//     await prisma.savedJob.create({
//       data: {
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: JobSeekerProfile?.id || "",
//       },
//     });

//     // console.log("SavedJob Created Successfully");
//     // // const savedJob = await prisma.savedJob.create({
//     // //   data: {
//     // //     jobPostId: validatedData.jobPostId,
//     // //     // jobSeekerProfileId: profileId,
//     // //     jobSeekerProfileId: JobSeekerProfileId?.id || "",
//     // //   },
//     // // });
//     // // console.log(savedJob, "SavedJob Created Successfully");
//   } catch (error) {
//     console.error(error, "Failed");
//   }
// };

// /*
// "use server";

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import z from "zod";

// // --- Schemas for Validation ---
// const SavedJobSchema = z.object({
//   jobPostId: z.string().min(1, "JobPostId is Required"),
// });

// const ApplicationFormSchema = z.object({
//   resumeId: z.string().min(1, "Resume ID is Required"),
//   jobPostId: z.string().min(1, "Job Post ID is Required"),
//   jobSeekerId: z.string().min(1, "Job Seeker ID is Required"),
// });

// // --- Type for Server Action Return ---
// type ActionState =
//   | {
//       success: boolean;
//       message: string;
//     }
//   | undefined;

// // --- Server Actions ---

// export const applicationJob = async (
//   state: ActionState,
//   formData: FormData
// ): Promise<ActionState> => {
//   // 1. Zod Safe Parse for better error handling (optional, but good practice)
//   const validation = ApplicationFormSchema.safeParse({
//     resumeId: formData.get("resumeId"),
//     jobPostId: formData.get("jobPostId"),
//     jobSeekerId: formData.get("jobSeekerId"),
//   });

//   if (!validation.success) {
//     console.error("Validation failed:", validation.error.flatten().fieldErrors);
//     return { success: false, message: "Invalid form data provided." };
//   }

//   const validatedData = validation.data;

//   try {
//     // 2. Check for existing application
//     const existingApplication = await prisma.jobApplication.findFirst({
//       where: {
//         resumeId: validatedData.resumeId,
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: validatedData.jobSeekerId, // Using jobSeekerId from validated data
//       },
//     });

//     if (existingApplication) {
//       return { success: false, message: "Application already submitted." };
//     }

//     // 3. Create new application
//     await prisma.jobApplication.create({
//       data: {
//         resumeId: validatedData.resumeId,
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: validatedData.jobSeekerId,
//       },
//     });

//     return { success: true, message: "Application Submitted Successfully" };
//   } catch (error) {
//     console.error("Application Submission Failed:", error);
//     return {
//       success: false,
//       message: "Application Submission Failed due to server error.",
//     };
//   }
// };

// export const savedJob = async (state: any, formData: FormData) => {
//   const session = await verifySession();
//   if (!session?.userId) {
//     console.error("Session verification failed or no userId.");
//     // In a real app, you would likely return an error state object or throw an error
//     return;
//   }

//   // 1. Zod Parse with try/catch for immediate validation error handling
//   let validatedData;
//   try {
//     validatedData = SavedJobSchema.parse({
//       jobPostId: formData.get("jobPostId"),
//     });
//   } catch (error) {
//     console.error("Saved Job Validation failed:", error);
//     return;
//   }

//   try {
//     const jobSeekerProfile = await prisma.jobSeekerProfile.findUnique({
//       where: { userId: session.userId },
//       select: { id: true },
//     });

//     const jobSeekerProfileId = jobSeekerProfile?.id;

//     // 2. CRITICAL FIX: Exit if profile not found for the user
//     if (!jobSeekerProfileId) {
//       console.error(`No JobSeekerProfile found for userId: ${session.userId}`);
//       return;
//     }

//     // 3. Check for existing saved job
//     const existingSavedJob = await prisma.savedJob.findFirst({
//       where: {
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: jobSeekerProfileId,
//       },
//     });

//     if (existingSavedJob) {
//       console.log("Job already saved");
//       return;
//     }

//     // 4. Create new saved job
//     await prisma.savedJob.create({
//       data: {
//         jobPostId: validatedData.jobPostId,
//         jobSeekerProfileId: jobSeekerProfileId,
//       },
//     });

//     // Consider returning a state object for client-side feedback
//     // return { success: true, message: "Job Saved Successfully" };
//   } catch (error) {
//     console.error("Saved Job Failed:", error);
//     // return { success: false, message: "Failed to save job" };
//   }
// }; */
