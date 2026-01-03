"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session"; // your auth helper

export async function applyToJob(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) {
    return { success: false, message: "Please login first" };
  }

  const jobPostId = formData.get("jobPostId") as string;
  const resumeId = formData.get("resumeId") as string;

  if (!jobPostId || !resumeId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    await prisma.jobApplication.create({
      data: {
        jobPostId,
        resumeId,
        // jobSeekerId: session.userId, // ← most secure
        jobSeekerProfileId: session.userId,
        status: "PENDING",
      },
    });

    revalidatePath(`/jobs/${jobPostId}`);
    revalidatePath("/dashboard/applications"); // if you have such page

    return { success: true, message: "Application submitted!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
}

export async function toggleSaveJob(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) {
    return { success: false, message: "Please login" };
  }

  const jobPostId = formData.get("jobPostId") as string;
  const isCurrentlySaved = formData.get("isSaved") === "true"; // optional

  try {
    if (isCurrentlySaved) {
      await prisma.savedJob.deleteMany({
        where: {
          jobPostId,
          jobSeekerProfile: { userId: session.userId },
        },
      });
    } else {
      await prisma.savedJob.create({
        data: {
          jobPostId,
          jobSeekerProfileId: session.userId,
        },
      });
    }

    revalidatePath(`/jobs/${jobPostId}`);
    revalidatePath("/dashboard/saved-jobs");

    return {
      success: true,
      message: isCurrentlySaved ? "Removed from saved" : "Saved!",
      saved: !isCurrentlySaved,
    };
  } catch (err) {
    return { success: false, message: "Error occurred" };
  }
}
