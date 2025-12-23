import prisma from "@/lib/prisma";

const page = async () => {
  const a = await prisma.jobApplication.findMany();
  console.log(a, "jobapplication all list");
  return (
    <div>
      <h1>Preview the Employer Job post info </h1>
      <p>and </p>
      <h1>Preview the Job seeker applied profile and resume</h1>
      {a.map((b) => (
        <div>
          <p>{b.jobSeekerProfileId}</p>
          <p>{b.applicationStatus}</p>
          <p>{b.resumeId}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
