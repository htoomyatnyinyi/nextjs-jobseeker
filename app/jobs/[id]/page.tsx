import prisma from "@/lib/prisma";
import { JobLists } from "../_components/JobLists";
import Link from "next/link";

// Define the props for the dynamic page
type JobDetailsPageProps = {
  params: {
    id: string; // The job ID from the URL (e.g., /jobs/123)
  };
};

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { id } = await params;
  // const { jobId } = params.id;

  const [job, jobs] = await Promise.all([
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
  ]);
  if (!job) {
    return <div>Job not found</div>;
  }

  // // Fetch the single job details
  // const job = await prisma.jobPost.findUnique({
  //   where: {
  //     id: jobId,
  //   },
  //   include: {
  //     requirements: true,
  //     responsibilities: true,
  //   },
  // });

  // if (!job) {
  //   return <div className="text-center p-8">Job not found.</div>;
  // }

  return (
    <div className="flex  ">
      {/* Add more job details here */}

      <div className="flex flex-col  p-2 m-1 mx-auto  text-sky-400 ">
        {jobs.map((job) => (
          <Link
            href={`/jobs/${job.id}`}
            key={job.id}
            className="border p-2 m-1"
          >
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
