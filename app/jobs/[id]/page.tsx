import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import JobLists from "../_components/JobLists"; // Using the design we just made
import ApplicationForm from "./ApplicationForm";
import SaveForm from "./SaveForm";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const session = await verifySession();
  const { id } = await params;

  // Optimized parallel data fetching
  const [job, allJobs, resumes, savedStatus] = await Promise.all([
    prisma.jobPost.findUnique({
      where: { id },
      include: { requirements: true, responsibilities: true },
    }),
    prisma.jobPost.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.resume.findMany({
      where: { jobSeekerProfile: { userId: session?.userId } },
    }),
    prisma.savedJob.findFirst({
      where: {
        jobPostId: id,
        jobSeekerProfile: { userId: session?.userId },
      },
    }),
  ]);

  if (!job) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden ">
      {/* LEFT SIDEBAR: Job List */}
      <aside className="w-full max-w-sm border-r overflow-y-auto hidden md:block">
        <div className="p-4 border-b  sticky top-0 z-10">
          <h2 className="text-xl font-bold ">Available Positions</h2>
          <p className="text-xs ">{allJobs.length} jobs found</p>
        </div>
        <div className="p-2">
          {/* Reuse the JobLists component we designed in the previous step */}
          <JobLists jobs={allJobs} selectedId={id} />
        </div>
      </aside>

      {/* RIGHT CONTENT: Job Details */}
      <main className="flex-1 overflow-y-auto ">
        <div className="max-w-7xl mx-auto p-8">
          {/* Top Header Section */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-3 0 font-medium">
                <span className="flex items-center"> {job.location}</span>
                <span className="">|</span>
                <span className="flex items-center">{job.employmentType}</span>
                <span className="">|</span>
                <span className="text-green-600">
                  ${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-50">
              <SaveForm jobPostId={id} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 0">Job Description</h2>
                <p className="0 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              <section className=" p-6 rounded-2xl border border-blue-100">
                <h2 className="text-2xl font-bold mb-4 0">Responsibilities</h2>
                <ul className="grid gap-3">
                  {job.responsibilities.map((res) => (
                    <li key={res.id} className="flex gap-3 ">
                      <span className="text-blue-500 font-bold">•</span>
                      {res.responsibility}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 0">Requirements</h2>
                <ul className="grid gap-3">
                  {job.requirements.map((req) => (
                    <li
                      key={req.id}
                      className="flex gap-3  border-l-4 border-gray-200 pl-4"
                    >
                      {req.requirement}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar Column: Action Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-0 p-6 border rounded-2xl shadow-sm ">
                <h3 className="text-lg font-bold mb-4">Ready to Apply?</h3>
                <ApplicationForm
                  jobPostId={id}
                  resumes={resumes}
                  // resumeId={resumes[0]?.id}
                />
                <p className="text-[10px] text-gray-400 mt-4 text-center">
                  By clicking Apply, you agree to share your profile and resume
                  with the employer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailsPage;
// import prisma from "@/lib/prisma";
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
//             <p>{job.employmentType}</p>
//             <p>Posted On: {job.postedAt.toDateString()}</p>
//           </Link>
//         ))}
//       </div>

//       <div className="max-w-4xl mx-auto p-6  shadow-lg rounded-lg">
//         <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
//         <p className="text-gray-600 mb-6">
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
//           <p className="text-gray-700">{job.description}</p>
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
