import { verifySession } from "@/lib/session";
import JobPostForm from "./JobPostForm";
import prisma from "@/lib/prisma";
import { DateFilter } from "@/lib/common/DateTime";

const page = async () => {
  const session = await verifySession();

  // const employerJobs = await prisma.jobPost.findMany({
  //   where: { employerId: session?.userId },
  // });

  const employerJobs = await prisma.jobPost.findMany({
    where: { employer: { userId: session?.userId } },
  });

  // const employerJobs = await prisma.employerProfile.findMany({
  //   where: { id: session?.userId },
  //   include: {
  //     JobPosts: true,
  //   },
  // });

  console.log(employerJobs, "employerJobs");

  return (
    <div>
      <h1>JobSection</h1>

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
      <JobPostForm />
    </div>
  );
};

export default page;

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";

// const page = async () => {
//   const session = await verifySession();
//   console.log(session, "session");
//   const jobs = await prisma.jobPost.findMany();

//   console.log(jobs, "jobs at jobs path");
//   return (
//     <div>
//       <h1>Job List</h1>
//       <p>
//         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
//         aliquid voluptates voluptatem enim fuga dolorum ratione sunt debitis
//         expedita quia est sapiente aperiam culpa, ducimus tenetur nam ullam,
//         sequi earum?
//       </p>
//       {jobs?.map((job) => (
//         <div className="flex flex-col p-2 m-1 border">
//           <p>{job.title}</p>
//           <p>{job.description}</p>
//           {/* <p>{job.salaryMin}</p> */}
//           {/* <p>{job.salaryMax}</p> */}
//           <p>{job.location}</p>
//           <p>{job.address}</p>
//           <p>{job.employmentType}</p>
//           <p>{job.category}</p>
//           {/* <p>{job.applicationDeadLine}</p> */}
//           {/* <p>{job.postedAt}</p> */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default page;
