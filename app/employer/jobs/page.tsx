import { verifySession } from "@/lib/session";
// import JobPostForm from "./JobPostForm";
import prisma from "@/lib/prisma";
import { DateFilter } from "@/lib/common/DateTime";
import JobForm from "./JobForm";

const page = async () => {
  const session = await verifySession();

  // const employerJobs = await prisma.jobPost.findMany({
  //   where: { employerId: session?.userId },
  // });

  const employerJobs = await prisma.jobPost.findMany({
    where: { employer: { userId: session?.userId } },
  });

  return (
    <div>
      <h1>JobSection List</h1>

      {employerJobs?.map((job) => (
        <div key={job.id} className="flex flex-col p-2 m-1 border text-sky-400">
          <p>{job.title}</p>
          <p>{job.description}</p>
          <p>{String(job.salaryMin)}</p>
          <p>{String(job.salaryMax)}</p>
          <p>{job.isActive}</p>
          <p>{job.address}</p>
          <p>{job.employmentType}</p>
          <p>{job.location}</p>
          <p>{job.category}</p>
          <p>{DateFilter({ date: job.postedAt })}</p>
          <p>{DateFilter({ date: job.applicationDeadLine })}</p>
        </div>
      ))}
      <JobForm />

      {/* <JobPostForm /> */}
    </div>
  );
};

export default page;
