import prisma from "@/lib/prisma";
import { JobLists } from "../_components/JobLists";
import Link from "next/link";
import ApplicationForm from "./ApplicationForm";
import SaveForm from "./SaveForm";
import { verifySession } from "@/lib/session";
import { notFound } from "next/navigation";
import SearchFilterBar from "../_components/SearchFilterBar";

// Define props
type JobDetailsPageProps = {
  params: {
    id: string;
  };
};

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const session = await verifySession();

  const awaitParams = await params;
  const jobId = awaitParams.id;

  // // Validate jobId is a valid String (optional but recommended)
  // if (!jobId || isNaN(String(jobId))) {
  //   notFound();
  // }
  if (!jobId) {
    notFound();
  }

  const [job, similarJobs, resumes, savedJob, profile] = await Promise.all([
    prisma.jobPost.findUnique({
      where: { id: String(jobId) },
      include: {
        requirements: true,
        responsibilities: true,
        employer: true, // if you have company relation
      },
    }),
    prisma.jobPost.findMany({
      where: {
        id: { not: String(jobId) }, // exclude current job
      },
      take: 5,
      include: {
        requirements: true,
        responsibilities: true,
      },
    }),
    prisma.resume.findMany({
      where: {
        jobSeekerProfile: { userId: session?.userId },
      },
    }),
    prisma.savedJob.findFirst({
      where: {
        jobPostId: String(jobId),
        jobSeekerProfile: { userId: session?.userId },
      },
    }),
    prisma.jobSeekerProfile.findFirst({
      where: { userId: session?.userId },
      include: {
        savedJobs: true,
        resumes: true,
      },
    }),
  ]);

  // If job not found → 404
  if (!job) {
    notFound();
  }

  const isSaved = !!savedJob?.savedAt;
  // const isSaved = !!savedJob;
  // console.log(savedJob, profile, "check", isSaved);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto p-6">
      {/* Sidebar: Similar Jobs */}
      <aside className="w-full lg:w-80">
        {/* <h2 className="text-2xl font-bold mb-4 text-sky-600">Similar Jobs</h2> */}
        <div className="space-y-3">
          {similarJobs.map((similarJob) => (
            <Link
              key={similarJob.id}
              href={`/jobs/${similarJob.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{similarJob.title}</h3>
              <p className="text-sm text-sky-600">
                {similarJob.location} • {similarJob.employmentType}
              </p>
              <p className="text-sky-700 mt-2 line-clamp-2">
                {similarJob.description}
              </p>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className=" shadow-xl rounded-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-sky-500">{job.title}</h1>
              <p className="text-xl text-sky-600 mt-2">
                {job.location} • {job.employmentType}
              </p>
            </div>
            {/* <SaveForm jobPostId={job.id} /> */}
            <SaveForm jobPostId={job.id} isSaved={isSaved} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <ApplicationForm
              jobPostId={job.id}
              resumes={resumes}
              resumeId={resumes[0]?.id}
              // defaultResumeId={resumes[0]?.id}
            />
          </div>

          {/* Job Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-sky-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </section>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-sky-700">
                {job.responsibilities.map((res) => (
                  <li key={res.id}>{res.responsibility}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-sky-700">
                {job.requirements.map((req) => (
                  <li key={req.id}>{req.requirement}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Optional: Company Info */}
          {job.employer && (
            <div className="mt-10 pt-8 border-t">
              <p className="text-sm text-sky-500">
                Posted by{" "}
                <span className="font-medium">{job.employer.companyName}</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobDetailsPage;

// import prisma from "@/lib/prisma";
// import { JobLists } from "../_components/JobLists";
// import Link from "next/link";
// import ApplicationForm from "./ApplicationForm";
// import SaveForm from "./SaveForm";
// import { verifySession } from "@/lib/session";

// // Define the props for the dynamic page
// type JobDetailsPageProps = {
//   params: {
//     id: string; // The job ID from the URL (e.g., /jobs/123)
//   };
// };

// const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
//   const session = await verifySession(); // may be necessary
//   const { id } = await params;
//   // const { jobId } = params.id;

//   const [job, jobs, resume, saved, test] = await Promise.all([
//     // Fetch the single job details
//     prisma.jobPost.findUnique({
//       where: {
//         id,
//         // id: jobId,
//       },
//       include: {
//         requirements: true,
//         responsibilities: true,
//       },
//     }),
//     // Fetch all jobs for the JobLists component
//     prisma.jobPost.findMany({
//       include: {
//         requirements: true,
//         responsibilities: true,
//       },
//     }),

//     // update version
//     prisma.resume.findMany({
//       where: { jobSeekerProfile: { userId: session?.userId } },
//     }),

//     // prisma.resume.findFirst({
//     //   where: { jobSeekerProfile: { userId: id } },
//     // }),

//     // prisma.jobApplication.findUnique({
//     //   where: { jobPostId: id },
//     // }),

//     // to validate the job,
//     prisma.savedJob.findMany({
//       where: {
//         jobPostId: id,
//         jobSeekerProfile: { userId: session?.userId },
//       },
//     }),

//     prisma.jobSeekerProfile.findMany({
//       where: { userId: session?.userId },
//       include: {
//         savedJobs: true,
//         resumes: true,
//         // jobApplications: true,
//       },
//     }),
//   ]);

//   // console.log(resume, " test list");

//   if (!job) {
//     return <div>Job not found</div>;
//   }

//   // console.log(resume, "check for jobApplication");
//   return (
//     <div className="flex  ">
//       {/* Add more job details here */}

//       <div className="flex flex-col  p-2 m-1 mx-auto  text-sky-400 ">
//         {/* {saved?.map((save) => (
//           <div key={save.id}>
//             {save.jobPostId === job.id ? "Saved Job" : "Not Saved Job"}
//           </div>
//         ))} */}
//         {/* Show list of all jobs */}

//         {jobs.map((job) => (
//           <Link
//             href={`/jobs/${job.id}`}
//             key={job.id}
//             className="border p-2 m-1"
//           >
//             {/* {job.id === saved?.jobPostId ? (
//               <div className="bg-pink-500 p-5 m-5">
//                 Hello True {job.id} and {saved?.jobPostId}
//               </div>
//             ) : (
//               <div className="bg-pink-500 p-5 m-5">
//                 World False {job.id} and {saved?.jobPostId}
//               </div>
//             )} */}

//             <p>{job.title}</p>
//             <p>{job.description}</p>
//           </Link>
//         ))}
//       </div>

//       <div className="max-w-4xl mx-auto p-6  shadow-lg rounded-lg">
//         <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
//         <p className="text-sky-600 mb-6">
//           {job.location} | {job.employmentType}
//         </p>
//         <div className="flex">
//           {/* <ApplicationForm jobPostId={id} resumeId={resume[0].id} /> */}
//           <ApplicationForm
//             jobPostId={id}
//             resumes={resume}
//             resumeId={resume[0]?.id}
//           />
//           {/* {saved?.id === jobs.map((job) => job.id)} */}

//           <SaveForm jobPostId={id} />
//           {/* <SaveForm jobPostId={id} savedJobsList={saved} /> */}

//           <div>{saved.length} saved jobs</div>
//         </div>
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Description</h2>
//           <p className="text-sky-700">{job.description}</p>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
//           <ul className="list-disc list-inside space-y-1">
//             {job.responsibilities.map((res) => (
//               <li key={res.id}>{res.responsibility}</li>
//             ))}
//           </ul>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Requirements</h2>
//           <ul className="list-disc list-inside space-y-1">
//             {job.requirements.map((req) => (
//               <li key={req.id}>{req.requirement}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobDetailsPage;
