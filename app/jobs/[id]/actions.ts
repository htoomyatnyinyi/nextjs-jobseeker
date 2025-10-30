"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import z from "zod";

const SavedJobSchema = z.object({
  jobPostId: z.string().min(1, "JobPostId is Required"),
});

export const savedJob = async (state: any, formData: FormData) => {
  const session = await verifySession();
  //   console.log("Session", session, "formData", formData);

  const validatedData = SavedJobSchema.parse({
    jobPostId: formData.get("jobPostId"),
  });

  console.log(validatedData, "validated");
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
      console.log("Job already saved");
      return;
    }

    await prisma.savedJob.create({
      data: {
        jobPostId: validatedData.jobPostId,
        jobSeekerProfileId: JobSeekerProfile?.id || "",
      },
    });

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
