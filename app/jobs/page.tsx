import prisma from "@/lib/prisma";
import { JobLists } from "./_components/JobLists";
// import JobsMasterDetail from "./_components/JobMasterDetail";

const page = async () => {
  const jobs = await prisma.jobPost.findMany({
    include: {
      requirements: true,
      responsibilities: true,
    },
  });

  // console.log(jobs, "jobs");

  return (
    <div className="p-6 h-screen">
      <h1 className="text-3xl font-bold mb-4">Job List</h1>
      <p className="mb-8 text-gray-600">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam...
      </p>

      {/* <JobsMasterDetail jobs={jobs} /> */}
      <JobLists jobs={jobs} />
    </div>
  );
};

export default page;
