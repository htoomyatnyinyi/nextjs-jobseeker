import prisma from "@/lib/prisma";
// import JobsMasterDetail from "./_components/JobMasterDetail";
import JobLists from "./_components/JobLists";

const page = async () => {
  const rawJobs = await prisma.jobPost.findMany({
    include: {
      requirements: true,
      responsibilities: true,
    },
  });

  // Convert Decimal objects to standard Numbers
  const jobs = rawJobs.map((job) => ({
    ...job,
    salaryMin: job.salaryMin?.toNumber() || 0,
    salaryMax: job.salaryMax?.toNumber() || 0,
  }));

  return (
    <div className="p-6 h-screen">
      {/* <JobsMasterDetail jobs={jobs} /> */}
      <JobLists jobs={jobs} />
    </div>
  );
};

export default page;
