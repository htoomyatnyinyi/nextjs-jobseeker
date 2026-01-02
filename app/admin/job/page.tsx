import prisma from "@/lib/prisma";

const page = async () => {
  const jobs = await prisma.jobPost.findMany();
  return <div>{jobs.map((job) => job.title)}</div>;
};

export default page;
