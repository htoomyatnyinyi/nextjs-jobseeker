import prisma from "@/lib/prisma";
import { JobLists } from "../_components/JobLists";
import Link from "next/link";
import ApplicationForm from "./ApplicationForm";
import SaveForm from "./SaveForm";

// Define the props for the dynamic page
type JobDetailsPageProps = {
  params: {
    id: string; // The job ID from the URL (e.g., /jobs/123)
  };
};

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { id } = await params;
  // const { jobId } = params.id;

  const [job, jobs, resume, saved] = await Promise.all([
    // Fetch the single job details
    prisma.jobPost.findUnique({
      where: {
        id,
        // id: jobId,
      },
      include: {
        requirements: true,
        responsibilities: true,
      },
    }),
    // Fetch all jobs for the JobLists component
    prisma.jobPost.findMany({
      include: {
        requirements: true,
        responsibilities: true,
      },
    }),

    // update version
    prisma.resume.findMany(),

    // prisma.resume.findFirst({
    //   where: { jobSeekerProfile: { userId: id } },
    // }),

    // prisma.jobApplication.findUnique({
    //   where: { jobPostId: id },
    // }),

    // to validate the job,
    prisma.savedJob.findMany({
      where: { jobPostId: id },
    }),
  ]);

  console.log(resume, " savejob list");

  if (!job) {
    return <div>Job not found</div>;
  }

  // console.log(resume, "check for jobApplication");
  return (
    <div className="flex  ">
      {/* Add more job details here */}

      <div className="flex flex-col  p-2 m-1 mx-auto  text-sky-400 ">
        {/* {saved?.map((save) => (
          <div key={save.id}>
            {save.jobPostId === job.id ? "Saved Job" : "Not Saved Job"}
          </div>
        ))} */}
        {/* Show list of all jobs */}

        {jobs.map((job) => (
          <Link
            href={`/jobs/${job.id}`}
            key={job.id}
            className="border p-2 m-1"
          >
            {/* {job.id === saved?.jobPostId ? (
              <div className="bg-pink-500 p-5 m-5">
                Hello True {job.id} and {saved?.jobPostId}
              </div>
            ) : (
              <div className="bg-pink-500 p-5 m-5">
                World False {job.id} and {saved?.jobPostId}
              </div>
            )} */}

            <p>{job.title}</p>
            <p>{job.description}</p>
          </Link>
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-6  shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-600 mb-6">
          {job.location} | {job.employmentType}
        </p>
        <div className="flex">
          <ApplicationForm />
          {/* {saved?.id === jobs.map((job) => job.id)} */}

          <SaveForm jobPostId={id} savedJobsList={saved} />
          {/* {saved.map((s) => (
            <div>{!s?.id ? "H" : "I"}</div>
          ))} */}
          <div>{saved.length} saved jobs</div>
          {/* <div>
            {saved.map((s) => (
              <div key={s.id}>
                {s.jobPostId === job.id ? "Saved Job" : "Not Saved"}
              </div>
            ))}
          </div> */}
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1">
            {job.responsibilities.map((res) => (
              <li key={res.id}>{res.responsibility}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <ul className="list-disc list-inside space-y-1">
            {job.requirements.map((req) => (
              <li key={req.id}>{req.requirement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
